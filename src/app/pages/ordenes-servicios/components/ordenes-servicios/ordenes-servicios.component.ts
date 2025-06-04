import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { OrdenServicio } from '../../models/orden-servicio.model';
import { Page } from '../../../uikit/models/page.model';
import { OrdenServicioFiltro } from '../../models/orden-servicio-filtro.model';
import { OrdenesServiciosService } from '../../services/ordenes-servicios.service';

@Component({
  standalone: true,
  selector: 'app-ordenes-servicios',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    BreadcrumbModule,
    RouterModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './ordenes-servicios.component.html',
  styleUrl: './ordenes-servicios.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class OrdenesServiciosComponent {

  ordenes!: Page<OrdenServicio>;
  orden: OrdenServicio | undefined;
  tok: string = '';
  filtro: OrdenServicioFiltro = new OrdenServicioFiltro();
  breadcrumb: MenuItem[] = [];
  loading: boolean = true;
  visible: boolean = false;

  constructor(
    private ordenesServiciosService: OrdenesServiciosService,
    private MessageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.breadcrumb = [
      { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
      { label: 'Ordenes de Servicio', routerLink: '/ordenes-servicios' },
    ];
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.ordenesServiciosService.getAll(this.filtro).subscribe({
      next: (data) => {
        this.ordenes = data;
        this.loading = false;
      },
      error: (error) => {
        this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener Items' });
        this.loading = false;
        console.error('Error fetching ordenes:', error);
      }
    });
  }

  eliminar(orden: OrdenServicio) {
    this.loading = true;
    this.ordenesServiciosService.delete(orden.id.toString()).subscribe({
      next: () => {
        this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'OrdenServicio eliminado correctamente' });
        this.loading = false;
        this.getData();
      },
      error: (error) => {
        this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el orden' });
        console.error('Error deleting orden:', error);
        this.loading = false;
      }
    });
  }

  async editar(orden: OrdenServicio) {
  }

  confirmarEliminar(orden: OrdenServicio) {
    this.confirmationService.confirm({
      message: '¿Desea eliminar el orden ' + orden.id + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminar(orden),
    });
  }

}
