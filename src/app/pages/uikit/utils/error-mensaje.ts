/**
 * Mensaje legible de un error HTTP del backend.
 * El backend responde { message: '...' } en los errores de validación (400).
 */
export function mensajeError(error: any, porDefecto: string): string {
    const mensaje = error?.error?.message;
    return typeof mensaje === 'string' && mensaje.trim() ? mensaje : porDefecto;
}
