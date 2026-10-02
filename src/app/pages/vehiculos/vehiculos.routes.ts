import { Routes } from '@angular/router';
import { authGuard } from '../../../authGuard';
import { ADMINISTRADOR, OPERACIONES } from '../uikit/permisos';
import { VehiculoListComponent } from './components/vehiculo-list/vehiculo-list.component';

export default [{ path: '', component: VehiculoListComponent, canActivate: [authGuard], data: { roles: [ADMINISTRADOR, OPERACIONES] } }] as Routes;
