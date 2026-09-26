import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { EntregaFiltro } from '../../models/entrega-filtro.models';
import { EntregasTableComponent } from '../entregas-table/entregas-table.component';
import { EscuelasSelectComponent } from '../../../escuelas/components/escuelas-select/escuelas-select.component';
import { CategoriasSelectComponent } from '../../../categorias/components/categorias-select/categorias-select.component';
import { SelectBooleanComponent } from '../../../uikit/components/select-boolean/select-boolean.component';
import { Escuela } from '../../../escuelas/models/escuela.models';
import { Categoria } from '../../../categorias/models/categoria.model';

@Component({
    standalone: true,
    selector: 'app-entregas',
    imports: [
        CommonModule,
        FormsModule,
        BreadcrumbModule,
        ButtonModule,
        InputTextModule,
        PanelModule,
        TooltipModule,
        EntregasTableComponent,
        EscuelasSelectComponent,
        CategoriasSelectComponent,
        SelectBooleanComponent
    ],
    templateUrl: './entregas.component.html',
    styleUrl: './entregas.component.scss',
    providers: [MessageService]
})
export class EntregasComponent {
    @ViewChild('tabla') tabla!: EntregasTableComponent;

    filtro: EntregaFiltro = new EntregaFiltro();
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
            { label: 'Entregas', routerLink: '/entregas' }
        ];
        // Se lee en el constructor para que la tabla ya tenga los filtros en su primera carga
        this.leerQueryParams();
        this.filtrosVisibles = this.filtrosActivos > 0;
    }

    /** Cantidad de filtros aplicados (se muestra como badge en el botón). */
    get filtrosActivos(): number {
        const f = this.filtro;
        return [f.ordenServicioId, f.oc, f.escuela, f.categoria, f.entregado, f.fecha].filter((v) => v !== undefined && v !== null && v !== '').length;
    }

    buscar() {
        this.filtro.page = 0;
        this.tabla.getData();
    }

    limpiarFiltros() {
        this.filtro.ordenServicioId = '';
        this.filtro.oc = undefined;
        this.filtro.escuela = undefined;
        this.filtro.categoria = undefined;
        this.filtro.entregado = undefined;
        this.filtro.fecha = undefined;
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

        this.filtro.ordenServicioId = p.get('orden') ?? '';
        this.filtro.oc = p.get('oc') || undefined;

        const escuela = numero('escuela');
        this.filtro.escuela = escuela !== undefined ? ({ id: escuela } as unknown as Escuela) : undefined;

        const categoria = numero('categoria');
        this.filtro.categoria = categoria !== undefined ? ({ id: categoria } as unknown as Categoria) : undefined;

        const estado = p.get('estado');
        this.filtro.entregado = estado === 'entregado' ? true : estado === 'pendiente' ? false : undefined;

        const fecha = p.get('fecha');
        this.filtro.fecha = fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : undefined;

        this.filtro.page = numero('page') ?? 0;
        this.filtro.size = numero('size') ?? 10;
    }

    private actualizarQueryParams() {
        const f = this.filtro;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                orden: f.ordenServicioId || null,
                oc: f.oc || null,
                escuela: f.escuela?.id ?? null,
                categoria: f.categoria?.id ?? null,
                estado: f.entregado === true ? 'entregado' : f.entregado === false ? 'pendiente' : null,
                fecha: f.fecha || null,
                page: f.page > 0 ? f.page : null,
                size: f.size !== 10 ? f.size : null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
}
