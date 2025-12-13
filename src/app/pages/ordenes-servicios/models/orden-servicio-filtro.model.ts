import { Bodega } from '../../bodegas/models/Bodega.model';
import { Categoria } from '../../categorias/models/categoria.model';
import { DocumentoTipo } from '../../documentos/models/documento-tipo.model';
import { Escuela } from '../../escuelas/models/escuela.models';
import { OrdenServicioCategoria } from '../../ordenes-servicios-categorias/model/orden-servicio-categoria.model';

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
    documentoReferencia: string | undefined;
    categoria: Categoria | undefined;

    constructor() {}
}
