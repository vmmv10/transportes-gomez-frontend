import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { Page } from '../../../uikit/models/page.model';
import { TagModule } from 'primeng/tag';
import { Entrega } from '../../models/entrega.models';
import { EntregaFiltro } from '../../models/entrega-filtro.models';
import { EntregasService } from '../../services/entregas.service';
import { SelectBooleanComponent } from '../../../uikit/components/select-boolean/select-boolean.component';
import { PaginatorModule } from 'primeng/paginator';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { EscuelasSelectComponent } from '../../../escuelas/components/escuelas-select/escuelas-select.component';
import { OrdenesServiciosImagenComponent } from '../../../ordenes-servicios/components/ordenes-servicios-imagen/ordenes-servicios-imagen.component';
import { OrdenesServiciosService } from '../../../ordenes-servicios/services/ordenes-servicios.service';
import { DialogModule } from 'primeng/dialog';
import { EntregasButtonRecepcionComponent } from '../entregas-button-recepcion/entregas-button-recepcion.component';
import { RolService } from '../../../uikit/services/rol.service';
import { Observable } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-entregas-table',
    imports: [
        CommonModule,
        ButtonModule,
        TableMobileComponent,
        PaginatorModule,
        SelectBooleanComponent,
        TableModule,
        TagModule,
        ButtonModule,
        FormsModule,
        InputTextModule,
        RouterModule,
        ToastModule,
        TooltipModule,
        ModalLoadingComponent,
        EscuelasSelectComponent,
        OrdenesServiciosImagenComponent,
        DialogModule,
        EntregasButtonRecepcionComponent
    ],
    templateUrl: './entregas-table.component.html',
    styleUrl: './entregas-table.component.scss',
    providers: [MessageService]
})
export class EntregasTableComponent {
    @Input() filtro: EntregaFiltro = new EntregaFiltro();
    @Input() filtros: boolean = true;
    @Input() ruta: boolean = false;
    @Input() proveedor: boolean = false;
    @Input() documento: boolean = false;
    @Input() escuela: boolean = false;
    @Input() escuelaFiltro: boolean = false;
    @Input() orden: boolean = false;
    @Input() estado: boolean = false;
    @Input() card: boolean = true;
    @Input() dashboard: boolean = false;
    @Input() categoria: boolean = false;
    @Input() categoriaFiltro: boolean = false;
    @Input() oc: boolean = false;
    @Input() ocFiltro: boolean = false;
    entregas!: Page<Entrega>;
    entrega: Entrega | undefined;
    tok: string = '';
    loading: boolean = false;
    mostrarImagenes: boolean = false;
    ordenId: string = '';
    displayEntregas: boolean = false;
    esAdmin$!: Observable<boolean>;
    esConductor$!: Observable<boolean>;

    opcionesSelectBoolean: { label: string; value: boolean }[] = [
        { label: 'Entregado', value: true },
        { label: 'No Entregado', value: false }
    ];

    campos: any[] = [
        { etiqueta: 'Orden de Servicio', propiedad: 'ordenServicio.id', tipo: 'objeto' },
        { etiqueta: 'Escuela', propiedad: 'ordenServicio.escuela.nombre', tipo: 'objeto' },
        { etiqueta: 'Comuna', propiedad: 'ordenServicio.escuela.comuna', tipo: 'objeto' },
        { etiqueta: 'Estado', propiedad: 'entregado', tipo: 'tag' }
    ];

    acciones = [
        {
            tooltip: 'Ver Ruta',
            icono: 'pi pi-eye',
            color: 'success',
            tipo: 'link',
            ruta: '/rutas/formulario/',
            rutaConId: true,
            label: 'Ver Ruta',
            outlined: true,
            mostrar: true
        }
    ];

    constructor(
        private entregasService: EntregasService,
        private MessageService: MessageService,
        private ordenesServiciosService: OrdenesServiciosService,
        private rolService: RolService
    ) {}

    ngOnInit() {
        this.esAdmin$ = this.rolService.tieneRol('Administrador');
        this.getData();
    }

    ngOnChanges(): void {
        if (this.dashboard) {
            this.getData();
        }
    }

    getData() {
        this.loading = true;
        this.entregasService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.entregas = data;
                this.loading = false;
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las Entregas' });
                this.loading = false;
                console.error('Error fetching entregas:', error);
            }
        });
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    cerrarModalImagen() {
        this.mostrarImagenes = false;
    }

    abrirModalImagen(id: string) {
        this.mostrarImagenes = true;
        this.ordenId = id;
    }

    obtenerPdf(id: string) {
        this.loading = true;
        this.ordenesServiciosService.generarPdf(id).subscribe({
            next: (data) => {
                const blob = new Blob([data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `OrdenServicio_${id}.pdf`;
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

    openModalEntrega(index: number) {
        this.displayEntregas = true;
        this.entrega = this.entregas.content[index];
    }

    closeModalEntrega() {
        this.displayEntregas = false;
        this.entrega = undefined;
        this.MessageService.add({ severity: 'info', summary: 'Entrega Realizada', detail: 'La entrega ha sido marcada como realizada.' });
        this.filtro.page = 0;
        this.getData();
    }

    descargarExcel() {
        this.loading = true;

        this.entregasService.descargarExcel(this.filtro).subscribe({
            next: (data: Blob) => {
                const blob = new Blob([data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                const url = window.URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'Entregas.xlsx';
                document.body.appendChild(a);
                a.click();

                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                this.loading = false;
            },
            error: () => {
                this.MessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al descargar el Excel'
                });
                this.loading = false;
            }
        });
    }
}
