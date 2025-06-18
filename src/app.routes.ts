import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './authGuard';
import { EscuelasListComponent } from './app/pages/escuelas/components/escuelas-list/escuelas-list.component';
import { EscuelasFormComponent } from './app/pages/escuelas/components/escuelas-form/escuelas-form.component';
import { EscuelasDashboardComponent } from './app/pages/escuelas/components/escuelas-dashboard/escuelas-dashboard.component';
import { ItemsListaComponent } from './app/pages/items/components/items-lista/items-lista.component';
import { OrdenesServiciosComponent } from './app/pages/ordenes-servicios/components/ordenes-servicios/ordenes-servicios.component';
import { DocumentosComponent } from './app/pages/documentos/components/documentos/documentos.component';
import { DocumentosFormComponent } from './app/pages/documentos/components/documentos-form/documentos-form.component';
import { OrdenesServiciosFormComponent } from './app/pages/ordenes-servicios/components/ordenes-servicios-form/ordenes-servicios-form.component';
import { RutasComponent } from './app/pages/rutas/components/rutas/rutas.component';
import { RutasFormComponent } from './app/pages/rutas/components/rutas-form/rutas-form.component';
import { EntregasComponent } from './app/pages/entregas/components/entregas/entregas.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'escuelas', component: EscuelasListComponent },
            { path: 'escuelas/formulario', component: EscuelasFormComponent },
            { path: 'escuelas/formulario/:id', component: EscuelasFormComponent },
            { path: 'escuelas/:id/dashboard', component: EscuelasDashboardComponent },
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
            { path: 'entregas', component: EntregasComponent },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
