import { Escuela } from "../../escuelas/models/escuela.models";
import { OrdenServicio } from "../../ordenes-servicios/models/orden-servicio.model";

export class DevolucionFiltro {
    escuela: Escuela | undefined;
    orden: OrdenServicio | undefined;
    id: string | undefined;
    size: number = 10;
    page: number = 0;
    sort: string = 'id,desc';
    activo: boolean | undefined;

    constructor() {
        this.activo = true;
    }
}