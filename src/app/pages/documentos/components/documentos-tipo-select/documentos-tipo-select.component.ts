import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { DocumentoTipo } from '../../models/documento-tipo.model';
import { MessageService } from 'primeng/api';
import { DocumentosTiposService } from '../../services/documentos-tipos.service';

@Component({
    standalone: true,
    selector: 'app-documentos-tipo-select',
    imports: [SelectModule, FormsModule, CommonModule, SkeletonModule],
    templateUrl: './documentos-tipo-select.component.html',
    styleUrl: './documentos-tipo-select.component.scss',
    providers: [MessageService]
})
export class DocumentosTipoSelectComponent {
    @Input() documentoTipo: DocumentoTipo | undefined = undefined;
    @Output() documentoTipoChange = new EventEmitter<DocumentoTipo>();
    @Input() showClear: boolean = false;
    @Input() validar: boolean = false;
    @Input() showFilter: boolean = false;

    documentosTipos: DocumentoTipo[] = [];
    loading: boolean = true;

    constructor(
        private messageService: MessageService,
        private documentosTiposService: DocumentosTiposService
    ) {}

    async ngOnInit(): Promise<void> {
        this.loading = true;
        await this.getData();
        this.loading = false;
        console.log('Proveedores:', this.documentosTipos);
        console.log('DocumentoTipo:', this.documentoTipo);
    }

    async getData() {
        try {
            this.loading = true;
            const documentosTipos = await this.documentosTiposService.getTiposDocumentos().toPromise();
            this.documentosTipos = documentosTipos || [];
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener documentosTipos' });
            console.error('Error fetching documentosTipos:', error);
        } finally {
            this.loading = false;
        }
    }

    onChangeSelect(documentoTipo: DocumentoTipo) {
        this.documentoTipoChange.emit(documentoTipo);
    }
}
