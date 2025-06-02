export class Bodega {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    fechaCreacion: Date;
    comuna: any;

    constructor() {
        this.id = 0;
        this.nombre = '';
        this.direccion = '';
        this.telefono = '';
        this.fechaCreacion = new Date();
        this.comuna = null; // Puede ser un objeto o null
    }
}