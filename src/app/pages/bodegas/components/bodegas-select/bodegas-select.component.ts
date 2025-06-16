import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Bodega } from '../../models/Bodega.model';
import { MessageService } from 'primeng/api';
import { BodegasService } from '../../services/bodegas.service';

@Component({
    selector: 'app-bodegas-select',
    imports: [SelectModule, FormsModule, CommonModule, SkeletonModule],
    templateUrl: './bodegas-select.component.html',
    styleUrl: './bodegas-select.component.scss',
    providers: [MessageService]
})
export class BodegasSelectComponent {
    @Input() bodega: Bodega = new Bodega();
    @Output() bodegaChange = new EventEmitter<Bodega>();
    @Input() showClear: boolean = false;
    @Input() validar: boolean = false;
    @Input() showFilter: boolean = false;

    bodegas: Bodega[] = [];
    loading: boolean = true;

    constructor(
        private bodegasServices: BodegasService,
        private messageService: MessageService
    ) {}

    async ngOnInit(): Promise<void> {
        this.loading = true;
        await this.getData();
        this.loading = false;
    }

    async getData() {
        try {
            this.loading = true;
            const bodegas = await this.bodegasServices.getBodegas().toPromise();
            this.bodegas = bodegas || [];
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener Bodegas' });
            console.error('Error fetching bodegas:', error);
        } finally {
            this.loading = false;
        }
    }

    onChangeSelect(bodega: Bodega) {
        this.bodegaChange.emit(bodega);
    }
}
