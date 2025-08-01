import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Page } from '../../../uikit/models/page.model';
import { Item } from '../../models/item.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ItemsService } from '../../services/items.service';
import { ItemFiltro } from '../../models/item-filtro.model';
import { DialogModule } from 'primeng/dialog';
import { SelectUnidadMedidaComponent } from '../../../uikit/components/select-unidad-medida/select-unidad-medida.component';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { MarcasSelectComponent } from '../../../marcas/components/marcas-select/marcas-select.component';
import { CategoriasSelectComponent } from '../../../categorias/components/categorias-select/categorias-select.component';
import { PaginatorModule } from 'primeng/paginator';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { ItemCodigoProveedor } from '../../models/item-codigo-proveedor.model';
import { ProveedorSelectComponent } from '../../../proveedor/components/proveedor-select/proveedor-select.component';
import { DividerModule } from 'primeng/divider';

@Component({
    standalone: true,
    selector: 'app-items-lista',
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
        SelectUnidadMedidaComponent,
        TextareaModule,
        ToastModule,
        ConfirmDialogModule,
        TooltipModule,
        MarcasSelectComponent,
        ModalLoadingComponent,
        CategoriasSelectComponent,
        PaginatorModule,
        TableMobileComponent,
        ProveedorSelectComponent,
        DividerModule
    ],
    templateUrl: './items-lista.component.html',
    styleUrl: './items-lista.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class ItemsListaComponent {
    items!: Page<Item>;
    item: Item | undefined = undefined;
    tok: string = '';
    filtro: ItemFiltro = new ItemFiltro();
    breadcrumb: MenuItem[] = [];
    loading: boolean = true;
    visible: boolean = false;
    modalCodigoProveedor: boolean = false;
    codigoProveedor: ItemCodigoProveedor = new ItemCodigoProveedor();
    validaCodigoProveedor: boolean = false;

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

    accionesItems = [
        {
            tooltip: 'Editar',
            icono: 'pi pi-pencil',
            color: 'info',
            tipo: 'accion',
            label: 'Editar',
            outlined: true
        },
        {
            tooltip: 'Desactivar',
            icono: 'pi pi-ban',
            color: 'warn',
            tipo: 'accion',
            accion: 'desactivar',
            label: 'Desactivar',
            outlined: true
        }
    ];

    constructor(
        private itemService: ItemsService,
        private MessageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Artículos', routerLink: '/items' }
        ];
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.filtro.activo = true;
        this.loading = true;
        this.itemService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.items = data;
                this.loading = false;
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener Items' });
                this.loading = false;
                console.error('Error fetching items:', error);
            }
        });
    }

    displayFormulario() {
        this.visible = true;
        this.item = new Item();
    }

    eliminar(item: Item) {
        this.loading = true;
        this.itemService.delete(item.id.toString()).subscribe({
            next: () => {
                this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item eliminado correctamente' });
                this.loading = false;
                this.getData();
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el item' });
                console.error('Error deleting item:', error);
                this.loading = false;
            }
        });
    }

    desactivar(item: Item) {
        this.loading = true;
        this.itemService.desactivar(item.id.toString()).subscribe({
            next: () => {
                this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item desactivado correctamente' });
                this.loading = false;
                this.getData();
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al desactivar el item' });
                console.error('Error deactivating item:', error);
                this.loading = false;
            }
        });
    }

    async editar(item: Item) {
        this.loading = true;
        await this.get(item.id.toString());
        this.loading = false;
        this.visible = true;
    }

    async get(id: string) {
        try {
            this.item = await this.itemService.get(id).toPromise();
            this.visible = true;
        } catch (error) {
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el item' });
            console.error('Error fetching item:', error);
        }
    }

    guardar() {
        if (this.item) {
            this.loading = true;
            if (this.item.id) {
                this.itemService.update(this.item).subscribe({
                    next: (updatedItem) => {
                        this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item actualizado correctamente' });
                        this.visible = false;
                        this.item = undefined;
                        this.loading = false;
                        this.getData();
                    },
                    error: (error) => {
                        this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el item' });
                        console.error('Error updating item:', error);
                        this.loading = false;
                    }
                });
            } else {
                this.itemService.create(this.item).subscribe({
                    next: (newItem) => {
                        this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item creado correctamente' });
                        this.visible = false;
                        this.item = undefined;
                        this.loading = false;
                        this.getData();
                    },
                    error: (error) => {
                        this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el item' });
                        console.error('Error creating item:', error);
                        this.loading = false;
                    }
                });
            }
        }
    }

    cerrarModal() {
        this.visible = false;
        this.item = undefined;
    }

    confirmarDesactivar(item: Item) {
        this.confirmationService.confirm({
            message: '¿Desea desactivar el item ' + item.nombre + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.desactivar(item),
            key: 'cDesactive'
        });
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    resolverAccion(event: { tipo: string; item: any }) {
        switch (event.tipo) {
            case 'editar':
                this.editar(event.item);
                break;
            case 'desactivar':
                this.confirmarDesactivar(event.item);
                break;
        }
    }

    confirmarEliminarCodigoProveedor(codigoProveedor: ItemCodigoProveedor) {
        this.confirmationService.confirm({
            message: '¿Desea eliminar el código de proveedor ' + codigoProveedor.codigo + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            key: 'cEliminarCodigoProveedor',
            accept: () => {
                if (this.item && this.item.codigosProveedor) {
                    this.item.codigosProveedor = this.item.codigosProveedor.filter((cp) => cp.codigo !== codigoProveedor.codigo);
                }
            }
        });
    }

    displayModalCodigoProveedor() {
        this.modalCodigoProveedor = true;
    }

    cerrarModalCodigoProveedor() {
        this.modalCodigoProveedor = false;
        this.codigoProveedor = new ItemCodigoProveedor();
        this.validaCodigoProveedor = false;
    }

    guardarCodigoProveedor() {
        this.validaCodigoProveedor = true;
        if (this.item && this.codigoProveedor.proveedor && this.codigoProveedor.codigo) {
            if (!this.item.codigosProveedor) {
                this.item.codigosProveedor = [];
            }
            if (this.item.codigosProveedor.length > 0) {
                const codigoExistente = this.item.codigosProveedor.find((cp) => cp.codigo === this.codigoProveedor.codigo && cp.proveedor.id === this.codigoProveedor.proveedor.id);
                if (codigoExistente) {
                    this.MessageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El código ya existe para el proveedor seleccionado' });
                    return;
                }
            }
            this.validaCodigoProveedor = false;
            if (this.codigoProveedor.id) {
                const index = this.item.codigosProveedor.findIndex((cp) => cp.id === this.codigoProveedor.id);
                if (index !== -1) {
                    this.item.codigosProveedor[index] = this.codigoProveedor;
                }
            } else {
                this.item.codigosProveedor.push(this.codigoProveedor);
            }
            this.cerrarModalCodigoProveedor();
        } else {
            this.MessageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un proveedor y un código' });
        }
    }
}
