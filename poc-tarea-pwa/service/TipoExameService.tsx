export class TipoExameService{
    static async buscarTipoExame(): Promise<Response> {
        return fetch("http://lima.tarea.lan:8080/combos/tiposExame",{
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            }
        });
    }
}