import { Usuario } from "../../usuarios/models/usuario.model";

export class IngresoMensaje {
    id!: number;
    mensaje!: string;
    usuario!: Usuario;
    fecha: Date = new Date();
    esSistema: boolean = false;
}