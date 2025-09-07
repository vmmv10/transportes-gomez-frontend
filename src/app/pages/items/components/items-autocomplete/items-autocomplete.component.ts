import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessageService } from 'primeng/api';
import { ItemFiltro } from '../../models/item-filtro.model';
import { Item } from '../../models/item.model';
import { ItemsService } from '../../services/items.service';


@Component({
  selector: 'app-items-autocomplete',
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  templateUrl: './items-autocomplete.component.html',
  styleUrl: './items-autocomplete.component.scss',
  providers: [MessageService],
  standalone: true
})
export class ItemsAutocompleteComponent {
    @Input() filtro: ItemFiltro = new ItemFiltro();
    @Output() selected = new EventEmitter<Item>();
    data: Item[] = [];
    loading: boolean = false;
    item: Item | undefined;

    constructor(
        private MessageService: MessageService,
        private itemSService: ItemsService
    ) {}

    getData() {
        this.loading = true;
        this.itemSService.getAll(this.filtro).subscribe({
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

    limpiar() {
        this.item = undefined;
        this.selected.emit(this.item);
        this.filtro.nombre = '';
        this.data = [];
    }
}
