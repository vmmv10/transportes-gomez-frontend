import { Routes } from '@angular/router';
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
import { ProveedorListComponent } from './proveedor/components/proveedor-list/proveedor-list.component';
import { ProveedorFormComponent } from './proveedor/components/proveedor-form/proveedor-form.component';
import { DevolucionesComponent } from './devoluciones/components/devoluciones/devoluciones.component';
import { DevolucionesFormularioComponent } from './devoluciones/components/devoluciones-formulario/devoluciones-formulario.component';
import { InventarioComponent } from './inventario/components/inventario/inventario.component';
import { MarcasComponent } from './marcas/components/marcas/marcas.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'establecimientos', children: [{ path: '', loadChildren: () => import('./escuelas/establecimientos.routes') }] },
    { path: 'ingresos', children: [{ path: '', loadChildren: () => import('./ingresos/routes') }] },
    { path: '', component: Dashboard, canActivate: [authGuard], data: { roles: ['Conductor', 'Administrador', 'Cliente'] } },
    { path: 'rutas', component: RutasComponent, canActivate: [authGuard], data: { roles: ['Conductor', 'Administrador'] } },
    { path: 'rutas/formulario', component: RutasFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'rutas/formulario/:id', component: RutasFormComponent, canActivate: [authGuard], data: { roles: ['Conductor', 'Administrador'] } },
    { path: 'entregas', component: EntregasComponent, canActivate: [authGuard], data: { roles: ['Conductor', 'Administrador'] } },
    { path: 'devoluciones', component: DevolucionesComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'devoluciones/formulario', component: DevolucionesFormularioComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'devoluciones/formulario/:id', component: DevolucionesFormularioComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'documents', component: DocumentosComponent, canActivate: [authGuard], data: { roles: ['Cliente', 'Administrador'] } },
    { path: 'documents/formulario', component: DocumentosFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'documents/formulario/:id', component: DocumentosFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'proveedores', component: ProveedorListComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'proveedores/formulario', component: ProveedorFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'proveedores/formulario/:id', component: ProveedorFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'items', component: ItemsListaComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'inventario', component: InventarioComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'ordenes-servicios', component: OrdenesServiciosComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'ordenes-servicios/formulario', component: OrdenesServiciosFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'ordenes-servicios/formulario/:id', component: OrdenesServiciosFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'ordenes-servicios/formulario/documento/:documento/:tipo', component: OrdenesServiciosFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'usuarios/perfil', component: UsuariosFormComponent, canActivate: [authGuard], data: { roles: ['Administrador', 'Conductor', 'Cliente'] } },
    { path: 'marcas', component: MarcasComponent, canActivate: [authGuard], data: { roles: ['Administrador', 'Conductor', 'Cliente'] } }
] as Routes;
