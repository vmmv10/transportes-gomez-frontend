import { Proveedor } from '../../proveedor/models/proveedor.model';
export class Documento {
    id: string;
    tipoNombre: string;
    tipoCodigo: string;
    imagen: any;
    numero: number
    Proveedor: Proveedor;

    constructor() {
        this.id = '';
        this.tipoNombre = '';
        this.tipoCodigo = '';
        this.imagen = null;
        this.numero = 0;
        this.Proveedor = new Proveedor();
    }
}