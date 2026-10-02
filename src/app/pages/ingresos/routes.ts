import { Routes } from '@angular/router';
import { ADMINISTRADOR, BODEGA, CLIENTE, OPERACIONES } from '../uikit/permisos';
import { authGuard } from '../../../authGuard';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { IngresosFormularioComponent } from './components/ingresos-formulario/ingresos-formulario.component';
import { IngresosInformeComponent } from './components/ingresos-informe/ingresos-informe.component';

export default [
    { path: '', component: IngresosComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES, BODEGA, CLIENTE] } },
    { path: 'ingreso/:ingreso', component: IngresosFormularioComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES, BODEGA] } },
    { path: 'formulario', component: IngresosFormularioComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES, BODEGA, CLIENTE] } },
    { path: 'formulario/:id', component: IngresosFormularioComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES, BODEGA, CLIENTE] } },
    { path: 'formulario/:id/informe', component: IngresosInformeComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES, BODEGA, CLIENTE] } }
] as Routes;
