import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { OrdenServicio } from '../../models/orden-servicio.model';
import { Page } from '../../../uikit/models/page.model';
import { OrdenServicioFiltro } from '../../models/orden-servicio-filtro.model';
import { OrdenesServiciosService } from '../../services/ordenes-servicios.service';
import { TagModule } from 'primeng/tag';
import { FechaHoraPipe } from '../../../uikit/pipe/fecha-hora';
import { Escuela } from '../../../escuelas/models/escuela.models';
import { DocumentosTipoSelectComponent } from '../../../documentos/components/documentos-tipo-select/documentos-tipo-select.component';
import { EscuelasSelectComponent } from '../../../escuelas/components/escuelas-select/escuelas-select.component';
import { ToastModule } from 'primeng/toast';

@Component({
    standalone: true,
    selector: 'app-ordenes-servicios-modal-select',
    imports: [CommonModule, ToastModule, DialogModule, ButtonModule, TableModule, InputNumberModule, InputTextModule, FormsModule, TagModule, FechaHoraPipe, DocumentosTipoSelectComponent, EscuelasSelectComponent],
    templateUrl: './ordenes-servicios-modal-select.component.html',
    styleUrl: './ordenes-servicios-modal-select.component.scss',
    providers: [MessageService]
})
export class OrdenesServiciosModalSelectComponent {
    @Input() enRuta: boolean = false;
    @Input() ordenServicio: OrdenServicio | undefined;
    @Input() ordenesServiciosSeleccionados: OrdenServicio[] = [];
    @Output() ordenesServiciosSeleccionadosChange = new EventEmitter<OrdenServicio[]>();
    @Output() ordenesServiciosChange = new EventEmitter<OrdenServicio>();
    visible: boolean = false;
    ordenesServicios!: Page<OrdenServicio>;
    filtro: OrdenServicioFiltro = new OrdenServicioFiltro();
    loading: boolean = true;

    constructor(
        private ordenesServiciosService: OrdenesServiciosService,
        private MessageService: MessageService
    ) {}

    ngOnInit() {
        this.filtro.enRuta = this.enRuta;
        this.getData();
    }

    getData() {
        this.loading = true;
        this.ordenesServiciosService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.ordenesServicios = data;
                this.loading = false;
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los Documentos' });
                this.loading = false;
                console.error('Error fetching ordenes servicios:', error);
            }
        });
    }

    showDialog() {
        this.visible = true;
    }

    documentoTipoChange(documentoTipo: any) {
        if (documentoTipo) {
            this.filtro.documentoTipo = documentoTipo;
            this.getData();
        }
    }

    onDocumentoSelect(ordenServicio: OrdenServicio[]) {
        this.ordenesServiciosSeleccionados = ordenServicio;
        this.ordenesServiciosSeleccionadosChange.emit(this.ordenesServiciosSeleccionados);
        this.visible = false;
    }

    escuelaChange(escuela: Escuela) {
        this.filtro.escuela = escuela;
        this.getData();
    }

    hideDialog() {
        this.visible = false;
        this.ordenesServiciosSeleccionados = [];
        this.ordenesServiciosSeleccionadosChange.emit(this.ordenesServiciosSeleccionados);
    }

    sendSelectedOrdenesServicios() {
        if (this.ordenesServiciosSeleccionados.length > 0) {
            this.ordenesServiciosSeleccionadosChange.emit(this.ordenesServiciosSeleccionados);
        } else {
            return this.MessageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar al menos una orden de servicio.' });
        }
        this.visible = false;
    }
}
