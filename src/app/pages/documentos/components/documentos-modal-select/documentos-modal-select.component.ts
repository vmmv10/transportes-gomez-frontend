import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Documento } from '../../models/documento.model';
import { Page } from '../../../uikit/models/page.model';
import { DocumentoFiltro } from '../../models/documento-filtro.model';
import { DocumentosService } from '../../services/documentos.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DocumentosTipoSelectComponent } from '../documentos-tipo-select/documentos-tipo-select.component';
import { ProveedorSelectComponent } from '../../../proveedor/components/proveedor-select/proveedor-select.component';
import { EscuelasSelectComponent } from '../../../escuelas/components/escuelas-select/escuelas-select.component';
import { Escuela } from '../../../escuelas/models/escuela.models';
import { Proveedor } from '../../../proveedor/models/proveedor.model';

@Component({
    standalone: true,
    selector: 'app-documentos-modal-select',
    imports: [CommonModule, DialogModule, ButtonModule, TableModule, InputNumberModule, InputTextModule, FormsModule, DocumentosTipoSelectComponent, ProveedorSelectComponent, EscuelasSelectComponent],
    templateUrl: './documentos-modal-select.component.html',
    styleUrl: './documentos-modal-select.component.scss',
    providers: [MessageService]
})
export class DocumentosModalSelectComponent {
    @Input() documento: Documento | undefined;
    @Output() documentoChange = new EventEmitter<Documento>();
    visible: boolean = false;
    documentos!: Page<Documento>;
    filtro: DocumentoFiltro = new DocumentoFiltro();
    loading: boolean = true;

    constructor(
        private documentosService: DocumentosService,
        private MessageService: MessageService
    ) {}

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.loading = true;
        this.documentosService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.documentos = data;
                this.loading = false;
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los Documentos' });
                this.loading = false;
                console.error('Error fetching documentos:', error);
            }
        });
    }

    showDialog() {
        this.visible = true;
    }

    escuelaChange(escuela: Escuela) {
        this.filtro.escuela = escuela;
        this.getData();
    }

    proveedorChange(proveedor: Proveedor) {
        if (proveedor) {
            this.filtro.proveedor = proveedor;
            this.getData();
        }
    }

    documentoTipoChange(documentoTipo: any) {
        if (documentoTipo) {
            this.filtro.tipo = documentoTipo;
            this.getData();
        }
    }

    onDocumentoSelect(documento: Documento) {
        this.documento = documento;
        this.documentoChange.emit(this.documento);
        this.visible = false;
    }
}
