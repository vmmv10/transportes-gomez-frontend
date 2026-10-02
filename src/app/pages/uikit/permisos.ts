/**
 * Roles de Auth0 y qué pantallas puede usar cada uno.
 * Debe coincidir con la tabla de permisos del backend (config/Permisos.java).
 */
export const ADMINISTRADOR = 'Administrador';
export const OPERACIONES = 'Operaciones';
export const BODEGA = 'Bodega';
export const CONDUCTOR = 'Conductor';
export const CLIENTE = 'Cliente';

export const TODOS = [ADMINISTRADOR, OPERACIONES, BODEGA, CONDUCTOR, CLIENTE];
export const INTERNOS = [ADMINISTRADOR, OPERACIONES, BODEGA];

/** Opciones del menú por rol (por la etiqueta del menú). */
export const PERMISOS_MENU: Record<string, string[]> = {
    Dashboard: TODOS,
    Establecimientos: [ADMINISTRADOR, OPERACIONES, BODEGA, CLIENTE],
    'Ordenes de Servicios': INTERNOS,
    Documentos: INTERNOS,
    Entregas: [ADMINISTRADOR, OPERACIONES, CONDUCTOR],
    Devoluciones: INTERNOS,
    Rutas: [ADMINISTRADOR, OPERACIONES, CONDUCTOR],
    Articulos: INTERNOS,
    Inventario: [ADMINISTRADOR, OPERACIONES, BODEGA, CLIENTE],
    Ingresos: [ADMINISTRADOR, OPERACIONES, BODEGA, CLIENTE],
    Clientes: [ADMINISTRADOR],
    Contratos: [ADMINISTRADOR],
    Destinos: [ADMINISTRADOR, OPERACIONES],
    Proveedores: INTERNOS,
    Transportes: [ADMINISTRADOR, OPERACIONES],
    Comercial: [ADMINISTRADOR, OPERACIONES],
    Usuarios: [ADMINISTRADOR]
};

export function puedeVer(menuLabel: string, roles: string[]): boolean {
    const permitidos = PERMISOS_MENU[menuLabel] ?? [ADMINISTRADOR];
    return roles.some((r) => permitidos.includes(r));
}
