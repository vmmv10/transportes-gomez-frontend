import { Routes } from "@angular/router";
import { authGuard } from "../../../authGuard";
import { ErmergenciasIngresosFormularioComponent } from "./components/ermergencias-ingresos-formulario/ermergencias-ingresos-formulario.component";
import { ErmergenciasIngresosComponent } from "./components/ermergencias-ingresos/ermergencias-ingresos.component";

export default [
    { path: '', component: ErmergenciasIngresosComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario', component: ErmergenciasIngresosFormularioComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },
    { path: 'formulario/:id', component: ErmergenciasIngresosFormularioComponent, canActivate: [authGuard], data: { roles: ['Administrador'] } },

] as Routes;
