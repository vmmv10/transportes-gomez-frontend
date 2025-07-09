import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DevolucionesTableComponent } from '../devoluciones-table/devoluciones-table.component';
import { DevolucionFiltro } from '../../models/devolucion-filtro.model';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-devoluciones',
    imports: [BreadcrumbModule, CommonModule, DevolucionesTableComponent, PaginatorModule, TableModule, TagModule, ButtonModule, FormsModule, InputTextModule, RouterModule, ToastModule, TooltipModule, ConfirmDialogModule],
    templateUrl: './devoluciones.component.html',
    styleUrl: './devoluciones.component.scss'
})
export class DevolucionesComponent {
    filtro: DevolucionFiltro = new DevolucionFiltro();
    breadcrumb: MenuItem[] = [];
    
    constructor(
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Devoluciones', routerLink: '/devoluciones' }
        ];
    }
}
