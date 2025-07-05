import { Entrega } from '../../entregas/models/entrega.models';
import { OrdenServicio } from '../../ordenes-servicios/models/orden-servicio.model';
import { Usuario } from '../../usuarios/models/usuario.model';

export class Ruta {
    id!: number;
    fecha!: string;
    fechaJS: Date;
    chofer: Usuario | undefined;
    estado: string;
    ordenes: OrdenServicio[];
    entregas: Entrega[];
    enTransito: boolean = false;

    constructor() {
        this.fechaJS = new Date();
        this.estado = 'Pendiente'; // Default state
        this.ordenes = [];
        this.entregas = [];
    }
}
