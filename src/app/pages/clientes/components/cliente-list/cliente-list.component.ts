import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { Page } from '../../../uikit/models/page.model';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { formatearRut } from '../../../uikit/utils/rut';
import { Cliente } from '../../models/cliente.model';
import { ClienteFiltro } from '../../models/cliente-filtro';
import { ClientesService } from '../../services/clientes.service';

@Component({
    standalone: true,
    selector: 'app-cliente-list',
    imports: [
        BreadcrumbModule,
        CommonModule,
        FormsModule,
        RouterModule,
        TableModule,
        PaginatorModule,
        TagModule,
        ButtonModule,
        InputTextModule,
        SelectButtonModule,
        ToastModule,
        TooltipModule,
        ConfirmDialogModule,
        ModalLoadingComponent,
        TableMobileComponent
    ],
    templateUrl: './cliente-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ClienteListComponent implements OnInit {
    loading: boolean = false;
    data: Page<Cliente> | undefined;
    filtro: ClienteFiltro = new ClienteFiltro();
    breadcrumb: MenuItem[] = [
        { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
        { label: 'Clientes', routerLink: '/clientes' }
    ];

    estados = [
        { label: 'Activos', value: true },
        { label: 'Inactivos', value: false }
    ];

    campos: any[] = [
        { etiqueta: 'Cliente', propiedad: 'razonSocial', tipo: 'texto' },
        { etiqueta: 'Rut', propiedad: 'rutFormateado', tipo: 'texto' },
        { etiqueta: 'Sector', propiedad: 'sectorTexto', tipo: 'texto' },
        { etiqueta: 'Comuna', propiedad: 'comuna.nombre', tipo: 'objeto' }
    ];

    acciones = [
        { tooltip: 'Editar', icono: 'pi pi-pencil', color: 'success', tipo: 'link', ruta: '/clientes/formulario/', rutaConId: true, label: 'Editar', outlined: true, mostrar: true },
        { tooltip: 'Activar / desactivar', icono: 'pi pi-power-off', color: 'danger', tipo: 'accion', accion: 'estado', label: 'Activar / desactivar', outlined: true, mostrar: true }
    ];

    constructor(
        private clientesService: ClientesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.getData();
    }

    /** Filas para la vista móvil, con los textos ya formateados. */
    filas: any[] = [];

    buscar() {
        this.filtro.page = 0;
        this.getData();
    }

    limpiarFiltros() {
        const activo = this.filtro.activo;
        this.filtro = new ClienteFiltro();
        this.filtro.activo = activo;
        this.getData();
    }

    getData() {
        this.loading = true;
        this.clientesService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.data = data;
                this.filas = (data?.content ?? []).map((c) => ({
                    ...c,
                    rutFormateado: formatearRut(c.rut),
                    sectorTexto: c.sector === 'PUBLICO' ? 'Público' : 'Privado'
                }));
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'Error al obtener clientes') });
                console.error('Error al obtener clientes:', error);
                this.loading = false;
            }
        });
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    formatearRut(rut: string): string {
        return formatearRut(rut);
    }

    confirmarCambioEstado(cliente: Cliente) {
        const desactivar = cliente.activo !== false;
        this.confirmationService.confirm({
            key: 'cCliente',
            header: desactivar ? 'Desactivar cliente' : 'Activar cliente',
            message: desactivar ? `¿Desactivar a ${cliente.razonSocial}? No aparecerá al crear ingresos, órdenes ni contratos.` : `¿Activar nuevamente a ${cliente.razonSocial}?`,
            accept: () => this.cambiarEstado(cliente, !desactivar)
        });
    }

    private cambiarEstado(cliente: Cliente, activar: boolean) {
        if (!cliente.id) {
            return;
        }
        this.loading = true;
        const peticion = activar ? this.clientesService.activar(cliente.id) : this.clientesService.desactivar(cliente.id);
        peticion.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: activar ? 'Cliente activado' : 'Cliente desactivado' });
                this.getData();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'No se pudo cambiar el estado del cliente') });
            }
        });
    }

    resolverAccion(event: { tipo: string; item: any }) {
        if (event.tipo === 'estado') {
            this.confirmarCambioEstado(event.item);
        }
    }
}
