import { OrdenServicio } from '../../ordenes-servicios/models/orden-servicio.model';

export class Entrega {
    id: string;
    ordenServicio: OrdenServicio;
    fecha: Date;
    /** PENDIENTE, ENTREGADO, NO_ENTREGADO o RECHAZADO */
    estado: string;
    /** Por qué no se entregó */
    motivo?: string | null;
    intentos?: number;
    ruta: string;
    entregado: boolean;

    constructor() {
        this.id = '';
        this.ordenServicio = new OrdenServicio();
        this.fecha = new Date();
        this.estado = 'Pendiente';
        this.ruta = '';
        this.entregado = false;
    }
}
