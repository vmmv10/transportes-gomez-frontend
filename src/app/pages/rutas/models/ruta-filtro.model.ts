import { Usuario } from '../../usuarios/models/usuario.model';

export class RutaFiltro {
    fechaDesde: Date | null;
    fechaHasta: Date | null;
    chofer: Usuario | undefined;
    estado: string | null;
    id: number | null;
    size: number = 10;
    page: number = 0;
    sort: string = 'desc';
    key: string = 'fecha';
    conductor: boolean = false;

    constructor() {
        this.fechaDesde = null;
        this.fechaHasta = null;
        this.estado = null;
        this.id = null;
    }
}
