export class ProveedorFiltro {
    nombre: string | undefined;
    rut: string | undefined;
    size: number = 10;
    page: number = 0;
    sort: string = 'id,desc';
    activo: boolean | undefined;
}
