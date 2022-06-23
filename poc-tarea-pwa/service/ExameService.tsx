import ExameModel from "../models/ExameModel";

export class ExameService{
    static async inserirExame(exame: ExameModel): Promise<Response> {
        return fetch("http://lima.tarea.lan:8080/fhir/Observation",{
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(exame)
        });
    } 
}