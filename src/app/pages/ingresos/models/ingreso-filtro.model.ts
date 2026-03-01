import { Documento } from '../../documentos/models/documento.model';

export class IngresoFiltro {
    documento: number | undefined;
    estado: number | undefined;
    size: number = 10;
    page: number = 0;
    id: string | undefined;
    key: string = 'id';
    sort: string = 'desc';
    ordenCompra: string | undefined;
}
