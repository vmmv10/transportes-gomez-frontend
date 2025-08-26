import { Component, Input } from '@angular/core';
import { OrdenesServiciosService } from '../../services/ordenes-servicios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { FechaHoraPipe } from '../../../uikit/pipe/fecha-hora';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { OrdenServicioFiltro } from '../../models/orden-servicio-filtro.model';
import { OrdenServicio } from '../../models/orden-servicio.model';
import { Page } from '../../../uikit/models/page.model';
import { PaginatorModule } from 'primeng/paginator';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { EscuelasSelectComponent } from '../../../escuelas/components/escuelas-select/escuelas-select.component';
import { SelectBooleanComponent } from '../../../uikit/components/select-boolean/select-boolean.component';

@Component({
    selector: 'app-ordenes-servicios-table',
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        FormsModule,
        InputTextModule,
        RouterModule,
        ToastModule,
        TooltipModule,
        ModalLoadingComponent,
        FechaHoraPipe,
        TagModule,
        ConfirmDialogModule,
        PaginatorModule,
        TableMobileComponent,
        EscuelasSelectComponent,
        SelectBooleanComponent
    ],
    templateUrl: './ordenes-servicios-table.component.html',
    styleUrl: './ordenes-servicios-table.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class OrdenesServiciosTableComponent {
    @Input() filtro: OrdenServicioFiltro = new OrdenServicioFiltro();
    @Input() filtros: boolean = true;
    ordenes!: Page<OrdenServicio>;
    orden: OrdenServicio | undefined;
    loading: boolean = true;

    opcionesSelectBoolean: { label: string; value: boolean }[] = [
        { label: 'Entregado', value: true },
        { label: 'No Entregado', value: false }
    ];

    campos: any[] = [
        { etiqueta: 'Número', propiedad: 'id', tipo: 'texto' },
        { etiqueta: 'Fecha', propiedad: 'fecha', tipo: 'fecha' },
        { etiqueta: 'Escuela', propiedad: 'escuela.nombre', tipo: 'objeto' },
        { etiqueta: 'Estado', propiedad: 'entregado', tipo: 'tag' }
    ];

    acciones = [
        {
            tooltip: 'Editar',
            icono: 'pi pi-pencil',
            color: 'info',
            tipo: 'link',
            ruta: '/ordenes-servicios/formulario/',
            rutaConId: true,
            label: 'Editar',
            outlined: true,
            mostrar: true
        },
        {
            tooltip: 'Eliminar',
            icono: 'pi pi-trash',
            color: 'warn',
            tipo: 'accion',
            accion: 'eliminar',
            deshabilitarSi: 'entregado',
            label: 'Eliminar',
            outlined: true,
            mostrar: true
        },
        {
            tooltip: 'Ver PDF',
            icono: 'pi pi-file-pdf',
            color: 'danger',
            tipo: 'accion',
            accion: 'verPdf',
            label: ' PDF',
            outlined: true,
            mostrar: true
        }
    ];

    constructor(
        private ordenesServiciosService: OrdenesServiciosService,
        private MessageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.loading = true;
        this.ordenesServiciosService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.ordenes = data;
                this.loading = false;
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener Items' });
                this.loading = false;
                console.error('Error fetching ordenes:', error);
            }
        });
    }

    eliminar(orden: OrdenServicio) {
        this.loading = true;
        this.ordenesServiciosService.delete(orden.id.toString()).subscribe({
            next: () => {
                this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'OrdenServicio eliminado correctamente' });
                this.loading = false;
                this.getData();
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el orden' });
                console.error('Error deleting orden:', error);
                this.loading = false;
            }
        });
    }

    confirmarEliminar(orden: OrdenServicio) {
        this.confirmationService.confirm({
            message: '¿Desea eliminar el orden ' + orden.id + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            key: 'eliminarOs',
            accept: () => this.eliminar(orden)
        });
    }

    obtenerPdf(orden: OrdenServicio) {
        this.loading = true;
        this.ordenesServiciosService.generarPdf(orden.id.toString()).subscribe({
            next: (data) => {
                const blob = new Blob([data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `OrdenServicio_${orden.id}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
                this.loading = false;
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el PDF' });
                console.error('Error fetching PDF:', error);
                this.loading = false;
            }
        });
    }

    resolverAccion(event: { tipo: string; item: any }) {
        switch (event.tipo) {
            case 'eliminar':
                this.confirmarEliminar(event.item);
                break;
            case 'verPdf':
                this.obtenerPdf(event.item);
                break;
        }
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }
}
