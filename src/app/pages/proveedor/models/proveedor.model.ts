export class Proveedor {
    id: number;
    razonSocial: string;
    direccion: string;
    telefono: string;
    email: string;
    fechaCreacion: Date;
    rut: string;
    representante: string;

    constructor(
    ) {
        this.id = 0;
        this.razonSocial = '';
        this.direccion = '';
        this.telefono = '';
        this.email = '';
        this.fechaCreacion = new Date();
        this.rut = '';
        this.representante = '';
    }
}