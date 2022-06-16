package br.com.tarea.pocfhir.provider;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.IdType;
import org.hl7.fhir.r4.model.Organization;
import org.springframework.stereotype.Controller;

import br.com.tarea.pocfhir.repo.OrganizationRepository;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.annotation.Create;
import ca.uhn.fhir.rest.annotation.Delete;
import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.annotation.RequiredParam;
import ca.uhn.fhir.rest.annotation.ResourceParam;
import ca.uhn.fhir.rest.annotation.Search;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.param.StringParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.UnprocessableEntityException;
import ca.uhn.fhir.validation.FhirValidator;
import ca.uhn.fhir.validation.ValidationResult;

@Controller
public class OrganizationProvider implements IResourceProvider {

	private final OrganizationRepository repository;
	private final FhirContext fhirContext;
	private final FhirValidator validator;
	
	public OrganizationProvider(final OrganizationRepository repository, final FhirContext fhirContext, final FhirValidator validator) {
		super();
		this.repository = repository;
		this.fhirContext = fhirContext;
		this.validator = validator;
	}

	@Override
	public Class<? extends IBaseResource> getResourceType() {
		return Organization.class;
	}

    @Search
    public List<Organization> search(
    		@RequiredParam(name = Organization.SP_NAME)
            final StringParam name) {
    	
    	
    	if (name == null || name.isEmpty()) {
    		throw new UnprocessableEntityException("Parameter 'name' invalid");
    	}
    	
    	final Organization org = new Organization();
    	
    	
    	if (name != null && StringUtils.isNotBlank(name.getValue())) {
    		org.setName(name.getValue());
    	}
    	
    	return repository.find(org);
    }
    
	@Read
	public Organization read(@IdParam IdType organizationId) {
		final Organization org = new Organization();
		org.setId(organizationId);
		
		List<Organization> to = repository.find(org);
		
		if (to != null && !to.isEmpty()) {
			return to.stream().findFirst().orElse(null);
		} else {
			return null;
		}
	}

	@Create
	public MethodOutcome create(@ResourceParam final Organization theOrganization) {
		if (theOrganization.getIdentifierFirstRep().isEmpty()) {
			throw new UnprocessableEntityException("No identifier supplied");
		} else {
			final ValidationResult vr = validator.validateWithResult(theOrganization);
			if (!vr.isSuccessful()) {
				throw new UnprocessableEntityException(fhirContext, vr.toOperationOutcome());
			}
		}

		repository.put(theOrganization);

		final MethodOutcome retVal = new MethodOutcome();
		retVal.setId(new IdType(theOrganization.fhirType(), theOrganization.getId()));

		return retVal;
	}
	
	@Delete
	public void delete(@IdParam IdType organizationId) {
		final Organization org = new Organization();
		org.setId(organizationId);
		repository.remove(org);
	}
}
