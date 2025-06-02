import { Component } from '@angular/core';
import { Entrega } from '../../models/entrega.model';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-entregas',
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, RippleModule],
  templateUrl: './entregas.component.html',
})
export class EntregasComponent {

  entregas: Entrega[] = [];

  constructor(
  ) { }

  ngOnInit() {
  }

}
