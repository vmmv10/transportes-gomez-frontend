export class DestinoFiltro {
    /** Busca en nombre y dirección */
    nombre: string | undefined;
    tipo: string | undefined;
    /** id de la comuna */
    comuna: number | undefined;
    /** id del cliente */
    cliente: number | undefined;
    activo: boolean | undefined = true;
    size: number = 10;
    page: number = 0;
    sort: string = 'nombre,asc';
}
