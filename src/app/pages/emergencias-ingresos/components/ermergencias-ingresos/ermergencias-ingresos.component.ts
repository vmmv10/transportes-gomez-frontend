import { Component } from '@angular/core';
import { EmergenciaIngresoFiltro } from '../../models/emergencia-ingreso-filtro.model';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CommonModule } from '@angular/common';
import { ErmergenciasIngresosTableComponent } from '../ermergencias-ingresos-table/ermergencias-ingresos-table.component';

@Component({
  selector: 'app-ermergencias-ingresos',
  imports: [BreadcrumbModule, CommonModule, ErmergenciasIngresosTableComponent],
  templateUrl: './ermergencias-ingresos.component.html',
  styleUrl: './ermergencias-ingresos.component.scss'
})
export class ErmergenciasIngresosComponent {
  filtro: EmergenciaIngresoFiltro = new EmergenciaIngresoFiltro();
  breadcrumb: MenuItem[] = [];
  
  constructor(
  ) {
      this.breadcrumb = [
          { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
          { label: 'Ingreso Emergencia', routerLink: '/ingreso-emergencia' }
      ];
  }
}
