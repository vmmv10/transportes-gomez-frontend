import { Proveedor } from '../../proveedor/models/proveedor.model';
import { Escuela } from '../../escuelas/models/escuela.models';
import { DocumentoTipo } from './documento-tipo.model';
import { Bodega } from '../../bodegas/models/Bodega.model';
export class Documento {
    id: number;
    imagen: string;
    numero: number | undefined;
    proveedor: Proveedor | undefined;
    escuela: Escuela | undefined;
    files: any[] = [];
    tipo: DocumentoTipo | undefined;
    bodega: Bodega | undefined;
    observaciones: string;
    asignado: boolean = false;

    constructor() {
        this.id = 0;
        this.imagen = '';
        this.observaciones = '';
    }
}
