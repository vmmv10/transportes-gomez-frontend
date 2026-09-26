import { Routes } from '@angular/router';
import { authGuard } from '../../../authGuard';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { IngresosFormularioComponent } from './components/ingresos-formulario/ingresos-formulario.component';
import { IngresosInformeComponent } from './components/ingresos-informe/ingresos-informe.component';

export default [
    { path: '', component: IngresosComponent, canActivate: [authGuard], data: { roles: ['Administrador', 'Cliente'] } },
    { path: 'ingreso/:ingreso', component: IngresosFormularioComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario', component: IngresosFormularioComponent, canActivate: [authGuard], data: { roles: ['Administrador', 'Cliente'] } },
    { path: 'formulario/:id', component: IngresosFormularioComponent, canActivate: [authGuard], data: { roles: ['Administrador', 'Cliente'] } },
    { path: 'formulario/:id/informe', component: IngresosInformeComponent, canActivate: [authGuard], data: { roles: ['Administrador', 'Cliente'] } }
] as Routes;
