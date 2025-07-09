import { Escuela } from '../../escuelas/models/escuela.models';
import { OrdenServicio } from '../../ordenes-servicios/models/orden-servicio.model';
import { DevolucionDetalle } from './devolucion-detalle.model';

export class Devolucion {
    id!: string;
    tipo: string = '';
    escuela: Escuela = new Escuela();
    fechaCreacion: Date = new Date();
    observaciones: string = '';
    detalles: DevolucionDetalle[] = [];
    ordenServicio: OrdenServicio | undefined;
}
