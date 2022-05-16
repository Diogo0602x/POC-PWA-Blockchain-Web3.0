package br.com.tarea.pocfhir.repo;

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import br.com.tarea.pocfhir.model.StoreTO;
import br.com.tarea.pocfhir.service.SequenceGenerator;
import one.microstream.reflect.ClassLoaderProvider;
import one.microstream.storage.embedded.types.EmbeddedStorage;
import one.microstream.storage.embedded.types.EmbeddedStorageManager;

@Component
public class MicrostreamFhirRepository {
	private final SequenceGenerator snGen;
	
	private final List<StoreTO.Patient> patients;
	private final EmbeddedStorageManager storagePatient;
	
	private final List<StoreTO.Organization> organizations;
	private final EmbeddedStorageManager storageOrganization;
	
	private final List<StoreTO.Observation> observations;
	private final EmbeddedStorageManager storageObservation;
	
	public MicrostreamFhirRepository(
			@Value("${store.patient}") final String patientStorageLocation,
			@Value("${store.organization}") final String organizationStorageLocation,
			@Value("${store.observation}") final String observationStorageLocation) {
		this.snGen = new SequenceGenerator(MicrostreamFhirRepository.class.getName());
		
		this.patients = new ArrayList<>();
		this.storagePatient = EmbeddedStorage
				.Foundation(Paths.get(patientStorageLocation))
				.onConnectionFoundation(cf -> 
							cf.setClassLoaderProvider(
									ClassLoaderProvider.New(Thread.currentThread().getContextClassLoader())))
				.start(this.patients);
		
		this.organizations = new ArrayList<>();
		this.storageOrganization = EmbeddedStorage
				.Foundation(Paths.get(organizationStorageLocation))
				.onConnectionFoundation(cf -> 
				cf.setClassLoaderProvider(
						ClassLoaderProvider.New(Thread.currentThread().getContextClassLoader())))
				.start(this.organizations);
		
		this.observations = new ArrayList<>();
		this.storageObservation = EmbeddedStorage
				.Foundation(Paths.get(observationStorageLocation))
				.onConnectionFoundation(cf -> 
				cf.setClassLoaderProvider(
						ClassLoaderProvider.New(Thread.currentThread().getContextClassLoader())))
				.start(this.observations);
	}
	
	// ---

	public String genId() {
		return String.format("%d", snGen.nextId());
	}
	
	// ---
	
	public List<StoreTO.Patient> patients() {
		return patients;
	}

	public void patientsPersist() {
		storagePatient.store(this.patients);
	}
	
	// ---
	
	public void organizationsPersist() {
		storageOrganization.store(this.organizations);
	}
	
	public List<StoreTO.Organization> organizations() {
		return organizations;
	}
	
	// ---
	
	public void observationsPersist() {
		storageObservation.store(this.observations);
	}
	
	public List<StoreTO.Observation> observations() {
		return observations;
	}
}
