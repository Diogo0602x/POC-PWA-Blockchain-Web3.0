package br.com.tarea.pocfhir;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.WebApplicationInitializer;

import br.com.tarea.pocfhir.hapi.HapiRestfulServer;
import ca.uhn.fhir.rest.server.RestfulServer;

@SpringBootApplication
@Configuration
public class PocFhirApplication extends SpringBootServletInitializer implements WebApplicationInitializer {
	public static void main(String[] args) {
		SpringApplication.run(PocFhirApplication.class, args);
	}
	
	@Autowired
	private HapiRestfulServer hapiRestfulServer;
	
    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("GMT-03:00"));
    }
    
    @Bean
    public ServletRegistrationBean<RestfulServer> servletRegistrationBean() {
        final ServletRegistrationBean<RestfulServer> servletRegistrationBean = new ServletRegistrationBean<>();
        servletRegistrationBean.setServlet(hapiRestfulServer);
        servletRegistrationBean.addUrlMappings("/fhir/*");
        servletRegistrationBean.setLoadOnStartup(1);
        return servletRegistrationBean;
    }

}
