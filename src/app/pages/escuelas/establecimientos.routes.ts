import { Routes } from '@angular/router';
import { authGuard } from '../../../authGuard';
import { EscuelasDashboardComponent } from './components/escuelas-dashboard/escuelas-dashboard.component';
import { EscuelasFormComponent } from './components/escuelas-form/escuelas-form.component';
import { EscuelasListComponent } from './components/escuelas-list/escuelas-list.component';

export default [
    { path: '', component: EscuelasListComponent, canActivate: [authGuard], data: { roles: ['Administrador', 'Cliente'] } },
    { path: 'formulario', component: EscuelasFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario/:id', component: EscuelasFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'dashboard/:id', component: EscuelasDashboardComponent, canActivate: [authGuard], data: { roles: ['Administrador', 'Cliente'] } }
] as Routes;
