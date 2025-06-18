export class Usuario {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    rol: string;

    constructor() {
        this.id = '';
        this.nombre = '';
        this.email = '';
        this.telefono = '';
        this.fechaCreacion = new Date();
        this.fechaActualizacion = new Date();
        this.rol = '';
    }
}
