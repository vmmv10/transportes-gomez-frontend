import { DocumentoTipo } from '../../documentos/models/documento-tipo.model';
import { IngresoDetalle } from './ingreso-detalle.model';
import { Bodega } from '../../bodegas/models/Bodega.model';
import { Cliente } from '../../clientes/models/cliente.model';
import { Proveedor } from '../../proveedor/models/proveedor.model';
import { Bulto } from './bulto.model';

export class Ingreso {
    id!: string;
    fechaCreacion: Date = new Date();
    fechaCierre: Date = new Date();
    observaciones: string = '';
    detalles: IngresoDetalle[] = [];
    documento: number | undefined;
    documentoTipo: DocumentoTipo | undefined;
    estado: number = 0;
    bodega: Bodega | undefined;
    ordenCompra: string = '';
    /** Quién contrata / a quién se le cobra (ej. SLEP Chiloé) */
    cliente: Cliente | undefined;
    /** Quién trajo la carga a la bodega (ej. Kaiken) */
    transportista: Proveedor | undefined;
    /** N° de guía de despacho del transportista */
    guiaTransportista: string = '';
    /** Bultos cerrados recibidos, con su N° de seguimiento externo */
    bultos: Bulto[] = [];
}
