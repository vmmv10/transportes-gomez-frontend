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

    constructor(
        id: number,
        fecha: Date,
        escuela: Escuela,
        proveedor: Proveedor,
        observaciones: string,
        insumos: Insumo[],
        cantidad: number,
        valorTotal: number
    ) {
        this.id = id;
        this.fecha = fecha;
        this.escuela = escuela;
        this.proveedor = proveedor;
        this.observaciones = observaciones;
        this.insumos = insumos;
        this.cantidad = cantidad;
        this.valorTotal = valorTotal;
    }
}