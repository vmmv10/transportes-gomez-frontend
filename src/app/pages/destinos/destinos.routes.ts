import { Routes } from '@angular/router';
import { authGuard } from '../../../authGuard';
import { DestinoFormComponent } from './components/destino-form/destino-form.component';
import { DestinoListComponent } from './components/destino-list/destino-list.component';

export default [
    { path: '', component: DestinoListComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario', component: DestinoFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario/:id', component: DestinoFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } }
] as Routes;
