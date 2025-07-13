import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-modal-cantidad',
  imports: [FormsModule, InputNumberModule, CommonModule, DialogModule, ButtonModule, AutoFocusModule],
  templateUrl: './modal-cantidad.component.html',
  styleUrl: './modal-cantidad.component.scss',
  standalone: true,
  providers: [MessageService]
})
export class ModalCantidadComponent {

  cantidad: number = 0;
  @Output() cantidadChange = new EventEmitter<number>();
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() decimal: boolean = false;
  @Input() cantidadDecimales: number = 2;
  focus: boolean = true;

  constructor(private messageService: MessageService) {}

  ngOnChanges() {
    if (this.visible) {
      this.cantidad = 0; 
      this.focus = true;
    } else {
      this.focus = false;
    }
  }

  cerrarModal() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  guardar() {
    if (this.cantidad <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La cantidad debe ser mayor a cero.' });
      return;
    }
    this.cantidadChange.emit(this.cantidad);
    this.cerrarModal();
  }
 
}
