/** Usuario para la administración: acceso en Auth0 + datos del ERP. */
export class UsuarioAdmin {
    id: number | undefined;
    auth0Id: string | undefined;
    email: string = '';
    nombre: string | null = '';
    apellidos: string | null = '';
    telefono: string | null = '';
    /** Administrador, Operaciones, Bodega, Conductor, Cliente */
    roles: string[] = [];
    /** Organización del usuario con rol Cliente */
    clienteId: number | undefined;
    clienteNombre: string | undefined;
    bloqueado: boolean = false;
    ultimoIngreso: string | null = null;
    creado: string | null = null;
    ingresos: number = 0;
}

/** Qué hace cada rol (se muestra al asignarlos). */
export const ROLES_DESCRIPCION: Record<string, string> = {
    Administrador: 'Todo el sistema, incluida la administración de usuarios',
    Operaciones: 'Órdenes de servicio, rutas y entregas',
    Bodega: 'Ingresos, bultos, inventario y devoluciones',
    Conductor: 'Sus rutas y entregas (app del chofer)',
    Cliente: 'Solo la información de su organización'
};
