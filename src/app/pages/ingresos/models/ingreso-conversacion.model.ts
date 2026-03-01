import { IngresoMensaje } from "./ingreso-mensaje.model";

export class IngresoConversacion {
    id!: number;
    ingreso!: number;
    mensajes: IngresoMensaje[] = [];
}