package br.com.tarea.pocfhir.repo;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.hl7.fhir.r4.model.Patient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import br.com.tarea.pocfhir.model.StoreTO;
import br.com.tarea.pocfhir.service.FhirPathService;
import br.com.tarea.pocfhir.utils.MrzEncoder;

@Component
public class PatientRepository {
	protected static final Logger LOG = LoggerFactory.getLogger(PatientRepository.class);
	
	private final MicrostreamFhirRepository repo;
	private final FhirPathService fhirPath;

	public PatientRepository(final MicrostreamFhirRepository repo, final  FhirPathService fhirPath) {
		this.repo = repo;
		this.fhirPath = fhirPath;
	}

	private String patientCpf(final Patient pat) {
		return fhirPath.getValueByExpression(""
				+ "Patient.identifier"
    			+ ".where("
    			+ "   use='official'"
    			+ "   and type.coding.system='http://terminology.hl7.org/CodeSystem/v2-0203'"
    			+ "   and type.coding.code='TAX'"
    			+ ")"
    			+ ".value"
    			+ "", pat);
	}
	
	private String patientNome(final Patient pat) {
		return StringUtils.trim(fhirPath.getValueByExpression("Patient.name.where(use='official').text", pat));
	}
	
	private ZonedDateTime patientDob(final Patient pat) {
		return fhirPath.getDateTimeByExpression("Patient.birthDate", pat);
	}
	
	public String genId() {
		return repo.genId();
	}

	public List<Patient> find(final Patient pat) {
		if (pat == null) {
			return null;
		}
		
		final String id;
		if (pat.hasId()) {
			id = pat.getIdElement().getIdPart();
		} else {
			id = null;
		}
		
		final String cpf = patientCpf(pat);
		final ZonedDateTime dob = patientDob(pat);
		final String nome = patientNome(pat);
		
		if (repo.patients() == null) {
			return Collections.emptyList();
		} else if (StringUtils.isAllBlank(id, cpf, (dob == null ? null : dob.toString()), nome)) {
			return Collections.emptyList();
		} else {
			return repo.patients().stream()
					.filter(item -> {
						final String _nome;
						if (StringUtils.isNotBlank(nome)) {
							_nome = MrzEncoder.encode(nome);
						} else {
							_nome = null;
						}
						
						if (StringUtils.equals(id, item.getId())) {
							return true;
						}  if (StringUtils.equals(cpf, item.getCpf())) {
							return true;
						} else {
							final Patient fhir = (Patient)fhirPath.fromJson(item.getFhirAsJson());
							final String __nome;
							if (_nome != null) {
								__nome = StringUtils.trimToNull(patientNome(fhir));
							} else {
								__nome = null;
							}
							
							final ZonedDateTime __dob;
							if (dob != null) {
								__dob = patientDob(pat);
							} else {
								__dob = null;
							}
							
							if (__dob != null && __nome != null) {
								return __dob.equals(dob) && StringUtils.contains(MrzEncoder.encode(__nome), _nome);
							} else if (__nome != null) {
								return StringUtils.contains(MrzEncoder.encode(__nome), _nome);
							} else if (__dob != null) {
								return __dob.equals(dob);
							}
							
							return false;
						}
					})
					.map(item -> {
						final Patient rtn = (Patient)fhirPath.fromJson(item.getFhirAsJson());
						rtn.setId(item.getId());
						return rtn;
					})
					.collect(Collectors.toList());
		}
	}
	
	public void put(final Patient pat) {
		final String cpf = patientCpf(pat);
		final String nome = patientNome(pat);
		final String json = fhirPath.toJson(pat);
		final String type = pat.fhirType();
		final ZonedDateTime dob = patientDob(pat);
		
		final String id;
		if (StringUtils.isBlank(cpf)) {
			id = genId();
		} else {
			id = cpf;
		}
		
		if (!pat.hasId()) {
			pat.setId(id);
		}
		
		boolean notFound = true;
		
		for (StoreTO.Patient item : repo.patients()) {
			if (StringUtils.equals(item.getId(), cpf)) {
				item.setId(id);
				item.setFhirAsJson(json);
				item.setNome(nome);
				item.setType(type);
				item.setCpf(cpf);
				item.setDob(dob);
				notFound = false;
			}
		}
		
		if (notFound) {
			final StoreTO.Patient item = StoreTO.Patient.builder()
					.id(id)
					.nome(nome)
					.fhirAsJson(json)
					.nome(nome)
					.type(type)
					.cpf(cpf)
					.dob(dob)
					.build();
			repo.patients().add(item);
		}
		
		repo.patientsPersist();
	}
	
	public void remove(final Patient pat) {
		if (pat != null && pat.hasId()) {
			final Iterator<StoreTO.Patient> it = repo.patients().iterator();
			final String id = StringUtils.firstNonBlank(pat.getIdElement().getIdPart(), "#ERR#");
			while (it.hasNext()) {
				final StoreTO.Patient item = it.next();
				if (StringUtils.equals(item.getId(), id)) {
					it.remove();
				}
			}
			repo.patientsPersist();
		}
	}
}
