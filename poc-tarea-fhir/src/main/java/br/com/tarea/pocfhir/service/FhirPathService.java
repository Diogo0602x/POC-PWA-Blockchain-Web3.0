package br.com.tarea.pocfhir.service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hl7.fhir.instance.model.api.IBase;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.DateTimeType;
import org.hl7.fhir.r4.model.DateType;
import org.hl7.fhir.r4.model.InstantType;
import org.junit.platform.commons.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.fhirpath.IFhirPath;

@Component
public class FhirPathService {
	private static final Logger LOG = LoggerFactory.getLogger(FhirPathService.class);
	
	private final IFhirPath fhirPath;
	private final FhirContext fhirContext;
	
	public FhirPathService(final FhirContext fhirContext) {
		super();
		this.fhirPath = fhirContext.newFhirPath();
		this.fhirContext = fhirContext;
	}
	
	public String toJson(final IBaseResource resource) {
		return fhirContext.newJsonParser().encodeResourceToString(resource);
	}

	public IBaseResource fromJson(final String resource) {
		return fhirContext.newJsonParser().parseResource(resource);
	}
	
	public String getValueByExpression(String expression, IBaseResource resource) {
		final List<Object> result = getByExpression(expression, resource);
		if (result != null && !result.isEmpty()) {
			return result.get(0).toString();
		} else {
			return null;
		}
	}

	public String[] getArrayByExpression(String expression, IBaseResource resource) {
		final List<Object> result = getByExpression(expression, resource);
		if (result != null && !result.isEmpty()) {
			
			final List<String> listResult = new ArrayList<String>();
			result.forEach(item ->{
				listResult.add(item.toString());
			});
			return listResult.toArray(new String[0]);
		} else {
			return null;
		}
	}
	
	public List<Object> getByExpression(String expression, IBaseResource resource) {
		final List<Object> response = new ArrayList<Object>();
		
		if (resource != null && StringUtils.isNotBlank(expression)) {
			final List<IBase> result = fhirPath.evaluate(resource, expression, IBase.class);
			
			if (result == null) {
				LOG.debug("expression '{}' -> result is null", expression);
			} else {
				result.forEach(item -> {
					response.add(item);
				});
			}
		}

		return response;
	}
	
	public ZonedDateTime getDateTimeByExpression(String expression, IBaseResource resource) {
		final List<Object> result = getByExpression(expression, resource);
		if (result != null && !result.isEmpty()) {
			final Object value = result.get(0);
			
			if (value instanceof DateTimeType) {
				return ZonedDateTime.ofInstant(((DateTimeType) result.get(0)).getValue().toInstant(), ZoneId.systemDefault());
			} else if (value instanceof DateType) {
				return ZonedDateTime.ofInstant(((DateType) result.get(0)).getValue().toInstant(), ZoneId.systemDefault());
			} else if (value instanceof InstantType) {
				return ZonedDateTime.ofInstant(((InstantType) result.get(0)).getValue().toInstant(), ZoneId.systemDefault());
			} else {
				return null;
			}
		} else {
			return null;
		}
	}	
}
