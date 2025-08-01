import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
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
import { DocumentosTipoSelectComponent } from '../../../documentos/components/documentos-tipo-select/documentos-tipo-select.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Ingreso } from '../../models/ingreso.model';
import { IngresoDetalle } from '../../models/ingreso-detalle.model';
import { IngresosService } from '../../services/ingresos.service';
import { BodegasSelectComponent } from '../../../bodegas/components/bodegas-select/bodegas-select.component';

@Component({
    selector: 'app-ingresos-formulario',
    imports: [
        BreadcrumbModule,
        DocumentosTipoSelectComponent,
        ModalCantidadComponent,
        BadgeModule,
        ButtonModule,
        ButtonGroupModule,
        FormsModule,
        AutoFocusModule,
        FocusTrapModule,
        CommonModule,
        ToastModule,
        TableModule,
        InputNumberModule,
        InputTextModule,
        ModalLoadingComponent,
        ConfirmDialogModule,
        BodegasSelectComponent
    ],
    templateUrl: './ingresos-formulario.component.html',
    styleUrl: './ingresos-formulario.component.scss',
    standalone: true,
    providers: [MessageService, ConfirmationService]
})
export class IngresosFormularioComponent {
    breadcrumb: MenuItem[] = [];
    ordenesServicio: OrdenServicio[] = [];
    ingreso: Ingreso = new Ingreso();
    articuloBuscar: string = '';
    focusArticulo: boolean = false;
    loading: boolean = false;
    modoUnidad: boolean = true;
    modalCantidadVisible: boolean = false;
    detalleSeleccionado: IngresoDetalle | undefined;
    modificarCantidad: boolean = false;
    validar: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ingresosService: IngresosService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Ingresos', routerLink: '/ingresos' }
        ];
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.get(id);
            this.breadcrumb.push({ label: 'Ingreso ' + id, routerLink: `/ingresos/formulario/${id}` });
        } else {
            this.loading = true;
            this.ingresosService.getTemporal().subscribe({
                next: (ingreso) => {
                    this.loading = false;
                    if (ingreso) {
                        this.ingreso = ingreso;
                        this.confirmationService.confirm({
                            key: 'temporal',
                            message: 'Ya existe un ingreso temporal. ¿Deseas continuar con este ingreso?',
                            reject: () => {
                                this.loading = true;
                                this.ingreso = new Ingreso();
                                this.ingresosService.delete(ingreso.id).subscribe({
                                    next: () => {
                                        this.loading = false;
                                        this.messageService.add({
                                            severity: 'info',
                                            summary: 'Ingreso Temporal Eliminado',
                                            detail: 'Se ha eliminado el ingreso temporal existente.'
                                        });
                                    },
                                    error: (error) => {
                                        console.error('Error al eliminar ingreso temporal:', error);
                                        this.loading = false;
                                    }
                                });
                                this.breadcrumb.push({ label: 'Nuevo Ingreso', routerLink: '/ingresos/formulario' });
                            }
                        });
                    } else {
                        this.ingreso = new Ingreso();
                        this.breadcrumb.push({ label: 'Nuevo Ingreso', routerLink: '/ingresos/formulario' });
                    }
                },
                error: (error) => {
                    this.loading = false;
                    console.error('Error al obtener ingresos temporales:', error);
                }
            });
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
        this.ingresosService.crear(this.ingreso).subscribe({
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

    async buscarArticulo() {
        if (this.articuloBuscar.trim() === '') {
            return;
        }
        let existeDetalle = false;
        if (this.ingreso && this.ingreso.detalles) {
            this.ingreso.detalles.forEach(async (detalle) => {
                if (detalle.item.codigo === this.articuloBuscar) {
                    existeDetalle = true;
                    if (this.modoUnidad) {
                        this.loading = true;
                        await this.sumarCantidadDetalle(detalle, 1);
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
        this.ingresosService.agregarDetalle(this.ingreso.id, this.articuloBuscar).subscribe({
            next: async (detalle) => {
                this.loading = false;
                if (!this.ingreso.detalles) {
                    this.ingreso.detalles = [];
                }
                this.ingreso.detalles.push(detalle);
                if (this.modoUnidad) {
                    this.articuloBuscar = '';
                    this.loading = true;
                    await this.sumarCantidadDetalle(detalle, 1);
                    this.loading = false;
                } else {
                    this.modalCantidadVisible = true;
                    this.detalleSeleccionado = detalle;
                    this.modificarCantidad = false;
                }
            },
            error: (error) => {
                this.loading = false;
                console.error('Error al agregar detalle:', error);
            }
        });
    }

    get(id: string) {
        this.loading = true;
        this.ingresosService.getById(id).subscribe({
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
            await this.ingresosService.sumarCantidadDetalle(detalle.id, { cantidad }).toPromise();
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
        this.ingresosService.abrir(this.ingreso.id).subscribe({
            next: () => {
                this.loading = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Actualizado correctamente'
                });
                this.router.navigate(['/ingresos/formulario', this.ingreso.id]);
            },
            error: (error) => {
                console.error('Error al abrir:', error);
                this.loading = false;
            }
        });
    }

    cerrar() {
        this.loading = true;
        this.ingresosService.cerrar(this.ingreso.id).subscribe({
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
            key: 'confirmDelete',
            accept: () => {
                this.loading = true;
                this.ingresosService.eliminarDetalle(detalle.id).subscribe({
                    next: () => {
                        this.ingreso.detalles = this.ingreso.detalles.filter((d) => d.id !== detalle.id);
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

    editarDetalle(detalle: IngresoDetalle) {
        this.detalleSeleccionado = detalle;
        this.modificarCantidad = true;
        this.modalCantidadVisible = true;
        this.focusArticulo = false;
    }

    sumarCantidad(cantidad: number) {
        if (this.detalleSeleccionado) {
            this.loading = true;
            let request: IngresoDetalle = new IngresoDetalle();
            request.cantidad = cantidad;
            if (this.modificarCantidad) {
                this.ingresosService.modificarDetalle(this.detalleSeleccionado.id, request).subscribe({
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
                        this.articuloBuscar = '';
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
                this.ingresosService.sumarCantidadDetalle(this.detalleSeleccionado.id, request).subscribe({
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
