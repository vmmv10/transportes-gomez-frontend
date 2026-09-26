import { Bodega } from '../../bodegas/models/Bodega.model';
import { Documento } from '../../documentos/models/documento.model';
import { Escuela } from '../../escuelas/models/escuela.models';
import { OrdenServicioCategoria } from '../../ordenes-servicios-categorias/model/orden-servicio-categoria.model';
import { OrdenServicioDetalle } from './orden-servicio-detalle.model';
import { Cliente } from '../../clientes/models/cliente.model';
import { ServicioTipo } from '../../catalogos/models/servicio-tipo.model';
import { Destino } from '../../destinos/models/destino.model';
import { Proveedor } from '../../proveedor/models/proveedor.model';
import { Contrato } from '../../contratos/models/contrato.model';

export class OrdenServicio {
    id: number;
    fecha: Date;
    escuela: Escuela | undefined;
    observaciones: string;
    detalles: OrdenServicioDetalle[];
    cantidad: number;
    valorTotal: number;
    entregado: boolean;
    documento: Documento;
    bodega: Bodega | undefined;
    documentoReferencia: string | undefined;
    categoria: OrdenServicioCategoria | undefined;
    ingreso: number | undefined;
    /** Quién contrata / a quién se le cobra */
    cliente: Cliente | undefined;
    servicioTipo: ServicioTipo | undefined;
    /** Lugar de entrega. Si hay escuela, el backend usa el destino de esa escuela. */
    destino: Destino | undefined;
    /** Proveedor de la mercadería (quién la vendió al cliente) */
    proveedor: Proveedor | undefined;
    contrato: Contrato | undefined;

    constructor() {
        this.id = 0;
        this.fecha = new Date();
        this.observaciones = '';
        this.detalles = [];
        this.cantidad = 0;
        this.valorTotal = 0;
        this.entregado = false;
        this.documento = new Documento();
    }
}
