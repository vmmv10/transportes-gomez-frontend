import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'select-boolean',
    imports: [SelectModule, FormsModule, CommonModule],
    templateUrl: './select-boolean.component.html',
    styleUrl: './select-boolean.component.scss'
})
export class SelectBooleanComponent {
    @Input() variable: boolean | undefined;
    @Output() variableChange = new EventEmitter<boolean>();
    @Input() showClear: boolean = false;
    @Input() validar: boolean = false;
    @Input() showFilter: boolean = false;

    @Input() opciones: { label: string; value: boolean }[] = [
        { label: 'Si', value: true },
        { label: 'No', value: false }
    ];

    constructor() {}

    onChangeSelect(event: any) {
        this.variable = event;
        this.variableChange.emit(event);
    }
}
