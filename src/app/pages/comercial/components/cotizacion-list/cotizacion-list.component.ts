import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Page } from '../../../uikit/models/page.model';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { Cotizacion, CotizacionEstado, CotizacionFiltro, ESTADOS_COTIZACION, Pendientes, estadoCotizacion } from '../../models/comercial.models';
import { ComercialService } from '../../services/comercial.service';

@Component({
    standalone: true,
    selector: 'app-cotizacion-list',
    imports: [CommonModule, FormsModule, RouterModule, BreadcrumbModule, ButtonModule, InputTextModule, PaginatorModule, SelectModule, TableModule, TagModule, ToastModule],
    templateUrl: './cotizacion-list.component.html',
    providers: [MessageService]
})
export class CotizacionListComponent implements OnInit {
    breadcrumb: MenuItem[] = [{ label: 'Home', icon: 'pi pi-home', routerLink: '/' }, { label: 'Comercial' }, { label: 'Cotizaciones', routerLink: '/comercial/cotizaciones' }];
    loading = false;
    data: Page<Cotizacion> | undefined;
    filtro = new CotizacionFiltro();
    pendientes: Pendientes | undefined;
    /** "Por atender" (NUEVA + EN_REVISION) o un estado puntual */
    opcionesEstado: { label: string; value: string }[] = [{ label: 'Por atender', value: 'PENDIENTES' }, { label: 'Todas', value: 'TODAS' }, ...ESTADOS_COTIZACION.map((e) => ({ label: e.label, value: e.value }))];
    estadoSeleccionado = 'PENDIENTES';

    constructor(
        private comercialService: ComercialService,
        private messageService: MessageService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getData();
        this.comercialService.getPendientes().subscribe({ next: (p) => (this.pendientes = p), error: () => {} });
    }

    estado(e: CotizacionEstado) {
        return estadoCotizacion(e);
    }

    onEstadoChange() {
        this.filtro.pendientes = this.estadoSeleccionado === 'PENDIENTES';
        this.filtro.estado = this.estadoSeleccionado === 'PENDIENTES' || this.estadoSeleccionado === 'TODAS' ? undefined : (this.estadoSeleccionado as CotizacionEstado);
        this.buscar();
    }

    buscar() {
        this.filtro.page = 0;
        this.getData();
    }

    getData() {
        this.loading = true;
        this.comercialService.getCotizaciones(this.filtro).subscribe({
            next: (d) => {
                this.data = d;
                this.loading = false;
            },
            error: (e) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(e, 'Error al obtener cotizaciones') });
            }
        });
    }

    pageChange(e: any) {
        this.filtro.page = e.page;
        this.filtro.size = e.rows;
        this.getData();
    }

    abrir(c: Cotizacion) {
        this.router.navigate(['/comercial/cotizaciones', c.id]);
    }
}
