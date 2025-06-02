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
        id: number,
        razonSocial: string,
        direccion: string,
        telefono: string,
        email: string,
        fechaCreacion: Date,
        rut: string,
        representante: string = ''
    ) {
        this.id = id;
        this.razonSocial = razonSocial;
        this.direccion = direccion;
        this.telefono = telefono;
        this.email = email;
        this.fechaCreacion = fechaCreacion;
        this.rut = rut;
        this.representante = representante;
    }
}