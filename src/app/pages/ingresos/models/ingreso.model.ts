import { DocumentoTipo } from '../../documentos/models/documento-tipo.model';
import { IngresoDetalle } from './ingreso-detalle.model';
import { Bodega } from '../../bodegas/models/Bodega.model';

export class Ingreso {
    id!: string;
    fechaCreacion: Date = new Date();
    observaciones: string = '';
    detalles: IngresoDetalle[] = [];
    documento: number | undefined;
    documentoTipo: DocumentoTipo | undefined;
    estado: number = 0;
    bodega: Bodega | undefined;
}
