import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { EscuelasListComponent } from './escuelas/components/escuelas-list/escuelas-list.component';
import { EscuelasFormComponent } from './escuelas/components/escuelas-form/escuelas-form.component';
import { EscuelasDashboardComponent } from './escuelas/components/escuelas-dashboard/escuelas-dashboard.component';
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

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },

    // Solo Administrador
    { path: 'escuelas', component: EscuelasListComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'escuelas/formulario', component: EscuelasFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'escuelas/formulario/:id', component: EscuelasFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'escuelas/dashboard/:id', component: EscuelasDashboardComponent, canActivate: [authGuard], data: { roles: ['Administrador', 'Cliente'] } },

    // Todos los roles pueden ver dashboard
    { path: '', component: Dashboard, canActivate: [authGuard] },

    // Solo Conductor
    { path: 'rutas', component: RutasComponent, canActivate: [authGuard], data: { roles: ['Conductor', 'Administrador'] } },
    { path: 'rutas/formulario', component: RutasFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'rutas/formulario/:id', component: RutasFormComponent, canActivate: [authGuard], data: { roles: ['Conductor', 'Administrador'] } },
    { path: 'entregas', component: EntregasComponent, canActivate: [authGuard], data: { roles: ['Conductor', 'Administrador'] } },

    // Solo Cliente
    { path: 'documentos', component: DocumentosComponent, canActivate: [authGuard], data: { roles: ['Cliente', 'Administrador'] } },
    { path: 'documentos/formulario', component: DocumentosFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'documentos/formulario/:id', component: DocumentosFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },

    // Otros
    { path: 'items', component: ItemsListaComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'ordenes-servicios', component: OrdenesServiciosComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'ordenes-servicios/formulario', component: OrdenesServiciosFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'ordenes-servicios/formulario/:id', component: OrdenesServiciosFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },

] as Routes;

