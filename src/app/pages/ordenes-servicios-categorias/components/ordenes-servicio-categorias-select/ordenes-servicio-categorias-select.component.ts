import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { OrdenServicioCategoria } from '../../model/orden-servicio-categoria.model';
import { OrdenesServicioCategoriasService } from '../../services/ordenes-servicio-categorias.service';

@Component({
    selector: 'app-ordenes-servicio-categorias-select',
    imports: [FormsModule, CommonModule, SelectModule, SkeletonModule],
    templateUrl: './ordenes-servicio-categorias-select.component.html',
    styleUrl: './ordenes-servicio-categorias-select.component.scss',
    standalone: true,
    providers: [MessageService]
})
export class OrdenesServicioCategoriasSelectComponent {
    @Input() categoria: OrdenServicioCategoria | undefined;
    @Output() categoriaChange = new EventEmitter<OrdenServicioCategoria>();
    @Input() showClear: boolean = false;
    @Input() validar: boolean = false;
    @Input() showFilter: boolean = false;

    categorias: OrdenServicioCategoria[] = [];
    loading: boolean = true;

    constructor(
        private categoriasServices: OrdenesServicioCategoriasService,
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
            const categorias = await this.categoriasServices.getAllList().toPromise();
            this.categorias = categorias || [];
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener categorias' });
            console.error('Error fetching categorias:', error);
        } finally {
            this.loading = false;
        }
    }

    onChangeSelect(categoria: OrdenServicioCategoria) {
        this.categoriaChange.emit(categoria);
    }
}
