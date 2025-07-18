import { OrdenServicio } from '../../ordenes-servicios/models/orden-servicio.model';

export class Entrega {
    id: string;
    ordenServicio: OrdenServicio;
    fecha: Date;
    estado: string;
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
