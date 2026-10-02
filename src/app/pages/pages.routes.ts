import { Routes } from '@angular/router';
import { ADMINISTRADOR, BODEGA, CLIENTE, CONDUCTOR, INTERNOS, OPERACIONES, TODOS } from './uikit/permisos';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { Dashboard } from './dashboard/dashboard';
import { ItemsListaComponent } from './items/components/items-lista/items-lista.component';
import { DocumentosComponent } from './documentos/components/documentos/documentos.component';
import { DocumentosFormComponent } from './documentos/components/documentos-form/documentos-form.component';
import { OrdenesServiciosComponent } from './ordenes-servicios/components/ordenes-servicios/ordenes-servicios.component';
import { OrdenesServiciosFormComponent } from './ordenes-servicios/components/ordenes-servicios-form/ordenes-servicios-form.component';
import { RutasComponent } from './rutas/components/rutas/rutas.component';
import { RutasFormComponent } from './rutas/components/rutas-form/rutas-form.component';
import { EntregasComponent } from './entregas/components/entregas/entregas.component';
import { authGuard } from '../../authGuard';
import { UsuariosFormComponent } from './usuarios/components/usuarios-form/usuarios-form.component';
import { UsuariosAdminComponent } from './usuarios/components/usuarios-admin/usuarios-admin.component';
import { ProveedorListComponent } from './proveedor/components/proveedor-list/proveedor-list.component';
import { ProveedorFormComponent } from './proveedor/components/proveedor-form/proveedor-form.component';
import { DevolucionesComponent } from './devoluciones/components/devoluciones/devoluciones.component';
import { DevolucionesFormularioComponent } from './devoluciones/components/devoluciones-formulario/devoluciones-formulario.component';
import { InventarioComponent } from './inventario/components/inventario/inventario.component';
import { MarcasComponent } from './marcas/components/marcas/marcas.component';
import { EntregadosComponent } from './items/components/entregados/entregados.component';
import { CostosRutasComponent } from './rutas/components/costos-rutas/costos-rutas.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'establecimientos', children: [{ path: '', loadChildren: () => import('./escuelas/establecimientos.routes') }] },
    { path: 'ingresos', children: [{ path: '', loadChildren: () => import('./ingresos/routes') }] },
    { path: 'clientes', children: [{ path: '', loadChildren: () => import('./clientes/clientes.routes') }] },
    { path: 'destinos', children: [{ path: '', loadChildren: () => import('./destinos/destinos.routes') }] },
    { path: 'contratos', children: [{ path: '', loadChildren: () => import('./contratos/contratos.routes') }] },
    { path: 'vehiculos', children: [{ path: '', loadChildren: () => import('./vehiculos/vehiculos.routes') }] },
    { path: 'comercial', children: [{ path: '', loadChildren: () => import('./comercial/comercial.routes') }] },
    { path: 'costos-rutas', component: CostosRutasComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES] } },
    { path: '', component: Dashboard, canActivate: [authGuard], data: { roles: TODOS } },
    { path: 'rutas', component: RutasComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES, CONDUCTOR] } },
    { path: 'rutas/formulario', component: RutasFormComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES] } },
    { path: 'rutas/formulario/:id', component: RutasFormComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES, CONDUCTOR] } },
    { path: 'entregas', component: EntregasComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES, CONDUCTOR] } },
    { path: 'devoluciones', component: DevolucionesComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'devoluciones/formulario', component: DevolucionesFormularioComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'devoluciones/formulario/:id', component: DevolucionesFormularioComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'documents', component: DocumentosComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'documents/formulario', component: DocumentosFormComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'documents/formulario/:id', component: DocumentosFormComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'proveedores', component: ProveedorListComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'proveedores/formulario', component: ProveedorFormComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'proveedores/formulario/:id', component: ProveedorFormComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'items', component: ItemsListaComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'items/entregados', component: EntregadosComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'inventario', component: InventarioComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES, BODEGA, CLIENTE] } },
    { path: 'ordenes-servicios', component: OrdenesServiciosComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'ordenes-servicios/formulario', component: OrdenesServiciosFormComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'ordenes-servicios/formulario/:id', component: OrdenesServiciosFormComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'ordenes-servicios/ingreso/:ingreso', component: OrdenesServiciosFormComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'ordenes-servicios/formulario/documento/:documento/:tipo', component: OrdenesServiciosFormComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'usuarios', component: UsuariosAdminComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR] } },
    { path: 'usuarios/perfil', component: UsuariosFormComponent, canActivate: [authGuard], data: { roles: TODOS } },
    { path: 'marcas', component: MarcasComponent, canActivate: [authGuard], data: { roles: INTERNOS } },
    { path: 'mantencion/categorias-os', children: [{ path: '', loadChildren: () => import('./ordenes-servicios-categorias/pages.routes') }] }
] as Routes;
