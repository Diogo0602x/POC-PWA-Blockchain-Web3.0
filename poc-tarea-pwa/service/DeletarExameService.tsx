export class DeletarExame{
    static async deletarExame(id:string): Promise<Response> {
        return fetch(`http://lima.tarea.lan:8080/fhir/Observation/${id}`,{
            method: "DELETE",
        });
    } 
}