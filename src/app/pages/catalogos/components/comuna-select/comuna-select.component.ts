import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Comuna } from '../../models/comuna.model';
import { CatalogosService } from '../../services/catalogos.service';

@Component({
    standalone: true,
    selector: 'app-comuna-select',
    imports: [SelectModule, FormsModule, CommonModule, SkeletonModule],
    templateUrl: './comuna-select.component.html'
})
export class ComunaSelectComponent implements OnInit {
    @Input() comuna: Comuna | undefined | null;
    @Output() comunaChange = new EventEmitter<Comuna | undefined>();
    @Input() showClear: boolean = true;
    @Input() validar: boolean = false;
    @Input() disabled: boolean = false;
    @Input() placeholder: string = 'Selecciona comuna';

    comunas: Comuna[] = [];
    loading: boolean = true;
    error: boolean = false;

    constructor(private catalogosService: CatalogosService) {}

    ngOnInit(): void {
        this.catalogosService.getComunas().subscribe({
            next: (comunas) => {
                this.comunas = comunas;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al obtener comunas:', error);
                this.error = true;
                this.loading = false;
            }
        });
    }

    onChangeSelect(comuna: Comuna | undefined) {
        this.comuna = comuna;
        this.comunaChange.emit(comuna ?? undefined);
    }
}
