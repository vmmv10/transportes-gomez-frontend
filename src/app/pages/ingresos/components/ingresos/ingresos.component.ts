import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';
import { IngresosTableComponent } from '../ingresos-table/ingresos-table.component';
import { IngresoFiltro } from '../../models/ingreso-filtro.model';

@Component({
    selector: 'app-ingresos',
    imports: [BreadcrumbModule, CommonModule, IngresosTableComponent],
    templateUrl: './ingresos.component.html',
    styleUrl: './ingresos.component.scss'
})
export class IngresosComponent {
    filtro: IngresoFiltro = new IngresoFiltro();
    breadcrumb: MenuItem[] = [];

    constructor() {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Ingresos', routerLink: '/ingresos' }
        ];
    }
}
