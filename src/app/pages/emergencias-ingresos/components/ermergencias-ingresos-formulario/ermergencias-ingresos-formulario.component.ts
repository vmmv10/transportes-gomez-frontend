import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { OrdenesServiciosModalSelectComponent } from '../../../ordenes-servicios/components/ordenes-servicios-modal-select/ordenes-servicios-modal-select.component';
import { OrdenServicio } from '../../../ordenes-servicios/models/orden-servicio.model';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FocusTrapModule } from 'primeng/focustrap';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { ToastModule } from 'primeng/toast';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { BadgeModule } from 'primeng/badge';
import { ModalCantidadComponent } from '../../../uikit/components/modal-cantidad/modal-cantidad.component';
import { EmergenciaIngreso } from '../../models/emergencia-ingreso.model';
import { EmergenciaIngresosDetalle } from '../../models/emergencia-ingresos-detalle.model';
import { EmergenciasIngresosService } from '../../services/emergencias-ingresos.service';
import { DocumentosTipoSelectComponent } from '../../../documentos/components/documentos-tipo-select/documentos-tipo-select.component';


@Component({
  selector: 'app-ermergencias-ingresos-formulario',
  imports: [BreadcrumbModule, DocumentosTipoSelectComponent, ModalCantidadComponent, BadgeModule, ButtonModule, ButtonGroupModule, FormsModule, AutoFocusModule, FocusTrapModule, CommonModule, ToastModule, TableModule, InputNumberModule, InputTextModule, ModalLoadingComponent],
  templateUrl: './ermergencias-ingresos-formulario.component.html',
  styleUrl: './ermergencias-ingresos-formulario.component.scss',
  standalone: true,
  providers: [MessageService, ConfirmationService]
})
export class ErmergenciasIngresosFormularioComponent {
    breadcrumb: MenuItem[] = [];
    ordenesServicio: OrdenServicio[] = [];
    ingreso: EmergenciaIngreso = new EmergenciaIngreso();
    articuloBuscar: string = '';
    focusArticulo: boolean = false;
    loading: boolean = false;
    modoUnidad: boolean = true;
    modalCantidadVisible: boolean = false;
    detalleSeleccionado: EmergenciaIngresosDetalle | undefined;
    modificarCantidad: boolean = false;
    validar: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private emergenciasIngresosServices: EmergenciasIngresosService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Ingresos Emergencias', routerLink: '/ingreso-emergencia' }
        ];
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.get(id);
            this.breadcrumb.push({ label: 'Ingreso ' + id, routerLink: `/ingreso-emergencia/formulario/${id}` });
        } else {
            this.breadcrumb.push({ label: 'Nuevo Ingreso', routerLink: '/ingreso-emergencia/formulario' });
        }
    }

    comenzar() {
      this.validar = true;
      if (!this.ingreso.documento || !this.ingreso.documentoTipo) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe ingresar un documento y tipo de documento antes de comenzar'
            });
            return;
        }
        this.validar = false;
        this.loading = true;
        this.emergenciasIngresosServices.crear(this.ingreso).subscribe({
            next: (ingreso) => {
                this.ingreso = ingreso;
                this.loading = false;
                this.focusArticulo = true;
            },
            error: (error) => {
                console.error('Error al crear:', error);
                this.loading = false;
            }
        });
    }

    buscarArticulo() {
        if (this.articuloBuscar.trim() === '') {
            return;
        }
        let existeDetalle = false;
        if (this.ingreso && this.ingreso.detalles) {
            this.ingreso.detalles.forEach((detalle) => {
                if (detalle.item.codigo === this.articuloBuscar) {
                    existeDetalle = true;
                    if (this.modoUnidad) {
                        this.loading = true;
                        this.sumarCantidadDetalle(detalle, 1);
                        this.loading = false;
                    } else {
                        this.detalleSeleccionado = detalle;
                        this.modificarCantidad = false;
                        this.modalCantidadVisible = true;
                        this.focusArticulo = false;
                    }
                    return;
                }
            });
        }
        if (existeDetalle) {
            this.articuloBuscar = '';
            this.focusArticulo = true;
            return;
        }
        this.emergenciasIngresosServices.agregarDetalle(this.ingreso.id, this.articuloBuscar).subscribe({
            next: (detalle) => {
                this.ingreso.detalles.push(detalle);
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

    get(id: string) {
        this.loading = true;
        this.emergenciasIngresosServices.getById(id).subscribe({
            next: (ingreso) => {
                this.ingreso = ingreso;
                this.loading = false;
                this.focusArticulo = true;
            },
            error: (error) => {
                console.error('Error al obtener:', error);
                this.loading = false;
            }
        });
    }

    async sumarCantidadDetalle(detalle: any, cantidad: number) {
        try {
            await this.emergenciasIngresosServices.sumarCantidadDetalle(detalle.id, { cantidad }).toPromise();
            this.ingreso.detalles.forEach((d) => {
                if (d.id === detalle.id) {
                    d.cantidad += cantidad;
                }
            });
            this.focusArticulo = true;
            this.articuloBuscar = '';
            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: `Cantidad actualizada a ${detalle.cantidad}`
            });
        } catch (error) {
            this.loading = false;
            console.error('Error al sumar cantidad de detalle:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar la cantidad del detalle'
            });
        }
    }

    modoChange() {
        this.focusArticulo = false;
        this.modoUnidad = !this.modoUnidad;
        if (this.modoUnidad) {
            this.messageService.add({
                severity: 'info',
                summary: 'Modo Manual',
                detail: 'Ahora puedes agregar artículos unidad'
            });
        } else {
            this.messageService.add({
                severity: 'info',
                summary: 'Modo Unidad',
                detail: 'Ahora puedes agregar artículos por manualmente'
            });
        }
        this.focusArticulo = true;
    }

    abrir() {
        this.loading = true;
        this.emergenciasIngresosServices.abrir(this.ingreso.id).subscribe({
            next: (ingreso) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Actualizado correctamente'
                });
                this.ngOnInit();
            },
            error: (error) => {
                console.error('Error al abrir:', error);
                this.loading = false;
            }
        });
    }

    cerrar() {
        this.loading = true;
        this.emergenciasIngresosServices.cerrar(this.ingreso.id).subscribe({
            next: (ingreso) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Devolución cerrada correctamente'
                });
                this.ngOnInit();
            },
            error: (error) => {
                console.error('Error al cerrar:', error);
                this.loading = false;
            }
        });
    }

    eliminarDetalle(detalle: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de eliminar este detalle?',
            accept: () => {
                this.loading = true;
                this.emergenciasIngresosServices.eliminarDetalle(detalle.id).subscribe({
                    next: () => {
                        this.ingreso.detalles = this.ingreso.detalles.filter(d => d.id !== detalle.id);
                        this.loading = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Detalle eliminado correctamente'
                        });
                    },
                    error: (error) => {
                        console.error('Error al eliminar detalle:', error);
                        this.loading = false;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo eliminar el detalle'
                        });
                    }
                });
            }
        });
    }

    editarDetalle(detalle: EmergenciaIngresosDetalle) {
        this.detalleSeleccionado = detalle;
        this.modificarCantidad = true;
        this.modalCantidadVisible = true;
        this.focusArticulo = false;
    }

    sumarCantidad(cantidad: number) {
        if (this.detalleSeleccionado) {
            this.loading = true;
            let request: EmergenciaIngresosDetalle = new EmergenciaIngresosDetalle();
            request.cantidad = cantidad;
            if (this.modificarCantidad) {
                this.emergenciasIngresosServices.modificarDetalle(this.detalleSeleccionado.id, request).subscribe({
                    next: () => {
                        this.ingreso.detalles.forEach((d) => {
                            if (this.detalleSeleccionado && d.id === this.detalleSeleccionado.id) {
                                d.cantidad = cantidad;
                            }
                        });
                        this.loading = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Cantidad modificada correctamente'
                        });
                        this.modalCantidadVisible = false;
                        this.focusArticulo = true;
                    },
                    error: (error) => {
                        console.error('Error al modificar cantidad de detalle:', error);
                        this.loading = false;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo modificar la cantidad del detalle'
                        });
                    }
                });
            } else {
                this.emergenciasIngresosServices.sumarCantidadDetalle(this.detalleSeleccionado.id, request).subscribe({
                    next: () => {
                        this.ingreso.detalles.forEach((d) => {
                            if (this.detalleSeleccionado && d.id === this.detalleSeleccionado.id) {
                                d.cantidad += cantidad;
                            }
                        });
                        this.loading = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `Cantidad actualizada a ${this.detalleSeleccionado?.cantidad ?? cantidad}`
                        });
                        this.modalCantidadVisible = false;
                        this.focusArticulo = true;
                    },
                    error: (error) => {
                        console.error('Error al sumar cantidad de detalle:', error);
                        this.loading = false;
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo actualizar la cantidad del detalle'
                        });
                    }
                });
            }
        }
    }
}
