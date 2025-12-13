import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { Page } from '../../../uikit/models/page.model';
import { OrdenServicioCategoria } from '../../model/orden-servicio-categoria.model';
import { OrdenesServicioCategoriasService } from '../../services/ordenes-servicio-categorias.service';
import { OrdenServicioCategoriaFiltro } from '../../model/orden-servicio-categoria-filtro.model';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
    selector: 'app-ordenes-servicio-categorias',
    imports: [FormsModule, TagModule, DialogModule, CommonModule, BreadcrumbModule, InputTextModule, RouterModule, PaginatorModule, TooltipModule, TableModule, ButtonModule, ModalLoadingComponent, ToastModule, ConfirmDialogModule],
    templateUrl: './ordenes-servicio-categorias.component.html',
    styleUrl: './ordenes-servicio-categorias.component.scss',
    standalone: true,
    providers: [MessageService, ConfirmationService]
})
export class OrdenesServicioCategoriasComponent {
    loading: boolean = false;
    data!: Page<OrdenServicioCategoria>;
    filtro: OrdenServicioCategoriaFiltro = new OrdenServicioCategoriaFiltro();
    categoria: OrdenServicioCategoria = new OrdenServicioCategoria();
    displayFormulario: boolean = false;
    breadcrumb: MenuItem[] = [];

    constructor(
        private ordenesServicioCategoriasService: OrdenesServicioCategoriasService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Mantencion Categorías OS', routerLink: '/mantencion/categorias-os' }
        ];
    }

    ngOnInit(): void {
        this.getData();
    }

    getData() {
        this.loading = true;
        this.ordenesServicioCategoriasService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.data = data;
                this.loading = false;
            },
            error: (err) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los datos' });
            }
        });
    }

    desactivateConfirm(id: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea desactivar esta categoría?',
            header: 'Confirmar',
            key: 'desactivate',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loading = true;
                this.ordenesServicioCategoriasService.desactivate(id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría desactivada correctamente' });
                        this.getData();
                    },
                    error: () => {
                        this.loading = false;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al desactivar la categoría' });
                    }
                });
            }
        });
    }

    activateConfirm(id: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro que desea activar esta categoría?',
            header: 'Confirmar',
            key: 'activate',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.loading = true;
                this.ordenesServicioCategoriasService.activate(id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría activada correctamente' });
                        this.getData();
                    },
                    error: () => {
                        this.loading = false;

                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al activar la categoría' });
                    }
                });
            }
        });
    }

    onPageChange(event: any) {
        if (this.data && event.page !== undefined && event.rows !== undefined) {
            this.filtro.page = event.page;
            this.filtro.size = event.rows;
            this.getData();
        }
    }

    guardar() {
        this.loading = true;
        if (this.categoria.nombre === undefined || this.categoria.nombre.trim() === '') {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre es obligatorio' });
            this.loading = false;
            return;
        }
        this.ordenesServicioCategoriasService.create(this.categoria).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada correctamente' });
                this.cerrarFormulario();
                this.getData();
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la categoría' });
            }
        });
    }

    update() {
        this.loading = true;
        if (this.categoria.id === undefined) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La categoría no es válida' });
            this.loading = false;
            return;
        }
        if (this.categoria.nombre === undefined || this.categoria.nombre.trim() === '') {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre es obligatorio' });
            this.loading = false;
            return;
        }
        this.ordenesServicioCategoriasService.update(this.categoria.id, this.categoria).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada correctamente' });
                this.cerrarFormulario();
                this.getData();
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la categoría' });
            }
        });
    }

    getCategoria(id: number) {
        this.loading = true;
        this.ordenesServicioCategoriasService.getById(id).subscribe({
            next: (data) => {
                this.categoria = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar la categoría' });
            }
        });
    }

    editar(categoria: OrdenServicioCategoria) {
        this.getCategoria(categoria.id!);
    }

    nuevo() {
        this.categoria = new OrdenServicioCategoria();
        this.displayFormulario = true;
    }

    cerrarFormulario() {
        this.displayFormulario = false;
        this.categoria = new OrdenServicioCategoria();
    }
}
