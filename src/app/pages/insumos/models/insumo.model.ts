export class Insumo {
    id: number;
    nombre: string;
    descripcion: string;
    unidadMedida: any;
    cantidad: number;

    constructor(
        id: number,
        nombre: string,
        descripcion: string,
        unidadMedida: any,
        cantidad: number,
    ) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.unidadMedida = unidadMedida;
        this.cantidad = cantidad;
    }
}