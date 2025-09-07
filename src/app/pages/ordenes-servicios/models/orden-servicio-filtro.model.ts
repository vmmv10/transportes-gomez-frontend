import { Bodega } from '../../bodegas/models/Bodega.model';
import { DocumentoTipo } from '../../documentos/models/documento-tipo.model';
import { Escuela } from '../../escuelas/models/escuela.models';
import { Item } from '../../items/models/item.model';

export class OrdenServicioFiltro {
    id: number | undefined;
    escuela: Escuela | undefined;
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
    bodega: Bodega | undefined;
    sort: String = 'desc';
    key: String = 'id';
    item: Item | undefined;

    constructor() {}
}
