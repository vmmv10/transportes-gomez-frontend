import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { OrdenServicioFiltro } from '../../models/orden-servicio-filtro.model';
import { OrdenesServiciosTableComponent } from '../ordenes-servicios-table/ordenes-servicios-table.component';
import { EscuelasSelectComponent } from '../../../escuelas/components/escuelas-select/escuelas-select.component';
import { CategoriasSelectComponent } from '../../../categorias/components/categorias-select/categorias-select.component';
import { SelectBooleanComponent } from '../../../uikit/components/select-boolean/select-boolean.component';
import { Escuela } from '../../../escuelas/models/escuela.models';
import { Categoria } from '../../../categorias/models/categoria.model';

@Component({
    standalone: true,
    selector: 'app-ordenes-servicios',
    imports: [
        BreadcrumbModule,
        OrdenesServiciosTableComponent,
        ButtonModule,
        RouterLink,
        PanelModule,
        CommonModule,
        FormsModule,
        InputTextModule,
        EscuelasSelectComponent,
        CategoriasSelectComponent,
        SelectBooleanComponent
    ],
    templateUrl: './ordenes-servicios.component.html',
    styleUrl: './ordenes-servicios.component.scss',
    providers: [MessageService]
})
export class OrdenesServiciosComponent {
    @ViewChild('tabla') tabla!: OrdenesServiciosTableComponent;

    filtro: OrdenServicioFiltro = new OrdenServicioFiltro();
    breadcrumb: MenuItem[] = [];
    filtrosVisibles: boolean = false;
    total: number | undefined;

    opcionesEstado: { label: string; value: boolean }[] = [
        { label: 'Entregado', value: true },
        { label: 'Pendiente', value: false }
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Ordenes de Servicio', routerLink: '/ordenes-servicios' }
        ];
        // Se lee en el constructor para que la tabla ya tenga los filtros en su primera carga
        this.leerQueryParams();
        this.filtrosVisibles = this.filtrosActivos > 0;
    }

    /** Cantidad de filtros aplicados (se muestra como badge en el botón). */
    get filtrosActivos(): number {
        const f = this.filtro;
        return [f.id, f.documentoReferencia, f.escuela, f.categoria, f.entregado].filter((v) => v !== undefined && v !== null && v !== '').length;
    }

    buscar() {
        this.filtro.page = 0;
        this.tabla.getData();
    }

    limpiarFiltros() {
        this.filtro.id = undefined;
        this.filtro.documentoReferencia = undefined;
        this.filtro.escuela = undefined;
        this.filtro.categoria = undefined;
        this.filtro.entregado = undefined;
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

        this.filtro.id = numero('numero');
        this.filtro.documentoReferencia = p.get('oc') || undefined;

        const escuela = numero('escuela');
        this.filtro.escuela = escuela !== undefined ? ({ id: escuela } as unknown as Escuela) : undefined;

        const categoria = numero('categoria');
        this.filtro.categoria = categoria !== undefined ? ({ id: categoria } as unknown as Categoria) : undefined;

        const estado = p.get('estado');
        this.filtro.entregado = estado === 'entregado' ? true : estado === 'pendiente' ? false : undefined;

        this.filtro.page = numero('page') ?? 0;
        this.filtro.size = numero('size') ?? 10;
    }

    private actualizarQueryParams() {
        const f = this.filtro;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                numero: f.id ?? null,
                oc: f.documentoReferencia || null,
                escuela: f.escuela?.id ?? null,
                categoria: f.categoria?.id ?? null,
                estado: f.entregado === true ? 'entregado' : f.entregado === false ? 'pendiente' : null,
                page: f.page > 0 ? f.page : null,
                size: f.size !== 10 ? f.size : null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
}
