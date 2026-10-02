export type SeguimientoTipo = 'EN_RUTA' | 'CERCA_DESTINO' | 'ENTREGADO' | 'NO_ENTREGADO' | 'RECHAZADO' | 'REPROGRAMADO';

export const TIPOS_SEGUIMIENTO: Record<SeguimientoTipo, { texto: string; icono: string; color: string }> = {
    EN_RUTA: { texto: 'En ruta', icono: 'pi pi-truck', color: '#2178bd' },
    CERCA_DESTINO: { texto: 'Cerca del destino', icono: 'pi pi-map-marker', color: '#0ea5e9' },
    ENTREGADO: { texto: 'Entregado', icono: 'pi pi-check-circle', color: '#16a34a' },
    NO_ENTREGADO: { texto: 'No entregado', icono: 'pi pi-times-circle', color: '#dc2626' },
    RECHAZADO: { texto: 'Rechazado', icono: 'pi pi-ban', color: '#b91c1c' },
    REPROGRAMADO: { texto: 'Reprogramado', icono: 'pi pi-replay', color: '#f59e0b' }
};

/** Evento del historial de una orden de servicio. */
export interface SeguimientoEvento {
    id: number;
    ordenServicioId: number;
    entregaId: number | null;
    rutaId: number | null;
    tipo: SeguimientoTipo;
    descripcion: string | null;
    latitud: number | null;
    longitud: number | null;
    distanciaKm: number | null;
    visiblePublico: boolean;
    usuarioNombre: string | null;
    /** ISO con zona horaria */
    fecha: string;
}
