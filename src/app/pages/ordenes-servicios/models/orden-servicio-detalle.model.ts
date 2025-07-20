import { SaldoBodega } from "../../inventario/models/saldo-bodega.model";

export class OrdenServicioDetalle {
    id!: number;
    nombre: string;
    cantidad: number;
    saldoBodega: SaldoBodega | undefined;

    constructor() {
        this.cantidad = 0;
        this.nombre = '';
    }
}
