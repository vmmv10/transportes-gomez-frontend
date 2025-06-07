import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Proveedor } from '../../models/proveedor.model';
import { MessageService } from 'primeng/api';
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
    standalone: true,
    selector: 'app-proveedor-select',
    imports: [SelectModule, FormsModule, CommonModule, SkeletonModule],
    templateUrl: './proveedor-select.component.html',
    styleUrl: './proveedor-select.component.scss'
})
export class ProveedorSelectComponent {
    @Input() proveedor: Proveedor = new Proveedor();
    @Output() proveedorChange = new EventEmitter<Proveedor>();
    @Input() showClear: boolean = false;
    @Input() validar: boolean = false;
    @Input() showFilter: boolean = false;

    proveedores: Proveedor[] = [];
    loading: boolean = true;

    constructor(
        private proveedorServices: ProveedoresService,
        private messageService: MessageService
    ) {}

    async ngOnInit(): Promise<void> {
        this.loading = true;
        await this.getData();
        this.loading = false;
        console.log('Proveedores:', this.proveedores);
        console.log('Proveedor:', this.proveedor);
    }

    async getData() {
        try {
            this.loading = true;
            const proveedores = await this.proveedorServices.getProveedores().toPromise();
            this.proveedores = proveedores || [];
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener proveedores' });
            console.error('Error fetching proveedores:', error);
        } finally {
            this.loading = false;
        }
    }

    onChangeSelect(proveedor: Proveedor) {
        this.proveedorChange.emit(proveedor);
    }
}
