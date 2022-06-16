package br.com.tarea.pocfhir.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResourceTO {
	private String id;
	private String type;
	private String fhirAsJson;
}
