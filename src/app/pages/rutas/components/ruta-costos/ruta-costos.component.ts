import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ProveedorSelectComponent } from '../../../proveedor/components/proveedor-select/proveedor-select.component';
import { Proveedor } from '../../../proveedor/models/proveedor.model';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { fechaIsoALocal, fechaIsoATexto, fechaLocalAIso } from '../../../uikit/utils/fechas';
import { VehiculoSelectComponent } from '../../../vehiculos/components/vehiculo-select/vehiculo-select.component';
import { RutaCosto, TIPOS_COSTO, tipoCostoTexto } from '../../models/ruta-costo.model';
import { RutasCostosService } from '../../services/rutas-costos.service';

/** Costos de una ruta: combustible, peajes, cruces, arriendo de lancha, viáticos. */
@Component({
    standalone: true,
    selector: 'app-ruta-costos',
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, SelectModule, InputNumberModule, InputTextModule, DatePickerModule, TooltipModule, ToastModule, ConfirmDialogModule, ProveedorSelectComponent, VehiculoSelectComponent],
    templateUrl: './ruta-costos.component.html',
    providers: [MessageService, ConfirmationService]
})
export class RutaCostosComponent implements OnChanges {
    @Input() rutaId: number | undefined;
    /** yyyy-MM-dd; fecha por defecto de los costos nuevos */
    @Input() rutaFecha: string | undefined;
    @Input() kilometros: number | undefined | null;
    @Input() editable: boolean = true;
    @Output() totalChange = new EventEmitter<number>();

    costos: RutaCosto[] = [];
    cargando: boolean = false;
    guardando: boolean = false;
    dialogoVisible: boolean = false;
    intentoGuardar: boolean = false;
    costo: RutaCosto = new RutaCosto();
    fecha: Date | undefined;
    proveedor: Proveedor | undefined;
    tipos = TIPOS_COSTO;

    constructor(
        private rutasCostosService: RutasCostosService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['rutaId'] && this.rutaId) {
            this.cargar();
        }
    }

    get total(): number {
        return this.costos.reduce((s, c) => s + (c.monto ?? 0), 0);
    }

    get costoPorKm(): number | undefined {
        return this.kilometros && this.kilometros > 0 && this.total > 0 ? Math.round(this.total / this.kilometros) : undefined;
    }

    tipoTexto(tipo: string | undefined): string {
        return tipoCostoTexto(tipo);
    }

    icono(tipo: string | undefined): string {
        return TIPOS_COSTO.find((t) => t.value === tipo)?.icono ?? 'pi pi-circle';
    }

    fechaTexto(fecha: string | undefined): string {
        return fechaIsoATexto(fecha);
    }

    cargar() {
        if (!this.rutaId) {
            return;
        }
        this.cargando = true;
        this.rutasCostosService.listar(this.rutaId).subscribe({
            next: (costos) => {
                this.costos = costos;
                this.cargando = false;
                this.totalChange.emit(this.total);
            },
            error: (error) => {
                this.cargando = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'Error al obtener los costos de la ruta') });
            }
        });
    }

    nuevo() {
        this.costo = new RutaCosto();
        this.fecha = fechaIsoALocal(this.rutaFecha);
        this.proveedor = undefined;
        this.intentoGuardar = false;
        this.dialogoVisible = true;
    }

    editar(c: RutaCosto) {
        this.costo = { ...c };
        this.fecha = fechaIsoALocal(c.fecha);
        this.proveedor = c.proveedorId ? Object.assign(new Proveedor(), { id: c.proveedorId, nombre: c.proveedorNombre ?? '' }) : undefined;
        this.intentoGuardar = false;
        this.dialogoVisible = true;
    }

    guardar(otro: boolean) {
        this.intentoGuardar = true;
        if (!this.rutaId || !this.costo.tipo || !this.costo.monto || this.costo.monto <= 0) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Indica el tipo de costo y el monto' });
            return;
        }
        this.costo.fecha = fechaLocalAIso(this.fecha);
        this.costo.proveedorId = this.proveedor?.id || undefined;
        if (this.costo.tipo !== 'COMBUSTIBLE') {
            this.costo.litros = undefined;
        }
        this.guardando = true;
        const peticion = this.costo.id ? this.rutasCostosService.actualizar(this.rutaId, this.costo) : this.rutasCostosService.crear(this.rutaId, this.costo);
        peticion.subscribe({
            next: () => {
                this.guardando = false;
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Costo guardado' });
                this.cargar();
                if (otro) {
                    const tipo = this.costo.tipo;
                    this.nuevo();
                    this.costo.tipo = tipo;
                } else {
                    this.dialogoVisible = false;
                }
            },
            error: (error) => {
                this.guardando = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo guardar', detail: mensajeError(error, 'Error al guardar el costo'), life: 6000 });
            }
        });
    }

    confirmarEliminar(c: RutaCosto) {
        this.confirmationService.confirm({
            key: 'cCosto',
            header: 'Eliminar costo',
            message: `¿Eliminar ${this.tipoTexto(c.tipo).toLowerCase()} por $${(c.monto ?? 0).toLocaleString('es-CL')}?`,
            accept: () => this.eliminar(c)
        });
    }

    private eliminar(c: RutaCosto) {
        if (!this.rutaId || !c.id) {
            return;
        }
        this.rutasCostosService.eliminar(this.rutaId, c.id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Costo eliminado' });
                this.cargar();
            },
            error: (error) => this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'No se pudo eliminar el costo') })
        });
    }
}
