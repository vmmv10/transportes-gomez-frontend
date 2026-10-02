export type VehiculoTipo = 'CAMIONETA' | 'CAMION' | 'FURGON' | 'BUS' | 'LANCHA' | 'OTRO';
export type VehiculoPropiedad = 'PROPIO' | 'ARRENDADO';
export type VehiculoEstado = 'OPERATIVO' | 'EN_MANTENCION' | 'FUERA_DE_SERVICIO';

export const TIPOS_VEHICULO: { label: string; value: VehiculoTipo; icono: string }[] = [
    { label: 'Camioneta', value: 'CAMIONETA', icono: 'pi pi-car' },
    { label: 'Camión', value: 'CAMION', icono: 'pi pi-truck' },
    { label: 'Furgón', value: 'FURGON', icono: 'pi pi-truck' },
    { label: 'Bus', value: 'BUS', icono: 'pi pi-users' },
    { label: 'Lancha', value: 'LANCHA', icono: 'pi pi-compass' },
    { label: 'Otro', value: 'OTRO', icono: 'pi pi-box' }
];

export const PROPIEDADES_VEHICULO: { label: string; value: VehiculoPropiedad }[] = [
    { label: 'Propio', value: 'PROPIO' },
    { label: 'Arrendado', value: 'ARRENDADO' }
];

export const ESTADOS_VEHICULO: { label: string; value: VehiculoEstado; severidad: 'success' | 'warn' | 'danger' }[] = [
    { label: 'Operativo', value: 'OPERATIVO', severidad: 'success' },
    { label: 'En mantención', value: 'EN_MANTENCION', severidad: 'warn' },
    { label: 'Fuera de servicio', value: 'FUERA_DE_SERVICIO', severidad: 'danger' }
];

export function tipoVehiculoTexto(tipo: VehiculoTipo | undefined): string {
    return TIPOS_VEHICULO.find((t) => t.value === tipo)?.label ?? '';
}

export function tipoVehiculoIcono(tipo: VehiculoTipo | undefined): string {
    return TIPOS_VEHICULO.find((t) => t.value === tipo)?.icono ?? 'pi pi-truck';
}

/** Vehículo propio (camioneta, camión, furgón) o lancha arrendada para llegar a las islas. */
export class Vehiculo {
    id: number | undefined;
    tipo: VehiculoTipo | undefined;
    propiedad: VehiculoPropiedad = 'PROPIO';
    /** Patente, o matrícula si es lancha */
    patente: string | undefined;
    /** Nombre corto para reconocerlo: "Hilux blanca", "Lancha Don Lucho" */
    nombre: string = '';
    marca: string | undefined;
    modelo: string | undefined;
    anio: number | undefined;
    /** Arrendador */
    proveedorId: number | undefined;
    proveedorNombre: string | undefined;
    capacidadKg: number | undefined;
    capacidadM3: number | undefined;
    capacidadPasajeros: number | undefined;
    estado: VehiculoEstado = 'OPERATIVO';
    observaciones: string | undefined;
    activo: boolean = true;
    /** Calculado por el backend: "Hilux blanca · ABCD12" */
    descripcion: string | undefined;
}

export class VehiculoFiltro {
    /** Busca en nombre, patente, marca y modelo */
    texto: string | undefined;
    tipo: VehiculoTipo | undefined;
    propiedad: VehiculoPropiedad | undefined;
    estado: VehiculoEstado | undefined;
    activo: boolean | undefined = true;
    size: number = 10;
    page: number = 0;
    sort: string = 'nombre,asc';
}
