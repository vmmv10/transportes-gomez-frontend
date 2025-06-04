import { Escuela } from "../../escuelas/models/escuela.models";

export class OrdenServicioFiltro {
  id: number | undefined;
  escuela: Escuela | undefined;
  fecha: Date | undefined;

  constructor() {
  }
}