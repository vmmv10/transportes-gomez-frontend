import { Component, Input } from '@angular/core';
import { Page } from '../../../uikit/models/page.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { EmergenciaIngreso } from '../../models/emergencia-ingreso.model';
import e from 'cors';
import { EmergenciaIngresoFiltro } from '../../models/emergencia-ingreso-filtro.model';
import { EmergenciasIngresosService } from '../../services/emergencias-ingresos.service';
import { FechaPipe } from '../../../uikit/pipe/fecha';

@Component({
  selector: 'app-ermergencias-ingresos-table',
  imports: [FormsModule, CommonModule, InputTextModule, RouterModule, PaginatorModule, TooltipModule, TableModule, ButtonModule, ModalLoadingComponent, TableMobileComponent, ToastModule, ConfirmDialogModule, FechaPipe],
  templateUrl: './ermergencias-ingresos-table.component.html',
  styleUrl: './ermergencias-ingresos-table.component.scss',
  standalone: true,
  providers: [MessageService, ConfirmationService]
})
export class ErmergenciasIngresosTableComponent {
  @Input() agregar: boolean = false;
  @Input() titulo: boolean = false;
  @Input() filtros: boolean = false;
  @Input() card: boolean = false;
  @Input() acciones: boolean = false;
  @Input() filtro: EmergenciaIngresoFiltro = new EmergenciaIngresoFiltro();
  loading: boolean = false;
  data!: Page<EmergenciaIngreso>;

  campos: any[] = [
      { etiqueta: 'Folio', propiedad: 'id', tipo: 'texto' },
      { etiqueta: 'Fecha', propiedad: 'fecha', tipo: 'fecha' },
      { etiqueta: 'Documento', propiedad: 'documento', tipo: 'objeto' },
      { etiqueta: 'Documento Tipo', propiedad: 'documentoTipo.nombre', tipo: 'objeto' }];

  accionesDevoluciones = [
      {
          tooltip: 'Editar',
          icono: 'pi pi-pencil',
          color: 'info',
          tipo: 'link',
          ruta: '/ingreso-emergencia/formulario/',
          rutaConId: true,
          label: 'Editar',
          outlined: true
      },
      {
          tooltip: 'Eliminar',
          icono: 'pi pi-trash',
          color: 'warn',
          tipo: 'accion',
          accion: 'eliminar',
          deshabilitarSi: 'asignado',
          label: 'Eliminar',
          outlined: true
      }
  ];

  constructor(
      private emergenciasIngresosService: EmergenciasIngresosService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
      this.getData();
  }

  getData() {
      this.loading = true;
      this.emergenciasIngresosService.getAll(this.filtro).subscribe({
          next: (data) => {
              this.data = data;
              this.loading = false;
          },
          error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los datos' });
              console.error('Error fetching:', error);
              this.loading = false;
          }
      });
  }

  resolverAccion(event: { tipo: string; item: any }) {
    switch (event.tipo) {
        case 'eliminar':
            this.confirmarEliminar(event.item);
            break;
    }
  }

  confirmarEliminar(item: EmergenciaIngreso) {
      this.confirmationService.confirm({
          message: '¿Desea eliminar el ingreso de emergencia ' + item.id + '?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          key: 'cEmergencia',
          accept: () => this.eliminar(item)
      });
  }

  eliminar(item: EmergenciaIngreso) {
      this.loading = true;
      this.emergenciasIngresosService.delete(item.id).subscribe({
          next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Eliminado correctamente' });
              this.loading = false;
              this.getData();
          },
          error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar' });
              console.error('Error deleting:', error);
              this.loading = false;
          }
      });
  }

  pageChange(event: any) {
      this.filtro.page = event.page;
      this.filtro.size = event.rows;
      this.getData();
  }
}
