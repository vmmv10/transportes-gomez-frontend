import { Comuna } from '../../catalogos/models/comuna.model';

export type ClienteSector = 'PUBLICO' | 'PRIVADO';
export type ClienteTipoPersona = 'NATURAL' | 'JURIDICA';

/** Quien contrata el servicio y a quien se le cobra (ej. SLEP Chiloé). */
export class Cliente {
    id: number | undefined;
    rut: string = '';
    razonSocial: string = '';
    nombreCorto: string = '';
    tipoPersona: ClienteTipoPersona = 'JURIDICA';
    sector: ClienteSector = 'PRIVADO';
    giro: string = '';
    direccion: string = '';
    comuna: Comuna | undefined;
    telefono: string = '';
    email: string = '';
    contacto: string = '';
    /** Código de comprador en Mercado Público (solo organismos públicos) */
    codigoMp: string = '';
    activo: boolean = true;
}
