import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { Destino, destinoTipoIcono } from '../../models/destino.model';
import { DestinoFiltro } from '../../models/destino-filtro';
import { DestinosService } from '../../services/destinos.service';

/** Busca destinos activos por nombre o dirección (hay cientos, por eso no es un select). */
@Component({
    standalone: true,
    selector: 'app-destino-autocomplete',
    imports: [CommonModule, FormsModule, AutoCompleteModule],
    templateUrl: './destino-autocomplete.component.html'
})
export class DestinoAutocompleteComponent {
    @Input() destino: Destino | undefined | null;
    @Output() destinoChange = new EventEmitter<Destino | undefined>();
    /** Si viene, solo busca destinos de ese cliente. */
    @Input() clienteId: number | undefined;
    @Input() validar: boolean = false;
    @Input() disabled: boolean = false;
    @Input() placeholder: string = 'Buscar destino por nombre o dirección';

    sugerencias: Destino[] = [];

    constructor(private destinosService: DestinosService) {}

    icono(destino: Destino): string {
        return destinoTipoIcono(destino.tipo);
    }

    buscar(event: AutoCompleteCompleteEvent) {
        const filtro = new DestinoFiltro();
        filtro.nombre = event.query;
        filtro.cliente = this.clienteId;
        filtro.activo = true;
        filtro.size = 15;
        this.destinosService.getAll(filtro).subscribe({
            next: (page) => (this.sugerencias = page?.content ?? []),
            error: (error) => {
                console.error('Error al buscar destinos:', error);
                this.sugerencias = [];
            }
        });
    }

    onChange(valor: Destino | string | undefined | null) {
        // Mientras se escribe, el modelo es texto: solo se emite un destino real o la limpieza
        if (valor && typeof valor === 'object') {
            this.destino = valor;
            this.destinoChange.emit(valor);
        } else if (!valor) {
            this.destino = undefined;
            this.destinoChange.emit(undefined);
        }
    }
}
