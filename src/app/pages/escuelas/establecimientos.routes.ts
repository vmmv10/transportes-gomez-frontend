import { Routes } from '@angular/router';
import { ADMINISTRADOR, BODEGA, CLIENTE, OPERACIONES } from '../uikit/permisos';
import { authGuard } from '../../../authGuard';
import { EscuelasDashboardComponent } from './components/escuelas-dashboard/escuelas-dashboard.component';
import { EscuelasFormComponent } from './components/escuelas-form/escuelas-form.component';
import { EscuelasListComponent } from './components/escuelas-list/escuelas-list.component';

export default [
    { path: '', component: EscuelasListComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES, BODEGA, CLIENTE] } },
    { path: 'formulario', component: EscuelasFormComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES] } },
    { path: 'formulario/:id', component: EscuelasFormComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES] } },
    { path: 'dashboard/:id', component: EscuelasDashboardComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES, BODEGA, CLIENTE] } }
] as Routes;
