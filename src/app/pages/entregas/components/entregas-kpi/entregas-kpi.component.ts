import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-entregas-kpi',
  imports: [CommonModule, CardModule],
  templateUrl: './entregas-kpi.component.html',
  styleUrl: './entregas-kpi.component.scss'
})
export class EntregasKpiComponent {
  loading: boolean = false;

  constructor() {}
}
