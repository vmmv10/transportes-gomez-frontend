export class RutaFiltro {
    fechaDesde: Date | null;
    fechaHasta: Date | null;
    choferId: number | null;
    estado: string | null;
    id: number | null;
    size: number = 10;
    page: number = 0;

    constructor() {
        this.fechaDesde = null;
        this.fechaHasta = null;
        this.choferId = null;
        this.estado = null;
        this.id = null;
    }
}
