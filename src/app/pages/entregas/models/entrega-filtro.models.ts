import { Proveedor } from "../../proveedor/models/proveedor.model";

export class EntregaFiltro {
    id: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: boolean | undefined;
    entregado: boolean | undefined;
    ordenServicioId: string;
    escuela: string | undefined;
    documento: number | undefined;
    proveedor: Proveedor | undefined;
    size: number = 10;
    page: number = 0;

    constructor() {
        this.id = '';
        this.fechaInicio = new Date();
        this.fechaFin = new Date();
        this.estado = undefined;
        this.ordenServicioId = '';
        this.escuela = undefined;
    }
}
