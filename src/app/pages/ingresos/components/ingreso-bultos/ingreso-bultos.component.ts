import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DestinoAutocompleteComponent } from '../../../destinos/components/destino-autocomplete/destino-autocomplete.component';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { Bulto, BULTO_ESTADOS } from '../../models/bulto.model';
import { BultosService } from '../../services/bultos.service';

/**
 * Bultos cerrados de un ingreso (cajas o pallets que llegan dirigidos a un destino),
 * con el N° de seguimiento del transportista o del cliente.
 * Usa el MessageService y ConfirmationService del formulario que lo contiene.
 */
@Component({
    standalone: true,
    selector: 'app-ingreso-bultos',
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, ConfirmDialogModule, DialogModule, InputNumberModule, InputTextModule, TableModule, TagModule, TooltipModule, DestinoAutocompleteComponent],
    templateUrl: './ingreso-bultos.component.html'
})
export class IngresoBultosComponent {
    @Input() folio: string | number | undefined;
    @Input() bultos: Bulto[] | null | undefined = [];
    @Output() bultosChange = new EventEmitter<Bulto[]>();
    /** Para buscar solo destinos del cliente del ingreso */
    @Input() clienteId: number | undefined;
    @Input() editable: boolean = true;

    dialogoVisible: boolean = false;
    bulto: Bulto = new Bulto();
    guardando: boolean = false;
    intentoGuardar: boolean = false;

    constructor(
        private bultosService: BultosService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    estadoTexto(bulto: Bulto): string {
        return BULTO_ESTADOS[bulto.estado]?.texto ?? bulto.estado;
    }

    estadoSeveridad(bulto: Bulto) {
        return BULTO_ESTADOS[bulto.estado]?.severidad ?? 'secondary';
    }

    /** Solo se edita o elimina mientras está en bodega y sin orden de servicio. */
    modificable(bulto: Bulto): boolean {
        return this.editable && bulto.estado === 'EN_BODEGA' && !bulto.ordenServicioId;
    }

    get sinDestino(): number {
        return (this.bultos ?? []).filter((b) => !b.destino).length;
    }

    nuevo() {
        this.bulto = new Bulto();
        this.intentoGuardar = false;
        this.dialogoVisible = true;
    }

    editar(bulto: Bulto) {
        this.bulto = Object.assign(new Bulto(), bulto);
        this.intentoGuardar = false;
        this.dialogoVisible = true;
    }

    guardar(seguirAgregando: boolean) {
        this.intentoGuardar = true;
        if (!this.folio || (!this.bulto.codigoExterno?.trim() && !this.bulto.descripcion?.trim())) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Ingresa el N° de seguimiento o una descripción del bulto.' });
            return;
        }
        this.guardando = true;
        const esNuevo = !this.bulto.id;
        const peticion = esNuevo ? this.bultosService.agregar(this.folio, this.bulto) : this.bultosService.actualizar(this.bulto);
        peticion.subscribe({
            next: (guardado) => {
                this.guardando = false;
                const lista = [...(this.bultos ?? [])];
                const i = lista.findIndex((b) => b.id === guardado.id);
                if (i >= 0) {
                    lista[i] = guardado;
                } else {
                    lista.push(guardado);
                }
                this.bultos = lista;
                this.bultosChange.emit(lista);
                this.messageService.add({ severity: 'success', summary: 'Bulto guardado', detail: guardado.codigoExterno || guardado.descripcion || undefined });
                if (esNuevo && seguirAgregando) {
                    // Mantiene el destino para cargar rápido varios bultos al mismo lugar
                    const destino = this.bulto.destino;
                    this.bulto = new Bulto();
                    this.bulto.destino = destino;
                    this.intentoGuardar = false;
                } else {
                    this.dialogoVisible = false;
                }
            },
            error: (error) => {
                this.guardando = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo guardar', detail: mensajeError(error, 'Error al guardar el bulto') });
            }
        });
    }

    eliminar(bulto: Bulto) {
        this.confirmationService.confirm({
            key: 'confirmDelete',
            message: `¿Eliminar el bulto ${bulto.codigoExterno || bulto.descripcion}?`,
            accept: () => {
                if (!bulto.id) {
                    return;
                }
                this.bultosService.eliminar(bulto.id).subscribe({
                    next: () => {
                        this.bultos = (this.bultos ?? []).filter((b) => b.id !== bulto.id);
                        this.bultosChange.emit(this.bultos);
                        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Bulto eliminado' });
                    },
                    error: (error) => {
                        this.messageService.add({ severity: 'error', summary: 'No se pudo eliminar', detail: mensajeError(error, 'Error al eliminar el bulto') });
                    }
                });
            }
        });
    }
}
