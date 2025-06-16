import { Proveedor } from '../../proveedor/models/proveedor.model';
import { Escuela } from '../../escuelas/models/escuela.models';
import { DocumentoTipo } from './documento-tipo.model';
import { Bodega } from '../../bodegas/models/Bodega.model';
export class Documento {
    id: number;
    tipoNombre: string;
    tipoCodigo: string;
    imagen: string;
    numero: number;
    proveedor: Proveedor;
    escuela: Escuela;
    files: any[] = [];
    tipo: DocumentoTipo;
    bodega: Bodega;
    observaciones: string;

    constructor() {
        this.id = 0;
        this.tipoNombre = '';
        this.tipoCodigo = '';
        this.imagen = '';
        this.numero = 0;
        this.proveedor = new Proveedor();
        this.escuela = new Escuela();
        this.tipo = new DocumentoTipo();
        this.bodega = new Bodega();
        this.observaciones = '';
    }
}
