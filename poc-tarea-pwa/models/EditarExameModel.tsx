export default interface EditarExameModel{
    resourceType: "Observation",
    id: string,
    identifier: {
        system: `http://tarea.net.br/fhir/r4/NamingSystem/${string}`,
        value: string
    },
    meta: {
        profile: [
            "http://tarea.net.br/fhir/r4/StructureDefinition/TesteRapidoCovid19"
        ]
    },
    status: "final",
    code: {
        coding: [
            {
                system: "http://tarea.net.br/fhir/r4/CodeSystem/NomeExameCovid19",
                code: string
            }
        ]
    },
    subject: {
        reference: `Patient/${string}`
    },
    effectiveDateTime: string,
    issued: string,
    performer: [
        {
            reference: `Organization/${string}`
        }
    ],
    valueString: string
}