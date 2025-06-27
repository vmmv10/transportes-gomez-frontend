export class EntregaFiltro {
    id: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: boolean | undefined;
    entregado: boolean | undefined;
    ordenServicioId: string;
    escuela: string | undefined;

    constructor() {
        this.id = '';
        this.fechaInicio = new Date();
        this.fechaFin = new Date();
        this.estado = undefined;
        this.ordenServicioId = '';
        this.escuela = undefined;
    }
}
