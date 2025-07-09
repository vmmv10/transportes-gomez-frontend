import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { OrdenesServiciosModalSelectComponent } from '../../../ordenes-servicios/components/ordenes-servicios-modal-select/ordenes-servicios-modal-select.component';
import { OrdenServicio } from '../../../ordenes-servicios/models/orden-servicio.model';
import { TableModule } from 'primeng/table';
import { Devolucion } from '../../models/devolucion.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FocusTrapModule } from 'primeng/focustrap';
import { AutoFocusModule } from 'primeng/autofocus';
import { DevolucionesService } from '../../services/devoluciones.service';
import { ButtonModule } from 'primeng/button';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-devoluciones-formulario',
  imports: [BreadcrumbModule, ButtonModule, FormsModule, AutoFocusModule, FocusTrapModule, CommonModule, ToastModule, OrdenesServiciosModalSelectComponent, TableModule, InputNumberModule, InputTextModule, ModalLoadingComponent],
  templateUrl: './devoluciones-formulario.component.html',
  styleUrl: './devoluciones-formulario.component.scss',
  standalone: true,
  providers: [MessageService, ConfirmationService]
})
export class DevolucionesFormularioComponent {
    breadcrumb: MenuItem[] = [];
    ordenesServicio: OrdenServicio[] = [];
    devolucion: Devolucion = new Devolucion();
    articuloBuscar: string = '';
    focusArticulo: boolean = false;
    loading: boolean = false;
    
    constructor(
      private route: ActivatedRoute,
      private devolucionService: DevolucionesService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Devoluciones', routerLink: '/devoluciones' }
        ];
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.breadcrumb.push({ label: 'Editar Devolución', routerLink: `/devoluciones/formulario/${id}` });
        } else {
            this.breadcrumb.push({ label: 'Nueva Devolución', routerLink: '/devoluciones/formulario' });
        }
    }

    comenzar() {
      this.loading = true;
      this.devolucionService.crear(this.devolucion).subscribe({
          next: (devolucion) => {
              this.devolucion = devolucion;
              this.loading = false;
              this.focusArticulo = true;
          },
          error: (error) => {
              console.error('Error al crear devolución:', error);
              this.loading = false;
          }
      });
    }

    ordenesServiciosSeleccionadosChange(event: any) {
        this.ordenesServicio = event;
        if (this.ordenesServicio.length > 0) {
          this.focusArticulo = true;
          this.devolucion.ordenServicio = this.ordenesServicio[0];
          if (this.ordenesServicio[0].escuela) {
            this.devolucion.escuela = this.ordenesServicio[0].escuela;
          }
        }
    }

    buscarArticulo() {
        if (this.articuloBuscar.trim() === '') {
            return;
        }
        this.loading = true;
        this.devolucionService.agregarDetalle(this.devolucion.id, this.articuloBuscar).subscribe({
            next: (detalle) => {
                this.devolucion.detalles.push(detalle);
                this.articuloBuscar = '';
                this.loading = false;
                this.focusArticulo = true;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Detalle agregado correctamente'
                });
            },
            error: (error) => {
                this.loading = false;
                console.error('Error al agregar detalle:', error);
            }
        });
    }
}
