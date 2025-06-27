import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { EscuelasListComponent } from './escuelas/components/escuelas-list/escuelas-list.component';
import { EscuelasFormComponent } from './escuelas/components/escuelas-form/escuelas-form.component';
import { EscuelasDashboardComponent } from './escuelas/components/escuelas-dashboard/escuelas-dashboard.component';
import { Dashboard } from './dashboard/dashboard';
import { ItemsListaComponent } from './items/components/items-lista/items-lista.component';
import { DocumentosComponent } from './documentos/components/documentos/documentos.component';
import { DocumentosFormComponent } from './documentos/components/documentos-form/documentos-form.component';
import { OrdenesServiciosComponent } from './ordenes-servicios/components/ordenes-servicios/ordenes-servicios.component';
import { OrdenesServiciosFormComponent } from './ordenes-servicios/components/ordenes-servicios-form/ordenes-servicios-form.component';
import { RutasComponent } from './rutas/components/rutas/rutas.component';
import { RutasFormComponent } from './rutas/components/rutas-form/rutas-form.component';
import { EntregasComponent } from './entregas/components/entregas/entregas.component';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'escuelas', component: EscuelasListComponent },
    { path: 'escuelas/formulario', component: EscuelasFormComponent },
    { path: 'escuelas/formulario/:id', component: EscuelasFormComponent },
    { path: 'escuelas/:id/dashboard', component: EscuelasDashboardComponent },
    { path: '', component: Dashboard },
    { path: 'items', component: ItemsListaComponent },
    { path: 'documentos', component: DocumentosComponent },
    { path: 'documentos/formulario', component: DocumentosFormComponent },
    { path: 'documentos/formulario/:id', component: DocumentosFormComponent },
    { path: 'ordenes-servicios', component: OrdenesServiciosComponent },
    { path: 'ordenes-servicios/formulario', component: OrdenesServiciosFormComponent },
    { path: 'ordenes-servicios/formulario/:id', component: OrdenesServiciosFormComponent },
    { path: 'rutas', component: RutasComponent },
    { path: 'rutas/formulario', component: RutasFormComponent },
    { path: 'rutas/formulario/:id', component: RutasFormComponent },
    { path: 'entregas', component: EntregasComponent }
] as Routes;
