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
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ComunaSelectComponent } from '../../../catalogos/components/comuna-select/comuna-select.component';
import { Comuna } from '../../../catalogos/models/comuna.model';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { Page } from '../../../uikit/models/page.model';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { Destino, DESTINO_TIPOS, destinoTipoIcono, destinoTipoLabel } from '../../models/destino.model';
import { DestinoFiltro } from '../../models/destino-filtro';
import { DestinosService } from '../../services/destinos.service';

@Component({
    standalone: true,
    selector: 'app-destino-list',
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
        SelectModule,
        SelectButtonModule,
        ToastModule,
        TooltipModule,
        ConfirmDialogModule,
        ModalLoadingComponent,
        TableMobileComponent,
        ComunaSelectComponent
    ],
    templateUrl: './destino-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class DestinoListComponent implements OnInit {
    loading: boolean = false;
    data: Page<Destino> | undefined;
    filas: any[] = [];
    filtro: DestinoFiltro = new DestinoFiltro();
    comuna: Comuna | undefined;
    tipos = DESTINO_TIPOS;
    breadcrumb: MenuItem[] = [
        { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
        { label: 'Destinos', routerLink: '/destinos' }
    ];
    estados = [
        { label: 'Activos', value: true },
        { label: 'Inactivos', value: false }
    ];

    campos: any[] = [
        { etiqueta: 'Destino', propiedad: 'nombre', tipo: 'texto' },
        { etiqueta: 'Tipo', propiedad: 'tipoTexto', tipo: 'texto' },
        { etiqueta: 'Comuna', propiedad: 'comuna.nombre', tipo: 'objeto' },
        { etiqueta: 'Dirección', propiedad: 'direccion', tipo: 'texto' }
    ];

    acciones = [
        { tooltip: 'Editar', icono: 'pi pi-pencil', color: 'success', tipo: 'link', ruta: '/destinos/formulario/', rutaConId: true, label: 'Ver / editar', outlined: true, mostrar: true },
        { tooltip: 'Activar / desactivar', icono: 'pi pi-power-off', color: 'danger', tipo: 'accion', accion: 'estado', label: 'Activar / desactivar', outlined: true, mostrar: true }
    ];

    constructor(
        private destinosService: DestinosService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.getData();
    }

    tipoLabel(tipo: string): string {
        return destinoTipoLabel(tipo);
    }

    tipoIcono(tipo: string): string {
        return destinoTipoIcono(tipo);
    }

    onComunaChange(comuna: Comuna | undefined) {
        this.comuna = comuna;
        this.filtro.comuna = comuna?.id;
        this.buscar();
    }

    buscar() {
        this.filtro.page = 0;
        this.getData();
    }

    limpiarFiltros() {
        const activo = this.filtro.activo;
        this.filtro = new DestinoFiltro();
        this.filtro.activo = activo;
        this.comuna = undefined;
        this.getData();
    }

    getData() {
        this.loading = true;
        this.destinosService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.data = data;
                this.filas = (data?.content ?? []).map((d) => ({ ...d, tipoTexto: destinoTipoLabel(d.tipo) }));
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'Error al obtener destinos') });
                console.error('Error al obtener destinos:', error);
                this.loading = false;
            }
        });
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    confirmarCambioEstado(destino: Destino) {
        const desactivar = destino.activo !== false;
        this.confirmationService.confirm({
            key: 'cDestino',
            header: desactivar ? 'Desactivar destino' : 'Activar destino',
            message: desactivar ? `¿Desactivar "${destino.nombre}"? No aparecerá al asignar bultos u órdenes.` : `¿Activar nuevamente "${destino.nombre}"?`,
            accept: () => this.cambiarEstado(destino, !desactivar)
        });
    }

    private cambiarEstado(destino: Destino, activar: boolean) {
        if (!destino.id) {
            return;
        }
        this.loading = true;
        const peticion = activar ? this.destinosService.activar(destino.id) : this.destinosService.desactivar(destino.id);
        peticion.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: activar ? 'Destino activado' : 'Destino desactivado' });
                this.getData();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'No se pudo cambiar el estado del destino') });
            }
        });
    }

    resolverAccion(event: { tipo: string; item: any }) {
        if (event.tipo === 'estado') {
            this.confirmarCambioEstado(event.item);
        }
    }
}
