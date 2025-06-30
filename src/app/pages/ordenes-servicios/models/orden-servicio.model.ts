import { Documento } from '../../documentos/models/documento.model';
import { Escuela } from '../../escuelas/models/escuela.models';
import { Insumo } from '../../insumos/models/insumo.model';
import { Proveedor } from '../../proveedor/models/proveedor.model';
import { OrdenServicioDetalle } from './orden-servicio-detalle.model';

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
