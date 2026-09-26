import { Destino } from '../../destinos/models/destino.model';

export type BultoEstado = 'EN_BODEGA' | 'EN_RUTA' | 'ENTREGADO' | 'DEVUELTO' | 'RECHAZADO';

export const BULTO_ESTADOS: Record<BultoEstado, { texto: string; severidad: 'info' | 'warn' | 'success' | 'danger' | 'secondary' }> = {
    EN_BODEGA: { texto: 'En bodega', severidad: 'info' },
    EN_RUTA: { texto: 'En ruta', severidad: 'warn' },
    ENTREGADO: { texto: 'Entregado', severidad: 'success' },
    DEVUELTO: { texto: 'Devuelto', severidad: 'secondary' },
    RECHAZADO: { texto: 'Rechazado', severidad: 'danger' }
};

/** Bulto cerrado que llega en un ingreso (una caja, un pallet) dirigido a un destino. */
export class Bulto {
    id: number | undefined;
    ingresoId: number | undefined;
    /** N° de seguimiento del cliente o del transportista (Starken, Kaiken...) */
    codigoExterno: string | null = '';
    descripcion: string | null = '';
    pesoKg: number | null = null;
    volumenM3: number | null = null;
    destino: Destino | undefined;
    ordenServicioId: number | undefined;
    estado: BultoEstado = 'EN_BODEGA';
    fechaEntrega: string | undefined;
}
