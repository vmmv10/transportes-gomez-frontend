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
import { ButtonGroupModule } from 'primeng/buttongroup';
import { BadgeModule } from 'primeng/badge';
import { ModalCantidadComponent } from '../../../uikit/components/modal-cantidad/modal-cantidad.component';
import { DevolucionDetalle } from '../../models/devolucion-detalle.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-devoluciones-formulario',
    imports: [
        BreadcrumbModule,
        ModalCantidadComponent,
        BadgeModule,
        ButtonModule,
        ButtonGroupModule,
        FormsModule,
        AutoFocusModule,
        FocusTrapModule,
        CommonModule,
        ToastModule,
        OrdenesServiciosModalSelectComponent,
        TableModule,
        InputNumberModule,
        InputTextModule,
        ModalLoadingComponent,
        ConfirmDialogModule
    ],
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
    modoUnidad: boolean = true;
    modalCantidadVisible: boolean = false;
    detalleSeleccionado: DevolucionDetalle | undefined;
    modificarCantidad: boolean = false;
    validar: boolean = false;

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
            this.get(id);
            this.breadcrumb.push({ label: 'Devolución ' + id, routerLink: `/devoluciones/formulario/${id}` });
        } else {
            this.loading = true;
            this.devolucionService.getTemporal().subscribe({
                next: (devolucion) => {
                    this.loading = false;
                    if (devolucion) {
                        this.devolucion = devolucion;
                        this.confirmationService.confirm({
                            key: 'temporal',
                            message: 'Ya existe una devolución temporal. ¿Deseas continuar con esta devolución?',
                            accept: () => {
                                this.breadcrumb.push({ label: 'Devolución Temporal', routerLink: `/devoluciones/formulario/${devolucion.id}` });
                            },
                            reject: () => {
                                this.devolucion = new Devolucion();
                                this.loading = true;
                                this.breadcrumb.push({ label: 'Nueva Devolución', routerLink: '/devoluciones/formulario' });
                                this.devolucionService.delete(devolucion.id).subscribe({
                                    next: () => {
                                        this.loading = false;
                                        this.messageService.add({
                                            severity: 'info',
                                            summary: 'Información',
                                            detail: 'Devolución temporal eliminada'
                                        });
                                    },
                                    error: (error) => {
                                        this.loading = false;
                                        console.error('Error al eliminar devolución temporal:', error);
                                        this.messageService.add({
                                            severity: 'error',
                                            summary: 'Error',
                                            detail: 'No se pudo eliminar la devolución temporal'
                                        });
                                        this.devolucion = new Devolucion();
                                    }
                                });
                            }
                        });
                    } else {
                        this.breadcrumb.push({ label: 'Nueva Devolución', routerLink: '/devoluciones/formulario' });
                        this.devolucion = new Devolucion();
                    }
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error al obtener devolución temporal:', error);
                    this.loading = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo obtener la devolución temporal'
                    });
                }
            });
        }
    }

    comenzar() {
        this.validar = true;
        if (!this.devolucion.ordenServicio || !this.devolucion.escuela) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe seleccionar una orden de servicio y una escuela antes de comenzar'
            });
            return;
        }
        this.validar = false;
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
        let existeDetalle = false;
        if (this.devolucion && this.devolucion.detalles) {
            this.devolucion.detalles.forEach((detalle) => {
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

    get(id: string) {
        this.loading = true;
        this.devolucionService.getById(id).subscribe({
            next: (devolucion) => {
                this.devolucion = devolucion;
                this.loading = false;
                this.focusArticulo = true;
            },
            error: (error) => {
                console.error('Error al obtener devolución:', error);
                this.loading = false;
            }
        });
    }

    async sumarCantidadDetalle(detalle: any, cantidad: number) {
        try {
            await this.devolucionService.sumarCantidadDetalle(detalle.id, { cantidad }).toPromise();
            this.devolucion.detalles.forEach((d) => {
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
        this.devolucionService.abrir(this.devolucion.id).subscribe({
            next: (devolucion) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Devolución abierta correctamente'
                });
                this.ngOnInit();
            },
            error: (error) => {
                console.error('Error al abrir devolución:', error);
                this.loading = false;
            }
        });
    }

    cerrar() {
        this.loading = true;
        this.devolucionService.cerrar(this.devolucion.id).subscribe({
            next: (devolucion) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Devolución cerrada correctamente'
                });
                this.ngOnInit();
            },
            error: (error) => {
                console.error('Error al cerrar devolución:', error);
                this.loading = false;
            }
        });
    }

    eliminarDetalle(detalle: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro de eliminar este detalle?',
            key: 'confirmDeleteDetalle',
            accept: () => {
                this.loading = true;
                this.devolucionService.eliminarDetalle(detalle.id).subscribe({
                    next: () => {
                        this.devolucion.detalles = this.devolucion.detalles.filter((d) => d.id !== detalle.id);
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

    editarDetalle(detalle: DevolucionDetalle) {
        this.detalleSeleccionado = detalle;
        this.modificarCantidad = true;
        this.modalCantidadVisible = true;
        this.focusArticulo = false;
    }

    sumarCantidad(cantidad: number) {
        if (this.detalleSeleccionado) {
            this.loading = true;
            let request: DevolucionDetalle = new DevolucionDetalle();
            request.cantidad = cantidad;
            if (this.modificarCantidad) {
                this.devolucionService.modificarDetalle(this.detalleSeleccionado.id, request).subscribe({
                    next: () => {
                        this.devolucion.detalles.forEach((d) => {
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
                this.devolucionService.sumarCantidadDetalle(this.detalleSeleccionado.id, request).subscribe({
                    next: () => {
                        this.devolucion.detalles.forEach((d) => {
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
