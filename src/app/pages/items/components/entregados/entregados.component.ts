import { Component } from '@angular/core';
import { OrdenesServiciosItemsComponent } from '../../../ordenes-servicios/components/ordenes-servicios-items/ordenes-servicios-items.component';

@Component({
  selector: 'app-entregados',
  imports: [
    OrdenesServiciosItemsComponent
  ],
  templateUrl: './entregados.component.html',
  styleUrl: './entregados.component.scss',
  standalone: true
})
export class EntregadosComponent {

}
