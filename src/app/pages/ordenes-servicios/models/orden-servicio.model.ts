import { Escuela } from "../../escuelas/models/escuela.models";
import { Insumo } from "../../insumos/models/insumo.model";
import { Proveedor } from "../../proveedor/models/proveedor.model";

export class OrdenServicio {
    id: number;
    fecha: Date;
    escuela: Escuela;
    proveedor: Proveedor;
    observaciones: string;
    insumos: Insumo[];
    cantidad: number;
    valorTotal: number;
    estadoCodigo: string;

    constructor(
    ) {
        this.id = 0;
        this.fecha = new Date();
        this.escuela = new Escuela();
        this.proveedor = new Proveedor();
        this.observaciones = '';
        this.insumos = [];
        this.cantidad = 0;
        this.valorTotal = 0;
        this.estadoCodigo = '';
    }
}