export class ContratoFiltro {
    cliente: number | undefined;
    /** Busca en código y nombre */
    texto: string | undefined;
    activo: boolean | undefined = true;
    /** true = solo contratos vigentes hoy */
    vigente: boolean | undefined;
    size: number = 10;
    page: number = 0;
    sort: string = 'fechaInicio,desc';
}
