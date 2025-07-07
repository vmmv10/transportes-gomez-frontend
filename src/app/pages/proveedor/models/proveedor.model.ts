export class Proveedor {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    fechaCreacion: Date;
    rut: string;
    representante: string;

    constructor(
    ) {
        this.id = 0;
        this.nombre = '';
        this.direccion = '';
        this.telefono = '';
        this.email = '';
        this.fechaCreacion = new Date();
        this.rut = '';
        this.representante = '';
    }
}