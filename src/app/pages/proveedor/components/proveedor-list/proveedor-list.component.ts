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
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProveedorSelectComponent } from '../proveedor-select/proveedor-select.component';
import { mensajeError } from '../../../uikit/utils/error-mensaje';

@Component({
    standalone: true,
    selector: 'app-proveedor-list',
    imports: [
        BreadcrumbModule,
        CommonModule,
        TableMobileComponent,
        PaginatorModule,
        TableModule,
        TagModule,
        ButtonModule,
        FormsModule,
        InputTextModule,
        RouterModule,
        ToastModule,
        TooltipModule,
        ModalLoadingComponent,
        ConfirmDialogModule,
        DialogModule,
        SelectButtonModule,
        ProveedorSelectComponent
    ],
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
        { etiqueta: 'Email', propiedad: 'email', tipo: 'text' }
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
            outlined: true,
            mostrar: true
        },
        {
            tooltip: 'Unir con otro',
            icono: 'pi pi-link',
            color: 'info',
            tipo: 'accion',
            accion: 'unir',
            rutaConId: true,
            label: 'Unir',
            outlined: true,
            mostrar: true
        },
        {
            tooltip: 'Activar',
            icono: 'pi pi-replay',
            color: 'info',
            tipo: 'accion',
            accion: 'activar',
            rutaConId: true,
            label: 'Activar',
            outlined: true,
            mostrar: false
        },
        {
            tooltip: 'Eliminar',
            icono: 'pi pi-trash',
            color: 'danger',
            tipo: 'accion',
            accion: 'eliminar',
            rutaConId: true,
            label: 'Eliminar',
            outlined: true,
            mostrar: true
        }
    ];

    estados = [
        { label: 'Activos', value: true },
        { label: 'Inactivos', value: false }
    ];

    // ---- Unir proveedores duplicados ----
    dialogoUnir: boolean = false;
    proveedorOrigen: Proveedor | undefined;
    proveedorDestino: Proveedor | undefined;

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

    getData() {
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

    abrirUnir(proveedor: Proveedor) {
        this.proveedorOrigen = proveedor;
        this.proveedorDestino = undefined;
        this.dialogoUnir = true;
    }

    unir() {
        const origen = this.proveedorOrigen;
        const destino = this.proveedorDestino;
        if (!origen || !destino) {
            this.messageService.add({ severity: 'warn', summary: 'Falta el proveedor', detail: 'Elige con qué proveedor se une.' });
            return;
        }
        if (origen.id === destino.id) {
            this.messageService.add({ severity: 'warn', summary: 'Mismo proveedor', detail: 'Elige un proveedor distinto.' });
            return;
        }
        this.loading = true;
        this.proveedorServices.fusionar(origen.id, destino.id).subscribe({
            next: () => {
                this.dialogoUnir = false;
                this.messageService.add({ severity: 'success', summary: 'Proveedores unidos', detail: `${origen.nombre} quedó unido a ${destino.nombre}` });
                this.getData();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo unir', detail: mensajeError(error, 'Error al unir los proveedores') });
            }
        });
    }

    buscar() {
        this.filtro.page = 0;
        // En móvil: "Activar" solo en la vista de inactivos, "Eliminar" solo en la de activos
        this.acciones.forEach((a) => {
            if (a.accion === 'activar') a.mostrar = this.filtro.activo === false;
            if (a.accion === 'eliminar') a.mostrar = this.filtro.activo !== false;
        });
        this.getData();
    }

    activar(proveedor: Proveedor) {
        this.loading = true;
        this.proveedorServices.activarProveedor(proveedor.id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: `${proveedor.nombre} activado` });
                this.getData();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'No se pudo activar el proveedor') });
            }
        });
    }

    resolverAccion(event: { tipo: string; item: any }) {
        switch (event.tipo) {
            case 'eliminar':
                this.confirmarDesactivacion(event.item);
                break;
            case 'activar':
                this.activar(event.item);
                break;
            case 'unir':
                this.abrirUnir(event.item);
                break;
        }
    }
}
