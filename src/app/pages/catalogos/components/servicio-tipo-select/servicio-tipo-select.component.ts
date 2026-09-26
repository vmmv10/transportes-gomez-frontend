import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { ServicioTipo } from '../../models/servicio-tipo.model';
import { CatalogosService } from '../../services/catalogos.service';

@Component({
    standalone: true,
    selector: 'app-servicio-tipo-select',
    imports: [SelectModule, FormsModule, CommonModule, SkeletonModule],
    templateUrl: './servicio-tipo-select.component.html'
})
export class ServicioTipoSelectComponent implements OnInit {
    @Input() servicioTipo: ServicioTipo | undefined | null;
    @Output() servicioTipoChange = new EventEmitter<ServicioTipo | undefined>();
    @Input() showClear: boolean = false;
    @Input() validar: boolean = false;
    @Input() disabled: boolean = false;
    /** Si viene, se selecciona este código cuando no hay un tipo elegido (ej. CARGA_TER). */
    @Input() codigoPorDefecto: string | undefined;

    tipos: ServicioTipo[] = [];
    loading: boolean = true;
    error: boolean = false;

    constructor(private catalogosService: CatalogosService) {}

    ngOnInit(): void {
        this.catalogosService.getServiciosTipos().subscribe({
            next: (tipos) => {
                this.tipos = tipos.filter((t) => t.activo !== false);
                this.loading = false;
                if (!this.servicioTipo && this.codigoPorDefecto) {
                    const porDefecto = this.tipos.find((t) => t.codigo === this.codigoPorDefecto);
                    if (porDefecto) {
                        // Se emite después del ciclo de detección actual para no modificar el padre durante el chequeo
                        setTimeout(() => this.onChangeSelect(porDefecto));
                    }
                }
            },
            error: (error) => {
                console.error('Error al obtener tipos de servicio:', error);
                this.error = true;
                this.loading = false;
            }
        });
    }

    icono(tipo: ServicioTipo): string {
        if (tipo.categoria === 'ALMACENAJE') {
            return 'pi pi-warehouse';
        }
        if (tipo.categoria === 'PASAJEROS') {
            return 'pi pi-users';
        }
        return tipo.modalidad === 'MARITIMO' ? 'pi pi-compass' : 'pi pi-truck';
    }

    onChangeSelect(tipo: ServicioTipo | undefined) {
        this.servicioTipo = tipo;
        this.servicioTipoChange.emit(tipo ?? undefined);
    }
}
