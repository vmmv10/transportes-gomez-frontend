import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Contrato } from '../../models/contrato.model';
import { ContratosService } from '../../services/contratos.service';

/** Contratos vigentes del cliente elegido. */
@Component({
    standalone: true,
    selector: 'app-contrato-select',
    imports: [SelectModule, FormsModule, CommonModule, SkeletonModule],
    templateUrl: './contrato-select.component.html'
})
export class ContratoSelectComponent implements OnChanges {
    @Input() contrato: Contrato | undefined | null;
    @Output() contratoChange = new EventEmitter<Contrato | undefined>();
    @Input() clienteId: number | undefined;
    @Input() disabled: boolean = false;
    /** Si el cliente tiene un solo contrato vigente y no hay uno elegido, se selecciona solo. */
    @Input() autoSeleccionarUnico: boolean = false;

    contratos: Contrato[] = [];
    loading: boolean = false;
    private clienteCargado: number | undefined | null = null;

    constructor(private contratosService: ContratosService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['clienteId'] && this.clienteId !== this.clienteCargado) {
            this.cargar();
        } else if (changes['contrato']) {
            this.incluirSeleccionado();
        }
    }

    private cargar() {
        this.clienteCargado = this.clienteId;
        this.contratos = [];
        if (!this.clienteId) {
            return;
        }
        this.loading = true;
        const clienteId = this.clienteId;
        this.contratosService.getVigentes(clienteId).subscribe({
            next: (contratos) => {
                if (clienteId !== this.clienteId) {
                    return; // llegó tarde: ya se cambió de cliente
                }
                this.contratos = contratos;
                this.incluirSeleccionado();
                this.loading = false;
                if (this.autoSeleccionarUnico && !this.contrato && this.contratos.length === 1) {
                    setTimeout(() => this.onChangeSelect(this.contratos[0]));
                }
            },
            error: (error) => {
                console.error('Error al obtener contratos vigentes:', error);
                this.loading = false;
            }
        });
    }

    /** El contrato ya asignado (aunque haya vencido) igual debe verse. */
    private incluirSeleccionado() {
        if (this.contrato?.id && !this.contratos.some((c) => c.id === this.contrato!.id)) {
            this.contratos = [this.contrato as Contrato, ...this.contratos];
        }
    }

    onChangeSelect(contrato: Contrato | undefined) {
        this.contrato = contrato;
        this.contratoChange.emit(contrato ?? undefined);
    }
}
