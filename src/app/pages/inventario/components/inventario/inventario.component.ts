import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
        BodegasSelectComponent
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
        private saldoBodegaService: SaldoBodegaService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Inventario', routerLink: '/inventario' }
        ];
    }

    getData() {
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
        this.getData();
    }
}
