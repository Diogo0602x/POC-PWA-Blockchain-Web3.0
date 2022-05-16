package br.com.tarea.pocfhir.hapi;

import javax.servlet.annotation.WebServlet;

import org.springframework.stereotype.Component;

import br.com.tarea.pocfhir.config.CorsConfig;
import br.com.tarea.pocfhir.provider.ObservationProvider;
import br.com.tarea.pocfhir.provider.OrganizationProvider;
import br.com.tarea.pocfhir.provider.PatientProvider;
import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.openapi.OpenApiInterceptor;
import ca.uhn.fhir.rest.server.RestfulServer;
import ca.uhn.fhir.rest.server.interceptor.CorsInterceptor;
import ca.uhn.fhir.rest.server.interceptor.ResponseHighlighterInterceptor;

@Component
@WebServlet("/*")
@SuppressWarnings("serial")
public class HapiRestfulServer extends RestfulServer {

	private final FhirContext fhirContext;
	
	private final PatientProvider patientProvider;
	private final OrganizationProvider organizationProvider;
	private final ObservationProvider observationProvider;
	
	public HapiRestfulServer(final FhirContext fhirContext, 
			final PatientProvider patientProvider,
			final OrganizationProvider organizationProvider,
			final ObservationProvider observationProvider) {
		this.fhirContext = fhirContext;
		this.patientProvider = patientProvider;
		this.organizationProvider = organizationProvider;
		this.observationProvider = observationProvider;
	}

	@Override
	protected void initialize() {
		// context
		setFhirContext(fhirContext);

		// semantic providers
		registerProvider(patientProvider);
		registerProvider(organizationProvider);
		registerProvider(observationProvider);

		// cors
		registerInterceptor(new CorsInterceptor(CorsConfig.getCorsConfig()));

		// ui
		registerInterceptor(new ResponseHighlighterInterceptor());
		
		// swagger
		registerInterceptor(new OpenApiInterceptor());
	}
}