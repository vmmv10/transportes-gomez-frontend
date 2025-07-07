import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { EntregasService } from '../../services/entregas.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';

@Component({
  selector: 'app-entregas-button-recepcion',
  imports: [ButtonModule, ConfirmDialogModule, ModalLoadingComponent],
  templateUrl: './entregas-button-recepcion.component.html',
  styleUrl: './entregas-button-recepcion.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class EntregasButtonRecepcionComponent {
  @Input() entregaId!: string;
  @Output() onRecepcionada = new EventEmitter<void>();
  loading: boolean = false;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private entregasService: EntregasService
  ) {}

  confirmarRecepcion() {
    this.confirmationService.confirm({
      header: 'Confirmar Recepción',
      key: 'cRecepcion',
      accept: () => {
        this.loading = true;
        this.entregasService.entregaRecepcionada(this.entregaId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Entrega recepcionada correctamente.' });
            this.loading = false;
            this.onRecepcionada.emit();
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo recepcionar la entrega.' });
            console.error('Error al recepcionar la entrega:', error);
          }
        });
      }
    });
  }
}
