export class EntregaFiltro {
    id: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: string;
    ordenServicioId: string;

    constructor() {
        this.id = '';
        this.fechaInicio = new Date();
        this.fechaFin = new Date();
        this.estado = '';
        this.ordenServicioId = '';
    }
}
