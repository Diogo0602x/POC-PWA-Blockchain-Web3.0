package br.com.tarea.pocfhir.model;

import java.time.ZonedDateTime;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

public class StoreTO {
	@Data
	@Builder
	@EqualsAndHashCode
	public static class Patient {
		private String id;
		private String nome;
		private String cpf;
		private ZonedDateTime dob;
		private String type;
		private String fhirAsJson;
	}
	
	@Data
	@Builder
	@EqualsAndHashCode
	public static class Organization {
		private String id;
		private String nome;
		private String type;
		private String fhirAsJson;
	}
	
	@Data
	@Builder
	@EqualsAndHashCode
	public static class Observation {
		private String id;
		private String patientId;
		private String organizationId;
		private String status;
		private String codeSystem;
		private String codeValue;
		private ZonedDateTime issued;
		private ZonedDateTime effective;
		private String type;
		private String fhirAsJson;
	}
}
