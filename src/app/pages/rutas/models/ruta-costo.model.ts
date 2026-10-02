export type RutaCostoTipo = 'COMBUSTIBLE' | 'PEAJE' | 'TRANSBORDADOR' | 'BARCAZA' | 'ARRIENDO_LANCHA' | 'VIATICO' | 'OTRO';

export const TIPOS_COSTO: { label: string; value: RutaCostoTipo; icono: string }[] = [
    { label: 'Combustible', value: 'COMBUSTIBLE', icono: 'pi pi-bolt' },
    { label: 'Peaje', value: 'PEAJE', icono: 'pi pi-ticket' },
    { label: 'Transbordador (Chacao)', value: 'TRANSBORDADOR', icono: 'pi pi-arrows-h' },
    { label: 'Barcaza', value: 'BARCAZA', icono: 'pi pi-arrows-h' },
    { label: 'Arriendo de lancha', value: 'ARRIENDO_LANCHA', icono: 'pi pi-compass' },
    { label: 'Viático', value: 'VIATICO', icono: 'pi pi-wallet' },
    { label: 'Otro', value: 'OTRO', icono: 'pi pi-ellipsis-h' }
];

export function tipoCostoTexto(tipo: string | undefined): string {
    return TIPOS_COSTO.find((t) => t.value === tipo)?.label ?? tipo ?? '';
}

/** Gasto imputado a una ruta. Montos en pesos, sin decimales. */
export class RutaCosto {
    id: number | undefined;
    rutaId: number | undefined;
    tipo: RutaCostoTipo | undefined;
    /** yyyy-MM-dd; vacío = fecha de la ruta */
    fecha: string | undefined;
    monto: number | undefined;
    /** Solo combustible */
    litros: number | undefined;
    /** A quién se pagó */
    proveedorId: number | undefined;
    proveedorNombre: string | undefined;
    /** Vehículo al que corresponde (ej. la lancha arrendada) */
    vehiculoId: number | undefined;
    vehiculoDescripcion: string | undefined;
    /** Tramo o detalle: "Castro - Isla Lemuy" */
    descripcion: string | undefined;
    /** N° de boleta o comprobante */
    comprobante: string | undefined;
    usuarioNombre: string | undefined;
}

/** Costo real de una ruta. */
export interface RutaCostoResumen {
    rutaId: number;
    fecha: string;
    estado: string;
    chofer: string;
    vehiculoId: number | null;
    vehiculo: string;
    kilometros: number | null;
    entregas: number;
    total: number;
    porTipo: Record<string, number>;
    litros: number | null;
    costoPorKm: number | null;
    costoPorEntrega: number | null;
}

export class RutaCostoFiltro {
    desde: Date | undefined;
    hasta: Date | undefined;
    vehiculo: number | undefined;
    chofer: number | undefined;
    conCostos: boolean = false;
}
