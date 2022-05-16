package br.com.tarea.pocfhir.service;

import org.apache.commons.lang3.StringUtils;
import org.hl7.fhir.common.hapi.validation.validator.FhirInstanceValidator;
import org.springframework.stereotype.Service;

import ca.uhn.fhir.context.support.IValidationSupport;
import ca.uhn.fhir.context.support.IValidationSupport.LookupCodeResult;
import ca.uhn.fhir.context.support.ValidationSupportContext;

/**
 * Interação com a lista de code systems em memória.
 * 
 * @author herberson
 *
 */
@Service
public class CodeSystemService {

    private ValidationSupportContext vsp;
    private IValidationSupport ivs;
    
    public CodeSystemService(final FhirInstanceValidator fhirInstanceValidator) {
        this.ivs = fhirInstanceValidator.getValidationSupport();
        this.vsp = new ValidationSupportContext(this.ivs);
    }
    
    /**
     * Recupera a descrição do code system carregado na engine de validação.
     * 
     * @param system
     * @param code
     * @return
     */
    public String getDisplay(final String system, final String code) {
    	if (StringUtils.isNoneBlank(system, code)) {
    		final LookupCodeResult lcr = ivs.lookupCode(vsp, system, code);
    		
    		if (lcr == null) {
    			return null;
    		} else if (lcr.isFound()) {
    			return lcr.getCodeDisplay();
    		} else {
    			return null;
    		}
    	} else {
    		return null;
    	}
    }
}
