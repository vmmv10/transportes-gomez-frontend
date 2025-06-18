import { Entrega } from '../../dashboard/models/entrega.model';
import { OrdenServicio } from '../../ordenes-servicios/models/orden-servicio.model';
import { Usuario } from '../../usuarios/models/usuario.model';

export class Ruta {
    id!: number;
    fecha: Date;
    chofer: Usuario;
    estado: string;
    ordenes: OrdenServicio[];
    entregas: Entrega[];

    constructor() {
        this.fecha = new Date();
        this.chofer = new Usuario();
        this.estado = 'Pendiente'; // Default state
        this.ordenes = [];
        this.entregas = [];
    }
}
