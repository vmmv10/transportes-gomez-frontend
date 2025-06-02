export class Escuela {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    fechaCreacion: Date;
    rbd: string;
    director: string;
    comuna: any
    latitud: string;
    longitud: string;

    constructor(
    ) {
        this.id = 0;
        this.nombre = '';
        this.direccion = '';
        this.telefono = '';
        this.email = '';
        this.fechaCreacion = new Date();
        this.rbd = '';
        this.director = '';
        this.latitud = '';
        this.longitud = '';
        this.comuna = null; // Puede ser un objeto o null
    }
}