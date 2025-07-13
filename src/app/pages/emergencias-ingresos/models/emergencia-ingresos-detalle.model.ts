import { Documento } from "../../documentos/models/documento.model";

export class EmergenciaIngresosDetalle {
    id!: string;
    tipo: string = '';
    fechaCreacion: Date = new Date();
    observaciones: string = '';
    detalles: EmergenciaIngresosDetalle[] = [];
    documento: Documento | undefined;
    estado: number = 0;
}