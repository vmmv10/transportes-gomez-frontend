/** Tipo de servicio: CARGA_TER, CARGA_MAR, PAX_TER, PAX_MAR, ALMAC. */
export interface ServicioTipo {
    id: number;
    codigo: string;
    nombre: string;
    /** CARGA, PASAJEROS o ALMACENAJE */
    categoria: string;
    /** TERRESTRE, MARITIMO o null */
    modalidad: string | null;
    activo: boolean;
}

export const SERVICIO_CARGA_TERRESTRE = 'CARGA_TER';
