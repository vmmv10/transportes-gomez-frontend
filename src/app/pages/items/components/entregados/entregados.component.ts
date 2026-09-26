import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { OrdenesServiciosItemsComponent } from '../../../ordenes-servicios/components/ordenes-servicios-items/ordenes-servicios-items.component';
import { OrdenServicioFiltro } from '../../../ordenes-servicios/models/orden-servicio-filtro.model';
import { ItemsAutocompleteComponent } from '../items-autocomplete/items-autocomplete.component';
import { EscuelasSelectComponent } from '../../../escuelas/components/escuelas-select/escuelas-select.component';
import { SelectBooleanComponent } from '../../../uikit/components/select-boolean/select-boolean.component';
import { ItemsService } from '../../services/items.service';
import { Escuela } from '../../../escuelas/models/escuela.models';

@Component({
    selector: 'app-entregados',
    imports: [
        CommonModule,
        FormsModule,
        BreadcrumbModule,
        ButtonModule,
        PanelModule,
        OrdenesServiciosItemsComponent,
        ItemsAutocompleteComponent,
        EscuelasSelectComponent,
        SelectBooleanComponent
    ],
    templateUrl: './entregados.component.html',
    styleUrl: './entregados.component.scss',
    standalone: true,
    providers: [MessageService]
})
export class EntregadosComponent {
    @ViewChild('tabla') tabla!: OrdenesServiciosItemsComponent;

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
        private route: ActivatedRoute,
        private itemsService: ItemsService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Artículos', routerLink: '/items' },
            { label: 'Entregados', routerLink: '/items/entregados' }
        ];
        // Se lee en el constructor para que la tabla ya tenga los filtros en su primera carga
        this.leerQueryParams();
        this.filtrosVisibles = this.filtrosActivos > 0;
    }

    /** Cantidad de filtros aplicados (se muestra como badge en el botón). */
    get filtrosActivos(): number {
        const f = this.filtro;
        return [f.item, f.escuela, f.entregado].filter((v) => v !== undefined && v !== null).length;
    }

    buscar() {
        this.filtro.page = 0;
        this.tabla.getData();
    }

    limpiarFiltros() {
        this.filtro.item = undefined;
        this.filtro.escuela = undefined;
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
        const item = numero('articulo');
        if (item !== undefined) {
            // El filtro solo necesita el id; el nombre se carga para mostrarlo en el buscador
            this.filtro.item = { id: item } as any;
            this.itemsService.get(item.toString()).subscribe({
                next: (data) => (this.filtro.item = data),
                error: () => {}
            });
        }
        const escuela = numero('escuela');
        this.filtro.escuela = escuela !== undefined ? ({ id: escuela } as unknown as Escuela) : undefined;
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
                articulo: f.item?.id ?? null,
                escuela: f.escuela?.id ?? null,
                estado: f.entregado === true ? 'entregado' : f.entregado === false ? 'pendiente' : null,
                page: f.page > 0 ? f.page : null,
                size: f.size !== 10 ? f.size : null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
}
