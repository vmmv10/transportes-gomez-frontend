export class Marca {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;

  constructor() {
    this.id = 0;
    this.nombre = '';
    this.descripcion = '';
    this.activo = true;
  }
}