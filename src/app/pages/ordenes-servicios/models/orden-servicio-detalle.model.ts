export class OrdenServicioDetalle {
    id!: number;
    nombre: string;
    cantidad: number;

    constructor() {
        this.cantidad = 0;
        this.nombre = '';
    }
}
