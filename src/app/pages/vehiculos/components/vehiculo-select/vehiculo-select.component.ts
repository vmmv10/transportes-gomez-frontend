import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Vehiculo, VehiculoTipo, tipoVehiculoIcono, tipoVehiculoTexto } from '../../models/vehiculo.model';
import { VehiculosService } from '../../services/vehiculos.service';

/** Vehículos activos. Vacío = "Sin vehículo". */
@Component({
    standalone: true,
    selector: 'app-vehiculo-select',
    imports: [SelectModule, FormsModule, CommonModule, SkeletonModule],
    templateUrl: './vehiculo-select.component.html'
})
export class VehiculoSelectComponent implements OnInit, OnChanges {
    /** Se acepta un vehículo o solo su id */
    @Input() vehiculo: Vehiculo | undefined | null;
    @Output() vehiculoChange = new EventEmitter<Vehiculo | undefined>();
    @Input() vehiculoId: number | undefined | null;
    @Output() vehiculoIdChange = new EventEmitter<number | undefined>();
    @Input() tipo: VehiculoTipo | undefined;
    @Input() disabled: boolean = false;
    @Input() placeholder: string = 'Sin vehículo';

    vehiculos: Vehiculo[] = [];
    seleccionado: Vehiculo | undefined;
    loading: boolean = true;

    constructor(private vehiculosService: VehiculosService) {}

    ngOnInit(): void {
        this.vehiculosService.getActivos(this.tipo).subscribe({
            next: (vehiculos) => {
                this.vehiculos = vehiculos;
                this.sincronizar();
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al obtener vehículos:', error);
                this.loading = false;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes['vehiculo'] || changes['vehiculoId']) && !this.loading) {
            this.sincronizar();
        }
    }

    /** El vehículo ya asignado (aunque esté inactivo) igual debe verse. */
    private sincronizar() {
        const id = this.vehiculo?.id ?? this.vehiculoId;
        if (!id) {
            this.seleccionado = undefined;
            return;
        }
        let v = this.vehiculos.find((x) => x.id === id);
        if (!v && this.vehiculo?.id) {
            v = this.vehiculo;
            this.vehiculos = [v, ...this.vehiculos];
        }
        this.seleccionado = v;
    }

    tipoTexto(v: Vehiculo): string {
        return tipoVehiculoTexto(v.tipo);
    }

    icono(v: Vehiculo): string {
        return tipoVehiculoIcono(v.tipo);
    }

    onChangeSelect(vehiculo: Vehiculo | undefined | null) {
        this.seleccionado = vehiculo ?? undefined;
        this.vehiculoChange.emit(vehiculo ?? undefined);
        this.vehiculoIdChange.emit(vehiculo?.id ?? undefined);
    }
}
