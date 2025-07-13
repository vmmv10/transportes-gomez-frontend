export class CategoriaFiltro {
    nombre: string | undefined;
    activo: boolean | undefined;
    size: number = 10;
    page: number = 0;

    constructor() {
        this.nombre = '';
        this.activo = true; // Default to true, can be changed as needed
    }
}