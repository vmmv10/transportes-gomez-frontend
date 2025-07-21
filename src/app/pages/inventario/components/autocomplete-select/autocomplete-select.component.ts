import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SaldoBodegaFiltro } from '../../models/saldo-bodega-filtro.model';
import { SaldoBodega } from '../../models/saldo-bodega.model';
import { MessageService } from 'primeng/api';
import { SaldoBodegaService } from '../../services/saldo-bodega.service';

@Component({
    selector: 'app-autocomplete-select',
    imports: [CommonModule, FormsModule, AutoCompleteModule],
    templateUrl: './autocomplete-select.component.html',
    styleUrl: './autocomplete-select.component.scss',
    providers: [MessageService],
    standalone: true
})
export class AutocompleteSelectComponent {
    @Input() filtro: SaldoBodegaFiltro = new SaldoBodegaFiltro();
    @Output() selected = new EventEmitter<SaldoBodega>();
    data: SaldoBodega[] = [];
    loading: boolean = false;
    @Input() saldo: SaldoBodega | undefined;

    constructor(
        private MessageService: MessageService,
        private saldoBodegaService: SaldoBodegaService
    ) {}

    getData() {
        this.loading = true;
        this.saldoBodegaService.getSaldoBodega(this.filtro).subscribe({
            next: (data) => {
                this.data = data.content;
                this.loading = false;
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el inventario.' });
                this.loading = false;
            }
        });
    }

    search(event: any) {
        this.filtro.nombre = event.query;
        this.getData();
    }

    seleccionado(item: any) {
        this.selected.emit(item.value);
    }
}
