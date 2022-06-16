package br.com.tarea.pocfhir.repo;

import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.Organization;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import br.com.tarea.pocfhir.model.StoreTO;
import br.com.tarea.pocfhir.service.FhirPathService;
import br.com.tarea.pocfhir.utils.MrzEncoder;

@Component
public class OrganizationRepository {
	protected static final Logger LOG = LoggerFactory.getLogger(OrganizationRepository.class);
	
	private final MicrostreamFhirRepository repo;
	private final FhirPathService fhirPath;

	public OrganizationRepository(final MicrostreamFhirRepository repo, final  FhirPathService fhirPath) {
		this.repo = repo;
		this.fhirPath = fhirPath;
	}

	public String genId() {
		return repo.genId();
	}
	
	private String getOrgNome(final IBaseResource rsc) {
		return fhirPath.getValueByExpression("name", rsc);
	}
	
	private String getCnpj(final IBaseResource rsc) {
		return fhirPath.getValueByExpression(""
				+ "Organization.identifier"
    			+ ".where("
    			+ "   use='official'"
    			+ "   and type.coding.system='http://terminology.hl7.org/CodeSystem/v2-0203'"
    			+ "   and type.coding.code='TAX'"
    			+ ")"
    			+ ".value"
    			+ "", rsc);
	}
	
	private Organization toFhirOrg(final String json) {
		return (Organization)fhirPath.fromJson(json);
	}
	
	public List<Organization> find(final Organization org) {
		if (org == null) {
			return null;
		}
		
		final String id;
		if (org.hasId()) {
			id = org.getIdElement().getIdPart();
		} else {
			id = null;
		}
		
		final String nome = getOrgNome(org);
		
		if (repo.organizations() == null) {
			return Collections.emptyList();
		} else if (StringUtils.isAllBlank(id, nome)) {
			return Collections.emptyList();
		} else {
			return repo.organizations().stream()
					.filter(item -> {
						final String _nome;
						if (StringUtils.isNotBlank(nome)) {
							_nome = MrzEncoder.encode(nome);
						} else {
							_nome = null;
						}
						
						if (StringUtils.equals(id, item.getId())) {
							return true;
						} else {
							final Organization fhir = toFhirOrg(item.getFhirAsJson());
							final String __nome;
							if (_nome != null) {
								__nome = StringUtils.trimToNull(getOrgNome(fhir));
							} else {
								__nome = null;
							}
							
							if (__nome != null) {
								LOG.info("find by name");
								return StringUtils.contains(MrzEncoder.encode(__nome), _nome);
							}
							return false;
						}
					})
					.map(item -> {
						final Organization rtn = toFhirOrg(item.getFhirAsJson());
						rtn.setId(item.getId());
						return rtn;
					})
					.collect(Collectors.toList());
		}
	}
	
	public void put(final Organization org) {
		final String nome = getOrgNome(org);
		final String json = fhirPath.toJson(org);
		final String type = org.fhirType();
		final String id = getCnpj(org);
		
		boolean notFound = true;
		
		for (StoreTO.Organization item : repo.organizations()) {
			if (StringUtils.equals(item.getId(), id)) {
				item.setId(id);
				item.setFhirAsJson(json);
				item.setNome(nome);
				item.setType(type);
				notFound = false;
			}
		}
		
		if (notFound) {
			final StoreTO.Organization item = StoreTO.Organization.builder()
					.id(id)
					.nome(nome)
					.fhirAsJson(json)
					.nome(nome)
					.type(type)
					.build();
			repo.organizations().add(item);
		}
		
		repo.organizationsPersist();
	}
	
	public void remove(final Organization org) {
		if (org != null && org.hasId()) {
			final Iterator<StoreTO.Organization> it = repo.organizations().iterator();
			final String id = StringUtils.firstNonBlank(org.getIdElement().getIdPart(), "#ERR#");
			while (it.hasNext()) {
				final StoreTO.Organization item = it.next();
				if (StringUtils.equals(item.getId(), id)) {
					it.remove();
				}
			}
			repo.organizationsPersist();
		}
	}
}
