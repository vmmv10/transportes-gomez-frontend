import { Component, Input } from '@angular/core';
import { Page } from '../../../uikit/models/page.model';
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
import { InputTextModule } from 'primeng/inputtext';
import { FechaPipe } from '../../../uikit/pipe/fecha';
import { IngresoFiltro } from '../../models/ingreso-filtro.model';
import { Ingreso } from '../../models/ingreso.model';
import { IngresosService } from '../../services/ingresos.service';
import { ChipModule } from 'primeng/chip';

@Component({
    selector: 'app-ingresos-table',
    imports: [FormsModule, CommonModule, InputTextModule, ChipModule, RouterModule, PaginatorModule, TooltipModule, TableModule, ButtonModule, ModalLoadingComponent, TableMobileComponent, ToastModule, ConfirmDialogModule, FechaPipe],
    templateUrl: './ingresos-table.component.html',
    styleUrl: './ingresos-table.component.scss',
    standalone: true,
    providers: [MessageService, ConfirmationService]
})
export class IngresosTableComponent {
    @Input() agregar: boolean = false;
    @Input() titulo: boolean = false;
    @Input() filtros: boolean = false;
    @Input() card: boolean = false;
    @Input() acciones: boolean = false;
    @Input() filtro: IngresoFiltro = new IngresoFiltro();
    loading: boolean = false;
    data!: Page<Ingreso>;

    campos: any[] = [
        { etiqueta: 'Folio', propiedad: 'id', tipo: 'texto' },
        { etiqueta: 'Fecha', propiedad: 'fecha', tipo: 'fecha' },
        { etiqueta: 'Documento', propiedad: 'documento', tipo: 'objeto' },
        { etiqueta: 'Documento Tipo', propiedad: 'documentoTipo.nombre', tipo: 'objeto' }
    ];

    accionesDevoluciones = [
        {
            tooltip: 'Editar',
            icono: 'pi pi-pencil',
            color: 'info',
            tipo: 'link',
            ruta: '/ingresos/formulario/',
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
        private ingresosService: IngresosService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.loading = true;
        this.ingresosService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.data = data;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los datos' });
                console.error('Error fetching:', error);
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

    confirmarEliminar(item: Ingreso) {
        this.confirmationService.confirm({
            message: '¿Desea eliminar el ingreso?' + item.id + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            key: 'cIngreso',
            accept: () => this.eliminar(item)
        });
    }

    eliminar(item: Ingreso) {
        this.loading = true;
        this.ingresosService.delete(item.id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Eliminado correctamente' });
                this.loading = false;
                this.getData();
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar' });
                console.error('Error deleting:', error);
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
