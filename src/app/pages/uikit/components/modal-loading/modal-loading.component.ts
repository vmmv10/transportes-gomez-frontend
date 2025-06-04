import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  standalone: true,
  selector: 'app-modal-loading',
  imports: [CommonModule, DialogModule],
  templateUrl: './modal-loading.component.html',
  styleUrl: './modal-loading.component.scss'
})
export class ModalLoadingComponent {

  @Input() visible: boolean = false;
  @Input() texto: string = 'Cargando...';

  constructor() { }

}
