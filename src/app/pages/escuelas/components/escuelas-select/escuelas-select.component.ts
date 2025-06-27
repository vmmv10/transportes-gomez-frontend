import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Escuela } from '../../models/escuela.models';
import { EscuelasService } from '../../services/escuelas.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-escuelas-select',
    imports: [SelectModule, FormsModule, CommonModule, SkeletonModule],
    templateUrl: './escuelas-select.component.html',
    styleUrl: './escuelas-select.component.scss'
})
export class EscuelasSelectComponent {
    @Input() escuela: Escuela | undefined;
    @Output() escuelaChange = new EventEmitter<Escuela>();
    @Input() showClear: boolean = false;
    @Input() validar: boolean = false;
    @Input() showFilter: boolean = false;

    escuelas: Escuela[] = [];
    loading: boolean = true;

    constructor(
        private escuelasServices: EscuelasService,
        private messageService: MessageService
    ) {
        this.getData();
    }

    getData() {
        this.loading = true;
        this.escuelasServices.getEscuelasList().subscribe({
            next: (escuelas) => {
                this.escuelas = escuelas;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las escuelas' });
                console.error('Error fetching escuelas:', error);
                this.loading = false;
            }
        });
    }

    onChangeSelect(unidad: Escuela) {
        this.escuela = unidad;
        this.escuelaChange.emit(unidad);
    }
}
