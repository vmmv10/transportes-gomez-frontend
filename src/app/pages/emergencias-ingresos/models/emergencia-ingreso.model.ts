import { DocumentoTipo } from "../../documentos/models/documento-tipo.model";
import { Documento } from "../../documentos/models/documento.model";
import { EmergenciaIngresosDetalle } from "./emergencia-ingresos-detalle.model";

export class EmergenciaIngreso {
    id!: string;
    fechaCreacion: Date = new Date();
    observaciones: string = '';
    detalles: EmergenciaIngresosDetalle[] = [];
    documento: number | undefined;
    documentoTipo: DocumentoTipo | undefined;
    estado: number = 0;
}