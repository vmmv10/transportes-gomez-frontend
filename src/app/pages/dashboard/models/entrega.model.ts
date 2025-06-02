import { Escuela } from "../../escuelas/models/escuela.models";
import { OrdenServicio } from '../../ordenes-servicios/models/orden-servicio.model';

export class Entrega {
    id: number;
    fecha: Date;
    escuela: Escuela;
    ordenServicio: OrdenServicio;
    estado: string;

    constructor(
        id: number,
        fecha: Date,
        escuela: Escuela,
        ordenServicio: OrdenServicio,
        estado: string
    ) {
        this.id = id;
        this.fecha = fecha;
        this.escuela = escuela;
        this.ordenServicio = ordenServicio;
        this.estado = estado;
    }
}