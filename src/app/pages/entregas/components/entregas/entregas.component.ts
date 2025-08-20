import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { EntregaFiltro } from '../../models/entrega-filtro.models';
import { EntregasTableComponent } from '../entregas-table/entregas-table.component';
import { Observable } from 'rxjs';
import { RolService } from '../../../uikit/services/rol.service';

@Component({
    standalone: true,
    selector: 'app-entregas',
    imports: [CommonModule, BreadcrumbModule, EntregasTableComponent],
    templateUrl: './entregas.component.html',
    styleUrl: './entregas.component.scss'
})
export class EntregasComponent {
    filtro: EntregaFiltro = new EntregaFiltro();
    breadcrumb: MenuItem[] = [];

    constructor(private rolService: RolService) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Entregas', routerLink: '/entregas' }
        ];
    }
}
