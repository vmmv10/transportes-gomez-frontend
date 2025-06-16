export class Ruta {
    id!: number;
    fecha: Date;
    chofer: any;
    estado: string;

    constructor() {
        this.fecha = new Date();
        this.chofer = null; // Assuming chofer is an object, you can adjust as needed
        this.estado = 'Pendiente'; // Default state
    }
}
