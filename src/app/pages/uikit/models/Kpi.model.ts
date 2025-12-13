export class Kpi {
    valor: number;
    porcentaje: number;
    nombre: string;
    unidad: string;

    constructor(valor: number, porcentaje: number, nombre: string, unidad: string) {
        this.valor = valor;
        this.porcentaje = porcentaje;
        this.nombre = nombre;
        this.unidad = unidad;
    }
}
