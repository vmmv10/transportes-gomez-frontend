export type TarifaPeriodo = 'VIAJE' | 'DIA' | 'MES';
export type CotizacionEstado = 'NUEVA' | 'EN_REVISION' | 'ENVIADA' | 'ACEPTADA' | 'RECHAZADA' | 'DESCARTADA';

export const PERIODOS: { label: string; value: TarifaPeriodo }[] = [
    { label: 'Por viaje', value: 'VIAJE' },
    { label: 'Por día', value: 'DIA' },
    { label: 'Por mes', value: 'MES' }
];

export const ESTADOS_COTIZACION: { label: string; value: CotizacionEstado; severidad: 'info' | 'warn' | 'success' | 'danger' | 'secondary' | 'contrast' }[] = [
    { label: 'Nueva', value: 'NUEVA', severidad: 'info' },
    { label: 'En revisión', value: 'EN_REVISION', severidad: 'warn' },
    { label: 'Enviada', value: 'ENVIADA', severidad: 'contrast' },
    { label: 'Aceptada', value: 'ACEPTADA', severidad: 'success' },
    { label: 'Rechazada', value: 'RECHAZADA', severidad: 'danger' },
    { label: 'Descartada', value: 'DESCARTADA', severidad: 'secondary' }
];

export function estadoCotizacion(estado: CotizacionEstado | undefined) {
    return ESTADOS_COTIZACION.find((e) => e.value === estado) ?? ESTADOS_COTIZACION[0];
}

/** Precio por servicio, comunas, unidad y período. Sin cliente = tarifa general. */
export class Tarifa {
    id: number | undefined;
    clienteId: number | undefined;
    clienteNombre: string | undefined;
    servicioTipoId: number | undefined;
    servicioTipoNombre: string | undefined;
    comunaOrigenId: number | undefined;
    comunaOrigenNombre: string | undefined;
    comunaDestinoId: number | undefined;
    comunaDestinoNombre: string | undefined;
    unidadMedidaId: number | undefined;
    unidadMedidaNombre: string | undefined;
    unidadMedidaCodigo: string | undefined;
    periodo: TarifaPeriodo = 'VIAJE';
    precio: number | undefined;
    minimo: number | undefined;
    /** yyyy-MM-dd */
    vigenteDesde: string | undefined;
    vigenteHasta: string | undefined;
    observaciones: string | undefined;
    activo: boolean = true;
    vigente: boolean | undefined;
}

export class TarifaFiltro {
    /** -1 = solo generales */
    cliente: number | undefined;
    servicio: number | undefined;
    comuna: number | undefined;
    activo: boolean | undefined = true;
    vigente: boolean | undefined;
    size: number = 20;
    page: number = 0;
    sort: string = 'vigenteDesde,desc';
}

export interface TarifaSugerida {
    tarifa: Tarifa | null;
    monto: number | null;
    detalle: string;
}

export class Cotizacion {
    id: number | undefined;
    codigo: string | undefined;
    canal: 'WEB' | 'INTERNA' = 'INTERNA';
    estado: CotizacionEstado = 'EN_REVISION';
    nombre: string = '';
    empresa: string | undefined;
    email: string = '';
    telefono: string | undefined;
    clienteId: number | undefined;
    clienteNombre: string | undefined;
    servicioTipoId: number | undefined;
    servicioTipoNombre: string | undefined;
    servicioTexto: string | undefined;
    origen: string | undefined;
    destino: string | undefined;
    /** Punto marcado en el mapa de la landing (solo lectura) */
    origenLatitud?: number | null;
    origenLongitud?: number | null;
    destinoLatitud?: number | null;
    destinoLongitud?: number | null;
    comunaOrigenId: number | undefined;
    comunaOrigenNombre: string | undefined;
    comunaDestinoId: number | undefined;
    comunaDestinoNombre: string | undefined;
    tipoCarga: string | undefined;
    pesoKg: number | undefined;
    cantidad: number | undefined;
    unidadMedidaId: number | undefined;
    unidadMedidaNombre: string | undefined;
    mensaje: string | undefined;
    monto: number | undefined;
    tarifaId: number | undefined;
    validaHasta: string | undefined;
    observaciones: string | undefined;
    usuarioNombre: string | undefined;
    fechaCreacion: string | undefined;
    fechaActualizacion: string | undefined;
}

export class CotizacionFiltro {
    estado: CotizacionEstado | undefined;
    pendientes: boolean = true;
    texto: string | undefined;
    size: number = 20;
    page: number = 0;
    sort: string = 'fechaCreacion,desc';
}

export interface MensajeContacto {
    id: number;
    nombre: string;
    email: string;
    telefono: string | null;
    mensaje: string;
    motivo: MensajeMotivo;
    motivoTexto: string;
    codigoSeguimiento: string | null;
    atendido: boolean;
    fechaCreacion: string;
}

export type MensajeMotivo = 'CONSULTA' | 'ENVIO' | 'RECLAMO' | 'PROVEEDOR' | 'TRABAJO' | 'PRECIO';

/** Motivos del formulario de contacto de la página web, con su color e ícono. */
export const MOTIVOS_MENSAJE: { value: MensajeMotivo; label: string; severidad: 'info' | 'warn' | 'success' | 'danger' | 'secondary' | 'contrast'; icono: string }[] = [
    { value: 'CONSULTA', label: 'Consulta general', severidad: 'secondary', icono: 'pi pi-comment' },
    { value: 'ENVIO', label: 'Estado de un envío', severidad: 'info', icono: 'pi pi-truck' },
    { value: 'RECLAMO', label: 'Reclamo o sugerencia', severidad: 'danger', icono: 'pi pi-exclamation-circle' },
    { value: 'PROVEEDOR', label: 'Proveedor', severidad: 'contrast', icono: 'pi pi-briefcase' },
    { value: 'TRABAJO', label: 'Trabajar con nosotros', severidad: 'success', icono: 'pi pi-id-card' },
    { value: 'PRECIO', label: 'Pide un precio', severidad: 'warn', icono: 'pi pi-dollar' }
];

export function motivoMensaje(m: MensajeMotivo | undefined) {
    return MOTIVOS_MENSAJE.find((x) => x.value === m) ?? MOTIVOS_MENSAJE[0];
}

export interface Pendientes {
    cotizaciones: number;
    mensajes: number;
}
