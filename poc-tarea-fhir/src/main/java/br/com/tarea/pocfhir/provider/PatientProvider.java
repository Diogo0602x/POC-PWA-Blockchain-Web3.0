package br.com.tarea.pocfhir.provider;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.HumanName.NameUse;
import org.hl7.fhir.r4.model.IdType;
import org.hl7.fhir.r4.model.Identifier.IdentifierUse;
import org.hl7.fhir.r4.model.Patient;
import org.springframework.stereotype.Controller;

import br.com.tarea.pocfhir.repo.PatientRepository;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.annotation.Create;
import ca.uhn.fhir.rest.annotation.Delete;
import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.OptionalParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.annotation.ResourceParam;
import ca.uhn.fhir.rest.annotation.Search;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.param.DateParam;
import ca.uhn.fhir.rest.param.StringParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.UnprocessableEntityException;
import ca.uhn.fhir.validation.FhirValidator;
import ca.uhn.fhir.validation.ValidationResult;

@Controller
public class PatientProvider implements IResourceProvider {

	private final PatientRepository repository;
	private final FhirContext fhirContext;
	private final FhirValidator validator;
	
	public PatientProvider(final PatientRepository repository, final FhirContext fhirContext, final FhirValidator validator) {
		super();
		this.repository = repository;
		this.fhirContext = fhirContext;
		this.validator = validator;
	}

	@Override
	public Class<? extends IBaseResource> getResourceType() {
		return Patient.class;
	}

    @Search
    public List<Patient> search(
            @OptionalParam(name = Patient.SP_NAME)
            final StringParam name,
            
            @OptionalParam(name = Patient.SP_BIRTHDATE)
            DateParam birthDate,
            
            @OptionalParam(name = "cpf")
            StringParam cpf) {
    	
    	Patient pat = new Patient();
    	
    	if (cpf != null && StringUtils.isNotBlank(cpf.getValue())) {
	    	pat.addIdentifier()
	    		.setValue(cpf.getValue())
	    		.setUse(IdentifierUse.OFFICIAL)
	    		.getType()
	    			.addCoding()
		    			.setCode("TAX")
		    			.setSystem("http://terminology.hl7.org/CodeSystem/v2-0203");
    	}
    	
    	if (name != null && StringUtils.isNotBlank(name.getValue())) {
    		pat.addName().setUse(NameUse.OFFICIAL).setText(name.getValue());
    	}
    	
    	if (birthDate != null && birthDate.getValue() != null) {
    		pat.setBirthDate( birthDate.getValue() );
    	}
    	
    	return repository.find(pat);
    }
    
	@Read
	public Patient read(@IdParam IdType patientId) {
		final Patient pat = new Patient();
		pat.setId(patientId);
		
		List<Patient> to = repository.find(pat);
		
		if (to != null && !to.isEmpty()) {
			return to.stream().findFirst().orElse(null);
		} else {
			return null;
		}
	}

	@Create
	public MethodOutcome create(@ResourceParam final Patient thePatient) {
		if (thePatient.getIdentifierFirstRep().isEmpty()) {
			throw new UnprocessableEntityException("No identifier supplied");
		} else {
			final ValidationResult vr = validator.validateWithResult(thePatient);
			if (!vr.isSuccessful()) {
				throw new UnprocessableEntityException(fhirContext, vr.toOperationOutcome());
			}
		}

		repository.put(thePatient);

		final MethodOutcome retVal = new MethodOutcome();
		retVal.setId(new IdType(thePatient.fhirType(), thePatient.getId()));

		return retVal;
	}
	
	@Delete
	public void delete(@IdParam IdType patientId) {
		final Patient pat = new Patient();
		pat.setId(patientId);
		
		repository.remove(pat);
	}
}
