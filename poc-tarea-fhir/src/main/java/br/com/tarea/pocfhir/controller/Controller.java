package br.com.tarea.pocfhir.controller;

import java.util.Arrays;

import org.hl7.fhir.common.hapi.validation.validator.FhirInstanceValidator;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.StringType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tarea.pocfhir.service.GitService;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.context.support.IValidationSupport;
import ca.uhn.fhir.context.support.IValidationSupport.LookupCodeResult;
import ca.uhn.fhir.context.support.ValidationSupportContext;
import ca.uhn.fhir.parser.IParser;

@RestController
public class Controller {
	private static final Logger LOG = LoggerFactory.getLogger(GitService.class);
	
	@Autowired
	private FhirContext fhirContext;
	
	@Autowired
	private FhirInstanceValidator fhirInstanceValidator;
	
    @GetMapping(value = "/cnt/teste")
    public void test() throws Exception {    	
        LOG.info("---\n\n\n\n");
        
        IBaseResource ibr;
        String json;
        IParser parser = fhirContext.newJsonParser().setPrettyPrint(true);
        
        final IValidationSupport ivs = fhirInstanceValidator.getValidationSupport();
        
		ibr = ivs.fetchCodeSystem("http://tarea.net.br/fhir/r4/CodeSystem/NomeExameCovid19");
		json = parser.encodeResourceToString(ibr);
        LOG.info("\n\n{}\n\n", json);
        
        ibr = ivs.fetchValueSet("http://tarea.net.br/fhir/r4/ValueSet/NomeExameCovid19");
        json = parser.encodeResourceToString(ibr);
        LOG.info("\n\n{}\n\n", json);
        
        ValidationSupportContext vsp = new ValidationSupportContext(ivs);
        
        LookupCodeResult lcr = ivs.lookupCode(vsp, "http://tarea.net.br/fhir/r4/CodeSystem/NomeExameCovid19", "94768-9", "en");
        
        LOG.info("************** {}", lcr.isFound());
        LOG.info("************** {}", lcr.getDesignations());
        LOG.info("************** {}", lcr.getProperties());
        
        json = parser.encodeResourceToString(lcr.toParameters(fhirContext, Arrays.asList(new StringType("inativo"))));
        
        LOG.info("\n\n{}\n\n", json);
        
        
        LOG.info("\n\n\n\n---");
    }
}
