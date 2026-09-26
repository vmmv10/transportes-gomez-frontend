import { Routes } from '@angular/router';
import { authGuard } from '../../../authGuard';
import { ClienteFormComponent } from './components/cliente-form/cliente-form.component';
import { ClienteListComponent } from './components/cliente-list/cliente-list.component';

export default [
    { path: '', component: ClienteListComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario', component: ClienteFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario/:id', component: ClienteFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } }
] as Routes;
