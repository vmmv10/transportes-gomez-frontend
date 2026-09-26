import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { Cliente } from '../../models/cliente.model';
import { ClientesService } from '../../services/clientes.service';

@Component({
    standalone: true,
    selector: 'app-cliente-select',
    imports: [SelectModule, FormsModule, CommonModule, SkeletonModule],
    templateUrl: './cliente-select.component.html'
})
export class ClienteSelectComponent implements OnInit, OnChanges {
    @Input() cliente: Cliente | undefined | null;
    @Output() clienteChange = new EventEmitter<Cliente | undefined>();
    @Input() showClear: boolean = false;
    @Input() validar: boolean = false;
    @Input() disabled: boolean = false;
    /** Si hay un solo cliente activo y no hay uno elegido, se selecciona solo. */
    @Input() autoSeleccionarUnico: boolean = false;
    @Input() placeholder: string = 'Selecciona cliente';

    clientes: Cliente[] = [];
    loading: boolean = true;
    error: boolean = false;

    constructor(private clientesService: ClientesService) {}

    ngOnInit(): void {
        this.clientesService.getList().subscribe({
            next: (clientes) => {
                this.clientes = clientes;
                this.incluirSeleccionado();
                this.loading = false;
                if (this.autoSeleccionarUnico && !this.cliente && this.clientes.length === 1) {
                    setTimeout(() => this.onChangeSelect(this.clientes[0]));
                }
            },
            error: (error) => {
                console.error('Error al obtener clientes:', error);
                this.error = true;
                this.loading = false;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cliente'] && !this.loading) {
            this.incluirSeleccionado();
        }
    }

    /** Un cliente inactivo ya asignado (ej. en una orden antigua) igual debe verse en la lista. */
    private incluirSeleccionado() {
        if (this.cliente?.id && !this.clientes.some((c) => c.id === this.cliente!.id)) {
            this.clientes = [this.cliente as Cliente, ...this.clientes];
        }
    }

    etiqueta(cliente: Cliente): string {
        return cliente.nombreCorto || cliente.razonSocial;
    }

    onChangeSelect(cliente: Cliente | undefined) {
        this.cliente = cliente;
        this.clienteChange.emit(cliente ?? undefined);
    }
}
