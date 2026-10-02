import { Entrega } from '../../entregas/models/entrega.models';
import { OrdenServicio } from '../../ordenes-servicios/models/orden-servicio.model';
import { Usuario } from '../../usuarios/models/usuario.model';
import { Vehiculo } from '../../vehiculos/models/vehiculo.model';

export class Ruta {
    id!: number;
    fecha!: string;
    fechaJS: Date;
    chofer: Usuario | undefined;
    estado: string;
    ordenes: OrdenServicio[];
    entregas: Entrega[];
    enTransito: boolean = false;
    kilometros: number;
    /** Vacío = "Sin vehículo" */
    vehiculo?: Vehiculo | null;
    /** Odómetro al salir y al llegar; si están los dos, el backend calcula los kilómetros */
    kmSalida?: number | null;
    kmLlegada?: number | null;
    /** Suma de los costos de la ruta (solo lectura) */
    costoTotal?: number;
    inicio?: string;
    fin?: string;

    constructor() {
        this.fechaJS = new Date();
        this.estado = 'Pendiente'; // Default state
        this.ordenes = [];
        this.entregas = [];
        this.kilometros = 0; // Default kilometers
    }
}
