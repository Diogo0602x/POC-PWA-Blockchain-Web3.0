package br.com.tarea.pocfhir.provider;

import java.util.List;

import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.HumanName;
import org.hl7.fhir.r4.model.HumanName.NameUse;
import org.hl7.fhir.r4.model.IdType;
import org.hl7.fhir.r4.model.Observation;
import org.hl7.fhir.r4.model.Organization;
import org.hl7.fhir.r4.model.Patient;
import org.hl7.fhir.r4.model.Reference;
import org.springframework.stereotype.Controller;

import br.com.tarea.pocfhir.repo.ObservationRepository;
import br.com.tarea.pocfhir.service.CodeSystemService;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.annotation.Create;
import ca.uhn.fhir.rest.annotation.Delete;
import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.OptionalParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.annotation.ResourceParam;
import ca.uhn.fhir.rest.annotation.Search;
import ca.uhn.fhir.rest.annotation.Update;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.UnprocessableEntityException;
import ca.uhn.fhir.validation.FhirValidator;
import ca.uhn.fhir.validation.ValidationResult;

@Controller
public class ObservationProvider implements IResourceProvider {

	private final ObservationRepository repository;
	private final FhirContext fhirContext;
	private final FhirValidator validator;
	private final CodeSystemService csService;
	private final PatientProvider patProvider;
	private final OrganizationProvider orgProvider;
	
	public ObservationProvider(final ObservationRepository repository, 
			final FhirContext fhirContext, 
			final FhirValidator validator, 
			final CodeSystemService csService,
			final PatientProvider patProvider,
			final OrganizationProvider orgProvider) {
		super();
		this.repository = repository;
		this.fhirContext = fhirContext;
		this.validator = validator;
		this.csService = csService;
		this.patProvider = patProvider;
		this.orgProvider = orgProvider;
	}

	@Override
	public Class<? extends IBaseResource> getResourceType() {
		return Observation.class;
	}

    @Search
    public List<Observation> search(
    		@OptionalParam(name=Observation.SP_SUBJECT) 
    		final ReferenceParam thePatient,
    		
    		@OptionalParam(name=Observation.SP_PERFORMER) 
    		final ReferenceParam thePerformer) {
    	final Observation rsc = new Observation();
    	
    	if (thePatient != null && thePatient.hasResourceType()) {
    		rsc.setSubject(new Reference(String.format("%s/%s", thePatient.getResourceType(), thePatient.getIdPart())));
    	}
    	
    	if (thePerformer != null && thePerformer.hasResourceType()) {
    		rsc.addPerformer(new Reference(String.format("%s/%s", thePerformer.getResourceType(), thePerformer.getIdPart())));
    	}
    	
    	List<Observation> rtn = repository.find(rsc);
    	
    	if (rtn != null) {
    		rtn.stream().forEach(this::fillAdditionalData);
    	}
    	
    	return rtn;
    }
    
	@Read
	public Observation read(@IdParam IdType theId) {
		final Observation rsc = new Observation();
		rsc.setId(theId);
		
		List<Observation> to = repository.find(rsc);
		
		if (to != null && !to.isEmpty()) {
			final Observation rtn = to.stream().findFirst().orElse(null);
			fillAdditionalData(rtn);
			return rtn;
		} else {
			return null;
		}
	}

	@Create
	public MethodOutcome create(@ResourceParam final Observation theResource) {
		if (theResource.getIdentifierFirstRep().isEmpty()) {
			throw new UnprocessableEntityException("No identifier supplied");
		} else {
			final ValidationResult vr = validator.validateWithResult(theResource);
			if (!vr.isSuccessful()) {
				throw new UnprocessableEntityException(fhirContext, vr.toOperationOutcome());
			}
		}

		repository.put(theResource);

		final MethodOutcome retVal = new MethodOutcome();
		retVal.setId(new IdType(theResource.fhirType(), theResource.getId()));

		return retVal;
	}
	
	@Update
	public MethodOutcome update(@IdParam IdType theId, @ResourceParam final Observation theResource) {
		final ValidationResult vr = validator.validateWithResult(theResource);
		
		if (!vr.isSuccessful()) {
			throw new UnprocessableEntityException(fhirContext, vr.toOperationOutcome());
		}
		
		theResource.setId(theId);
		repository.put(theResource);
		
		final MethodOutcome retVal = new MethodOutcome();
		retVal.setId(new IdType(theResource.fhirType(), theResource.getId()));

		return retVal;
	}
	
	@Delete
	public void delete(@IdParam IdType theId) {
		final Observation item = new Observation();
		item.setId(theId);
		repository.remove(item);
	}
	
	/**
	 * Preenche o atributo "display" de partes do documento.
	 *  
	 * @param value
	 */
	private void fillAdditionalData(final Observation value) {
		if (value != null) {
			if (value.hasSubject() && value.getSubject().hasReferenceElement()) {
				final Patient pat = patProvider.read((IdType)value.getSubject().getReferenceElement());
				if (pat != null && pat.hasName()) {
					final HumanName name = pat.getName().stream()
							.filter(item -> item.getUse() == NameUse.OFFICIAL)
							.findFirst()
							.orElse(null);
					if (name != null && name.hasText()) {
						value.getSubject().setDisplay(name.getText());
					}
				}
			}
			
			if (value.hasPerformer()) {
				value.getPerformer().forEach(item -> {
					if (item.hasReferenceElement()) {
						final Organization org = orgProvider.read((IdType)item.getReferenceElement());
						if (org != null && org.hasName()) {
							item.setDisplay(org.getName());
						}
					}
				});
			}
			
			if (value.hasCode() && value.getCode().hasCoding()) {
				value.getCode().getCoding().forEach(item -> {
					final String display = csService.getDisplay(item.getSystem(), item.getCode());
					item.setDisplay(display);
				});
			}
		}
	}
}
