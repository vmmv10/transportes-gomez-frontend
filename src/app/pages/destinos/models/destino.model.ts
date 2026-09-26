import { Comuna } from '../../catalogos/models/comuna.model';

export type DestinoTipo = 'ESCUELA' | 'JARDIN' | 'OFICINA' | 'PERSONA' | 'EMPRESA' | 'OTRO';

export const DESTINO_TIPOS: { label: string; value: DestinoTipo; icon: string }[] = [
    { label: 'Escuela', value: 'ESCUELA', icon: 'pi pi-graduation-cap' },
    { label: 'Jardín', value: 'JARDIN', icon: 'pi pi-sun' },
    { label: 'Oficina', value: 'OFICINA', icon: 'pi pi-building' },
    { label: 'Empresa', value: 'EMPRESA', icon: 'pi pi-briefcase' },
    { label: 'Persona', value: 'PERSONA', icon: 'pi pi-user' },
    { label: 'Otro', value: 'OTRO', icon: 'pi pi-map-marker' }
];

export function destinoTipoLabel(tipo: string | undefined): string {
    return DESTINO_TIPOS.find((t) => t.value === tipo)?.label ?? tipo ?? '';
}

export function destinoTipoIcono(tipo: string | undefined): string {
    return DESTINO_TIPOS.find((t) => t.value === tipo)?.icon ?? 'pi pi-map-marker';
}

/** Lugar de entrega: una escuela, una oficina, una persona, etc. */
export class Destino {
    id: number | undefined;
    tipo: DestinoTipo = 'OTRO';
    nombre: string = '';
    direccion: string = '';
    comuna: Comuna | undefined;
    latitud: string = '';
    longitud: string = '';
    contacto: string = '';
    telefono: string = '';
    email: string = '';
    /** Si el destino es un establecimiento, sus datos se mantienen desde Establecimientos */
    escuelaId: number | undefined;
    clienteId: number | undefined;
    clienteNombre: string | undefined;
    activo: boolean = true;
}
