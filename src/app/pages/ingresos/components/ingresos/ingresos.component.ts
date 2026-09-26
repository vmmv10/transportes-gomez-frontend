import { Component, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { IngresosTableComponent } from '../ingresos-table/ingresos-table.component';
import { IngresoFiltro } from '../../models/ingreso-filtro.model';

@Component({
    selector: 'app-ingresos',
    imports: [BreadcrumbModule, CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule, PanelModule, SelectModule, IngresosTableComponent],
    templateUrl: './ingresos.component.html',
    styleUrl: './ingresos.component.scss',
    providers: [MessageService]
})
export class IngresosComponent {
    @ViewChild('tabla') tabla!: IngresosTableComponent;

    filtro: IngresoFiltro = new IngresoFiltro();
    breadcrumb: MenuItem[] = [];
    filtrosVisibles: boolean = false;
    total: number | undefined;

    opcionesEstado: { label: string; value: number }[] = [
        { label: 'Temporal', value: 0 },
        { label: 'Abierto', value: 1 },
        { label: 'Cerrado', value: 2 }
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Ingresos', routerLink: '/ingresos' }
        ];
        // Se lee en el constructor para que la tabla ya tenga los filtros en su primera carga
        this.leerQueryParams();
        this.filtrosVisibles = this.filtrosActivos > 0;
    }

    /** Cantidad de filtros aplicados (se muestra como badge en el botón). */
    get filtrosActivos(): number {
        const f = this.filtro;
        return [f.id, f.estado].filter((v) => v !== undefined && v !== null && v !== '').length;
    }

    buscar() {
        this.filtro.page = 0;
        this.tabla.getData();
    }

    limpiarFiltros() {
        this.filtro.id = undefined;
        this.filtro.estado = undefined;
        this.buscar();
    }

    /** La tabla avisa cada vez que consulta (búsqueda o cambio de página). */
    onBuscado(total: number) {
        this.total = total;
        this.actualizarQueryParams();
    }

    private leerQueryParams() {
        const p = this.route.snapshot.queryParamMap;
        const numero = (clave: string) => {
            const v = p.get(clave);
            return v !== null && v !== '' && !isNaN(Number(v)) ? Number(v) : undefined;
        };
        this.filtro.id = p.get('folio') || undefined;
        const estado = numero('estado');
        this.filtro.estado = estado !== undefined && [0, 1, 2].includes(estado) ? estado : undefined;
        this.filtro.page = numero('page') ?? 0;
        this.filtro.size = numero('size') ?? 10;
    }

    private actualizarQueryParams() {
        const f = this.filtro;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                folio: f.id || null,
                estado: f.estado ?? null,
                page: f.page > 0 ? f.page : null,
                size: f.size !== 10 ? f.size : null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
}
