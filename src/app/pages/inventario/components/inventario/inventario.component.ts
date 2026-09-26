import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { Bodega } from '../../../bodegas/models/Bodega.model';
import { Marca } from '../../../marcas/models/marca.model';
import { Categoria } from '../../../categorias/models/categoria.model';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Page } from '../../../uikit/models/page.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { MarcasSelectComponent } from '../../../marcas/components/marcas-select/marcas-select.component';
import { CategoriasSelectComponent } from '../../../categorias/components/categorias-select/categorias-select.component';
import { PaginatorModule } from 'primeng/paginator';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { SaldoBodega } from '../../models/saldo-bodega.model';
import { SaldoBodegaFiltro } from '../../models/saldo-bodega-filtro.model';
import { SaldoBodegaService } from '../../services/saldo-bodega.service';
import { BodegasSelectComponent } from '../../../bodegas/components/bodegas-select/bodegas-select.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { RolService } from '../../../uikit/services/rol.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-inventario',
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        FormsModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        BreadcrumbModule,
        RouterModule,
        DialogModule,
        TextareaModule,
        ToastModule,
        ConfirmDialogModule,
        TooltipModule,
        MarcasSelectComponent,
        ModalLoadingComponent,
        CategoriasSelectComponent,
        PaginatorModule,
        TableMobileComponent,
        BodegasSelectComponent,
        DialogModule,
        InputNumberModule,
        PanelModule
    ],
    templateUrl: './inventario.component.html',
    styleUrl: './inventario.component.scss',
    providers: [MessageService, ConfirmationService],
    standalone: true
})
export class InventarioComponent {
    @Input() filtro: SaldoBodegaFiltro = new SaldoBodegaFiltro();
    @Input() conBodega: boolean = true;
    data!: Page<SaldoBodega>;
    breadcrumb: MenuItem[] = [];
    loading: boolean = false;
    ajustarDisplay: boolean = false;
    seleccionado!: SaldoBodega | undefined;
    esAdmin$!: Observable<boolean>;
    filtrosVisibles: boolean = false;

    campos: any[] = [
        { etiqueta: 'id', propiedad: 'id', tipo: 'texto' },
        { etiqueta: 'SKU', propiedad: 'codigo', tipo: 'texto' },
        { etiqueta: 'Nombre', propiedad: 'nombre', tipo: 'texto' },
        {
            etiqueta: 'Categoría',
            propiedad: 'categoria.nombre',
            tipo: 'objeto'
        },
        {
            etiqueta: 'Marca',
            propiedad: 'marca.nombre',
            tipo: 'objeto'
        },
        {
            etiqueta: 'Unidad Medida',
            propiedad: 'unidadMedida.nombre',
            tipo: 'objeto'
        }
    ];

    constructor(
        private MessageService: MessageService,
        private confirmationService: ConfirmationService,
        private saldoBodegaService: SaldoBodegaService,
        private rolService: RolService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Inventario', routerLink: '/inventario' }
        ];
    }

    ngOnInit() {
        this.esAdmin$ = this.rolService.tieneRol('Administrador');
        // Solo la pantalla principal (con selector de bodega) usa la URL
        if (this.conBodega) {
            this.leerQueryParams();
        }
        this.filtrosVisibles = this.filtrosActivos > 0;
        if (this.filtro.bodega) {
            this.getData();
        }
    }

    /** Cantidad de filtros aplicados (se muestra como badge en el botón). */
    get filtrosActivos(): number {
        const f = this.filtro;
        return [f.nombre, f.codigo, f.marca, f.categoria].filter((v) => v !== undefined && v !== null && v !== '').length;
    }

    buscar() {
        this.filtro.page = 0;
        this.getData();
    }

    limpiarFiltros() {
        this.filtro.nombre = undefined;
        this.filtro.codigo = undefined;
        this.filtro.marca = undefined;
        this.filtro.categoria = undefined;
        this.buscar();
    }

    private leerQueryParams() {
        const p = this.route.snapshot.queryParamMap;
        const numero = (clave: string) => {
            const v = p.get(clave);
            return v !== null && v !== '' && !isNaN(Number(v)) ? Number(v) : undefined;
        };
        const bodega = numero('bodega');
        if (bodega !== undefined) {
            this.filtro.bodega = { id: bodega } as unknown as Bodega;
        }
        this.filtro.nombre = p.get('nombre') || undefined;
        this.filtro.codigo = p.get('codigo') || undefined;
        const marca = numero('marca');
        this.filtro.marca = marca !== undefined ? ({ id: marca } as unknown as Marca) : undefined;
        const categoria = numero('categoria');
        this.filtro.categoria = categoria !== undefined ? ({ id: categoria } as unknown as Categoria) : undefined;
        this.filtro.page = numero('page') ?? 0;
        this.filtro.size = numero('size') ?? 10;
    }

    private actualizarQueryParams() {
        if (!this.conBodega) {
            return;
        }
        const f = this.filtro;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                bodega: f.bodega?.id ?? null,
                nombre: f.nombre || null,
                codigo: f.codigo || null,
                marca: f.marca?.id ?? null,
                categoria: f.categoria?.id ?? null,
                page: f.bodega && f.page > 0 ? f.page : null,
                size: f.bodega && f.size !== 10 ? f.size : null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    getData() {
        this.actualizarQueryParams();
        if (!this.filtro.bodega) {
            return;
        }
        this.loading = true;
        this.saldoBodegaService.getSaldoBodega(this.filtro).subscribe({
            next: (data) => {
                this.data = data;
                this.loading = false;
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el inventario.' });
                this.loading = false;
            }
        });
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    bodegaChange(bodega: any) {
        this.filtro.bodega = bodega;
        this.filtro.page = 0;
        this.getData();
    }

    ajustarDisplayChange(item: any) {
        this.ajustarDisplay = true;
        this.seleccionado = item;
    }

    ajustar() {
        this.confirmationService.confirm({
            message: '¿Está seguro de ajustar el saldo?',
            key: 'cGuardar',
            accept: () => {
                if (!this.seleccionado || !this.filtro.bodega) {
                    this.MessageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un saldo y una bodega.' });
                    return;
                }
                this.saldoBodegaService.ajustarSaldo(this.seleccionado, this.filtro.bodega.id).subscribe({
                    next: () => {
                        this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Saldo ajustado correctamente.' });
                        this.cerrarAjustarDisplay();
                        this.getData();
                    },
                    error: (error) => {
                        this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo ajustar el saldo.' });
                    }
                });
            }
        });
    }

    cerrarAjustarDisplay() {
        this.ajustarDisplay = false;
        this.seleccionado = new SaldoBodega();
    }
}
