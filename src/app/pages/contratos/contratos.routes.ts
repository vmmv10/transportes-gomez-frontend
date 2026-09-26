import { Routes } from '@angular/router';
import { authGuard } from '../../../authGuard';
import { ContratoFormComponent } from './components/contrato-form/contrato-form.component';
import { ContratoListComponent } from './components/contrato-list/contrato-list.component';

export default [
    { path: '', component: ContratoListComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario', component: ContratoFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario/:id', component: ContratoFormComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } }
] as Routes;
