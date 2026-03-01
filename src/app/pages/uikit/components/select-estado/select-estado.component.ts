import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-select-estado',
    imports: [SelectModule, FormsModule, CommonModule],
    templateUrl: './select-estado.component.html',
    styleUrl: './select-estado.component.scss'
})
export class SelectEstadoComponent {
    @Input() variable: number | undefined;
    @Output() variableChange = new EventEmitter<boolean>();
    @Input() showClear: boolean = false;
    @Input() validar: boolean = false;
    @Input() showFilter: boolean = false;

    @Input() opciones: { label: string; value: number }[] = [
        { label: 'Temporal', value: 0 },
        { label: 'Abierto', value: 1 },
        { label: 'Cerrado', value: 2 },
        { label: 'En Revisión', value: 3 },
        { label: 'Habilitar', value: 4 }
    ];

    constructor() {}

    onChangeSelect(event: any) {
        this.variable = event;
        this.variableChange.emit(event);
    }
}
