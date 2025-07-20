import { Component, Input } from '@angular/core';
import { Page } from '../../../uikit/models/page.model';
import { DevolucionesService } from '../../services/devoluciones.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { Devolucion } from '../../models/devolucion.model';
import { InputTextModule } from 'primeng/inputtext';
import { FechaPipe } from '../../../uikit/pipe/fecha';

@Component({
    selector: 'app-devoluciones-table',
    imports: [FormsModule, FechaPipe, CommonModule, InputTextModule, RouterModule, PaginatorModule, TooltipModule, TableModule, ButtonModule, ModalLoadingComponent, TableMobileComponent, ToastModule, ConfirmDialogModule],
    templateUrl: './devoluciones-table.component.html',
    styleUrl: './devoluciones-table.component.scss',
    standalone: true,
    providers: [MessageService, ConfirmationService]
})
export class DevolucionesTableComponent {
    @Input() agregar: boolean = false;
    @Input() titulo: boolean = false;
    @Input() filtros: boolean = false;
    @Input() card: boolean = false;
    @Input() acciones: boolean = false;
    @Input() filtro: any = {};
    loading: boolean = false;
    data!: Page<any>;

    campos: any[] = [
        { etiqueta: 'Folio', propiedad: 'id', tipo: 'texto' },
        { etiqueta: 'Fecha', propiedad: 'fecha', tipo: 'fecha' },
        { etiqueta: 'Escuela', propiedad: 'escuela.nombre', tipo: 'objeto' },
        { etiqueta: 'Comuna', propiedad: 'escuela.comuna', tipo: 'objeto' },
        { etiqueta: 'Orden Servicio', propiedad: 'ordenServicio.id', tipo: 'objeto' },
    ];

    accionesDevoluciones = [
        {
            tooltip: 'Editar',
            icono: 'pi pi-pencil',
            color: 'info',
            tipo: 'link',
            ruta: '/devoluciones/formulario/',
            rutaConId: true,
            label: 'Editar',
            outlined: true
        },
        {
            tooltip: 'Eliminar',
            icono: 'pi pi-trash',
            color: 'warn',
            tipo: 'accion',
            accion: 'eliminar',
            deshabilitarSi: 'asignado',
            label: 'Eliminar',
            outlined: true
        }
    ];

    constructor(
        private devolucionesService: DevolucionesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.filtro.activo = true;
        this.loading = true;
        this.devolucionesService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.data = data;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener devoluciones' });
                console.error('Error fetching devoluciones:', error);
                this.loading = false;
            }
        });
    }

    resolverAccion(event: { tipo: string; item: any }) {
        switch (event.tipo) {
            case 'eliminar':
                this.confirmarEliminar(event.item);
                break;
        }
    }

   confirmarEliminar(item: Devolucion) {
        this.confirmationService.confirm({
            message: '¿Desea eliminar el documento ' + item.id + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            key: 'eliminarDoc',
            accept: () => this.eliminar(item)
        });
    }

    eliminar(item: Devolucion) {
        this.loading = true;
        this.devolucionesService.delete(item.id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Documento eliminado correctamente' });
                this.loading = false;
                this.getData();
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar documento' });
                console.error('Error deleting documento:', error);
                this.loading = false;
            }
        });
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }
}
