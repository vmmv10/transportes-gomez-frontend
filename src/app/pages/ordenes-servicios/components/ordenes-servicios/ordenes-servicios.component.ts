import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { OrdenServicioFiltro } from '../../models/orden-servicio-filtro.model';
import { OrdenesServiciosTableComponent } from '../ordenes-servicios-table/ordenes-servicios-table.component';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { RolService } from '../../../uikit/services/rol.service';

@Component({
    standalone: true,
    selector: 'app-ordenes-servicios',
    imports: [BreadcrumbModule, OrdenesServiciosTableComponent, ButtonModule, RouterLink],
    templateUrl: './ordenes-servicios.component.html',
    styleUrl: './ordenes-servicios.component.scss'
})
export class OrdenesServiciosComponent {
    filtro: OrdenServicioFiltro = new OrdenServicioFiltro();
    breadcrumb: MenuItem[] = [];

    constructor() {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Ordenes de Servicio', routerLink: '/ordenes-servicios' }
        ];
    }
}
