import { DocumentoTipo } from '../../documentos/models/documento-tipo.model';
import { Escuela } from '../../escuelas/models/escuela.models';

export class OrdenServicioFiltro {
    id: number | undefined;
    escuela: Escuela = new Escuela();
    fecha: Date | undefined;
    estado: string | undefined;
    page: number = 0;
    size: number = 10;
    fechaDesde: Date | undefined;
    fechaHasta: Date | undefined;
    documentoTipo: DocumentoTipo = new DocumentoTipo();
    documentoNumero: string | undefined;
    enRuta: boolean | undefined;
    entregado: boolean | undefined;

    constructor() {}
}
