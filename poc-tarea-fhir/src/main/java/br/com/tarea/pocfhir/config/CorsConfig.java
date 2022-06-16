package br.com.tarea.pocfhir.config;

import java.util.ArrayList;

import org.springframework.web.cors.CorsConfiguration;

import ca.uhn.fhir.rest.api.Constants;
import ca.uhn.fhir.rest.server.interceptor.CorsInterceptor;

public class CorsConfig extends CorsInterceptor {

    public static CorsConfiguration getCorsConfig() {
        final CorsConfiguration retVal = new CorsConfiguration();

        final ArrayList<String> allowedHeaders = new ArrayList<>(Constants.CORS_ALLOWED_HEADERS);
        allowedHeaders.add(Constants.HEADER_AUTHORIZATION);
        retVal.setAllowedHeaders(allowedHeaders);
        retVal.setAllowedMethods(new ArrayList<>(Constants.CORS_ALLWED_METHODS));

        retVal.addExposedHeader(Constants.HEADER_CONTENT_LOCATION);
        retVal.addExposedHeader(Constants.HEADER_LOCATION);

        retVal.addAllowedOrigin("*");

        return retVal;
    }
}
