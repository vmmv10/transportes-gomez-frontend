import { Routes } from '@angular/router';
import { authGuard } from '../../../authGuard';
import { ADMINISTRADOR, OPERACIONES } from '../uikit/permisos';
import { CotizacionFormComponent } from './components/cotizacion-form/cotizacion-form.component';
import { CotizacionListComponent } from './components/cotizacion-list/cotizacion-list.component';
import { MensajeListComponent } from './components/mensaje-list/mensaje-list.component';
import { TarifaListComponent } from './components/tarifa-list/tarifa-list.component';

const roles = { roles: [ADMINISTRADOR, OPERACIONES] };

export default [
    { path: '', redirectTo: 'cotizaciones', pathMatch: 'full' },
    { path: 'cotizaciones', component: CotizacionListComponent, canActivate: [authGuard], data: roles },
    { path: 'cotizaciones/:id', component: CotizacionFormComponent, canActivate: [authGuard], data: roles },
    { path: 'tarifas', component: TarifaListComponent, canActivate: [authGuard], data: roles },
    { path: 'mensajes', component: MensajeListComponent, canActivate: [authGuard], data: roles }
] as Routes;
