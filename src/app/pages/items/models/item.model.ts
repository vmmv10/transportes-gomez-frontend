import { UnidadMedida } from "../../uikit/models/unidad-medida.model";

export class Item {
    id: number;
    nombre: string;
    descripcion: string;
    unidadMedida: UnidadMedida;
    cantidad: number;
    codigo: string | undefined;

    constructor(
    ) {
        this.id = 0;
        this.nombre = '';
        this.descripcion = '';
        this.unidadMedida = new UnidadMedida();
        this.cantidad = 0;
    }
}