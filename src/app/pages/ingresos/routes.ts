import { Routes } from '@angular/router';
import { authGuard } from '../../../authGuard';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { IngresosFormularioComponent } from './components/ingresos-formulario/ingresos-formulario.component';

export default [
    { path: '', component: IngresosComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario', component: IngresosFormularioComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario/:id', component: IngresosFormularioComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } }
] as Routes;
