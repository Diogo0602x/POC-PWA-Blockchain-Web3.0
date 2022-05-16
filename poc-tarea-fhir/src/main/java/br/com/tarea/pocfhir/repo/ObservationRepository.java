package br.com.tarea.pocfhir.repo;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.Observation;
import org.hl7.fhir.r4.model.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import br.com.tarea.pocfhir.model.StoreTO;
import br.com.tarea.pocfhir.service.FhirPathService;

@Component
public class ObservationRepository {
	protected static final Logger LOG = LoggerFactory.getLogger(ObservationRepository.class);
	
	private final MicrostreamFhirRepository repo;
	private final FhirPathService fhirPath;

	public ObservationRepository(final MicrostreamFhirRepository repo, final  FhirPathService fhirPath) {
		this.repo = repo;
		this.fhirPath = fhirPath;
	}

	public String genId() {
		return repo.genId();
	}
	
	private String getPatientId(final IBaseResource rsc) {
		final String value = fhirPath.getValueByExpression("Observation.subject.reference", rsc);
		final Reference ref = new Reference(value);
		return ref.getReferenceElement().getIdPart();
	}
	
	private String getOrganizationId(final IBaseResource rsc) {
		final String value = fhirPath.getValueByExpression("Observation.performer.first().reference", rsc);
		final Reference ref = new Reference(value);
		return ref.getReferenceElement().getIdPart();
	}
	
	private ZonedDateTime getIssued(final IBaseResource rsc) {
		return fhirPath.getDateTimeByExpression("Observation.issued", rsc);
	}
	
	private String getStatus(final IBaseResource rsc) {
		return fhirPath.getValueByExpression("Observation.status.value", rsc);
	}
	
	private ZonedDateTime getEffective(final IBaseResource rsc) {
		return fhirPath.getDateTimeByExpression("Observation.effective", rsc);
	}
	
	private String getCodeSystem(final IBaseResource rsc) {
		return fhirPath.getValueByExpression("Observation.code.coding.first().system.value", rsc);
	}
	
	private String getCodeValue(final IBaseResource rsc) {
		return fhirPath.getValueByExpression("Observation.code.coding.first().code.value", rsc);
	}
	
	private Observation toFhir(final String json) {
		return (Observation)fhirPath.fromJson(json);
	}
	
	public List<Observation> find(final Observation obs) {
		if (obs == null) {
			return null;
		}
		
		final String id;
		if (obs.hasId()) {
			id = obs.getIdElement().getIdPart();
		} else {
			id = null;
		}
		
		final String patientId = getPatientId(obs);
		final String organizationId = getOrganizationId(obs);
		final String codeSystem = getCodeSystem(obs);
		final String codeValue = getCodeValue(obs);
		
		if (repo.observations() == null) {
			return Collections.emptyList();
		} else if (StringUtils.isAllBlank(id, patientId, organizationId, codeSystem, codeValue)) {
			return Collections.emptyList();
		} else {
			return repo.observations().stream()
					.filter(item -> {
						if (StringUtils.equals(id, item.getId())) {
							return true;
						}
						
						final boolean samePatient = StringUtils.equals(patientId, item.getPatientId());
						final boolean sameOrganization = StringUtils.equals(organizationId, item.getOrganizationId());
						final boolean sameCodeSystem = StringUtils.equals(codeSystem, item.getCodeSystem());
						final boolean sameCodeValue = StringUtils.equals(codeValue, item.getCodeValue());
						
						if (samePatient) {
							boolean rtn = sameOrganization || sameCodeSystem || sameCodeValue; 
							return samePatient || rtn;
						}
						
						if (sameOrganization) {
							boolean rtn = samePatient || sameCodeSystem || sameCodeValue; 
							return sameOrganization || rtn;
						}
						
						return false;
					})
					.map(item -> {
						final Observation rtn = toFhir(item.getFhirAsJson());
						rtn.setId(item.getId());
						return rtn;
					})
					.collect(Collectors.toList());
		}
	}
	
	public void put(final Observation obs) {
		final String codeSystem = getCodeSystem(obs);
		final String codeValue = getCodeValue(obs);
		final String patientId = getPatientId(obs);
		final String organizationId = getOrganizationId(obs);
		final String status = getStatus(obs);
		final ZonedDateTime issued = getIssued(obs);
		final ZonedDateTime effective = getEffective(obs);
		final String type = obs.fhirType();
		
		String id = obs.getIdElement().getIdPart();
		String json = fhirPath.toJson(obs);
		
		boolean notFound = true;
		
		for (StoreTO.Observation item : repo.observations()) {
			if (StringUtils.equals(item.getId(), id)) {
				item.setId(id);
				item.setCodeSystem(codeSystem);
				item.setCodeValue(codeValue);
				item.setEffective(effective);
				item.setFhirAsJson(json);
				item.setIssued(issued);
				item.setOrganizationId(organizationId);
				item.setPatientId(patientId);
				item.setStatus(status);
				item.setType(type);
				notFound = false;
			}
		}
		
		if (notFound) {
			id = genId();
			obs.setId(id);
			json = fhirPath.toJson(obs);
			
			final StoreTO.Observation item = StoreTO.Observation.builder()
					.id(id)
					.fhirAsJson(json)
					.type(type)
					.codeSystem(codeSystem)
					.codeValue(codeValue)
					.issued(issued)
					.organizationId(organizationId)
					.patientId(patientId)
					.status(status)
					.build();
			repo.observations().add(item);
		}
		
		repo.observationsPersist();
	}
	
	public void remove(final Observation obs) {
		if (obs != null && obs.hasId()) {
			final Iterator<StoreTO.Observation> it = repo.observations().iterator();
			final String id = StringUtils.firstNonBlank(obs.getIdElement().getIdPart(), "#ERR#");
			while (it.hasNext()) {
				final StoreTO.Observation item = it.next();
				if (StringUtils.equals(item.getId(), id)) {
					it.remove();
				}
			}
			repo.observationsPersist();
		}
	}
}
