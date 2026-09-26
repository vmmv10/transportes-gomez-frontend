/** Licitación, trato directo u orden de compra con un cliente (ej. licitación del SLEP). */
export class Contrato {
    id: number | undefined;
    clienteId: number | undefined;
    clienteNombre: string | undefined;
    /** ID de licitación u OC en Mercado Público */
    codigo: string = '';
    nombre: string = '';
    /** yyyy-MM-dd */
    fechaInicio: string | undefined;
    /** yyyy-MM-dd */
    fechaFin: string | undefined;
    observaciones: string = '';
    activo: boolean = true;
    /** Calculado por el backend: activo y dentro de sus fechas hoy */
    vigente: boolean | undefined;
}
