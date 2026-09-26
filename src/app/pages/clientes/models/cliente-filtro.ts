export class ClienteFiltro {
    /** Busca en razón social y nombre corto */
    nombre: string | undefined;
    rut: string | undefined;
    sector: string | undefined;
    activo: boolean | undefined = true;
    size: number = 10;
    page: number = 0;
    sort: string = 'razonSocial,asc';
}
