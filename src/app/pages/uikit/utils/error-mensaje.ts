/**
 * Mensaje legible de un error HTTP del backend.
 * El backend responde { message: '...' } en los errores de validación (400) y de servicios externos (503).
 * Si no trae mensaje, se explica según el código HTTP.
 */
export function mensajeError(error: any, porDefecto: string): string {
    const mensaje = error?.error?.message;
    if (typeof mensaje === 'string' && mensaje.trim()) {
        return mensaje;
    }
    switch (error?.status) {
        case 0:
            return `${porDefecto}: no hay conexión con el servidor`;
        case 401:
            return `${porDefecto}: tu sesión expiró, vuelve a iniciar sesión`;
        case 403:
            return `${porDefecto}: tu usuario no tiene el rol necesario (si te lo asignaron recién, cierra sesión y vuelve a entrar)`;
        case 404:
            return `${porDefecto}: no encontrado`;
        default:
            return error?.status ? `${porDefecto} (error ${error.status})` : porDefecto;
    }
}
