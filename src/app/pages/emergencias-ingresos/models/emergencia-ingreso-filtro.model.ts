import { Documento } from "../../documentos/models/documento.model";

export class EmergenciaIngresoFiltro {
    documento: Documento | undefined;
    estado: number | undefined;
    size: number = 10;
    page: number = 0;
    id: string | undefined;
}