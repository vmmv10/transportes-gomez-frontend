import { Escuela } from '../../escuelas/models/escuela.models';

export class Devolucion {
    id?: string;
    tipo: string = '';
    escuela: Escuela = new Escuela();
    fechaCreacion: Date = new Date();
    observaciones: string = '';
}
