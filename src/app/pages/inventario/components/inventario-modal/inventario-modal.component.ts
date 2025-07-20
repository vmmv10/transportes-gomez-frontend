import { Component, Input } from '@angular/core';
import { SaldoBodegaFiltro } from '../../models/saldo-bodega-filtro.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InventarioComponent } from '../inventario/inventario.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-inventario-modal',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InventarioComponent,
    DialogModule
  ],
  templateUrl: './inventario-modal.component.html',
  styleUrl: './inventario-modal.component.scss'
})
export class InventarioModalComponent {
  @Input() filtro: SaldoBodegaFiltro = new SaldoBodegaFiltro();
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

}
