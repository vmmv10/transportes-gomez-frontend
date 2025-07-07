import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ProveedorFiltro } from '../../models/proveedor-filtro';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { CommonModule } from '@angular/common';
import { ProveedoresService } from '../../services/proveedores.service';
import { Page } from '../../../uikit/models/page.model';
import { Proveedor } from '../../models/proveedor.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  standalone: true,
  selector: 'app-proveedor-list',
  imports: [BreadcrumbModule, CommonModule, TableMobileComponent, PaginatorModule, TableModule, TagModule, ButtonModule, FormsModule, InputTextModule, RouterModule, ToastModule, TooltipModule, ModalLoadingComponent, ConfirmDialogModule],
  templateUrl: './proveedor-list.component.html',
  styleUrl: './proveedor-list.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class ProveedorListComponent {
    loading: boolean = false;
    data!: Page<Proveedor>;
    filtro: ProveedorFiltro = new ProveedorFiltro();
    breadcrumb: MenuItem[] = [];

    campos: any[] = [
        { etiqueta: 'Nombre', propiedad: 'nombre', tipo: 'text' },
        { etiqueta: 'Rut', propiedad: 'rut', tipo: 'text' },
        { etiqueta: 'Dirección', propiedad: 'direccion', tipo: 'text' },
        { etiqueta: 'Email', propiedad: 'email', tipo: 'text' },
    ];

    acciones = [
        {
            tooltip: 'Editar',
            icono: 'pi pi-pencil',
            color: 'success',
            tipo: 'link',
            ruta: '/proveedores/formulario/',
            rutaConId: true,
            label: 'Editar Proveedor',
            outlined: true
        },
        {
            tooltip: 'Eliminar',
            icono: 'pi pi-trash',
            color: 'danger',
            tipo: 'accion',
            accion: 'eliminar',
            rutaConId: true,
            label: 'Elimimar',
            outlined: true
        },
    ];

    constructor(
        private messageService: MessageService,
        private proveedorServices: ProveedoresService,
        private confirmationService: ConfirmationService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Proveedores', routerLink: '/proveedores' }
        ];
    }

    ngOnInit() {
        this.getData();
    }

    getData(){
      this.filtro.activo = true;
      this.loading = true;
        this.proveedorServices.getAll(this.filtro).subscribe({
            next: (data) => {
             this.data = data;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener proveedores' });
                console.error('Error fetching proveedores:', error);
                this.loading = false;
            }
        });

    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    confirmarDesactivacion(proveedor: Proveedor) {
        this.confirmationService.confirm({
            message: `¿Está seguro de desactivar el proveedor ${proveedor.nombre}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            key: 'cProveedor',
            accept: () => {
                this.proveedorServices.desactivateProveedor(proveedor.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proveedor desactivado correctamente' });
                        this.getData();
                    },
                    error: (error) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al desactivar proveedor' });
                        console.error('Error desactivating proveedor:', error);
                    }
                });
            }
        });
    }

    resolverAccion(event: { tipo: string; item: any }) {
    switch (event.tipo) {
        case 'eliminar':
            this.confirmarDesactivacion(event.item);
            break;
    }
  }
    
}
