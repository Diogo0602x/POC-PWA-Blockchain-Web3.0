import EditarExameModel from "../models/EditarExameModel";

export class EditarExameService{
    static async editarExame(exame: EditarExameModel, id:string): Promise<Response> {
        return fetch(`http://lima.tarea.lan:8080/fhir/Observation/${id}`,{
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(exame)
        });
    } 
}