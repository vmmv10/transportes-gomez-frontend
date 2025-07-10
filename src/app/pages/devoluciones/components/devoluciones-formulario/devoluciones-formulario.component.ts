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
import e from 'cors';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonGroupModule } from 'primeng/buttongroup';

@Component({
    selector: 'app-devoluciones-formulario',
    imports: [BreadcrumbModule, ButtonModule, ButtonGroupModule, FormsModule, AutoFocusModule, FocusTrapModule, CommonModule, ToastModule, OrdenesServiciosModalSelectComponent, TableModule, InputNumberModule, InputTextModule, ModalLoadingComponent],
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
    modo: boolean = true;
    modos: any[] = [
        { label: 'Manual', value: true },
        { label: 'Unidad', value: false }
    ];

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
        let existeDetalle = false;
        if (this.devolucion && this.devolucion.detalles) {
            this.devolucion.detalles.forEach((detalle) => {
                if (detalle.item.codigo === this.articuloBuscar) {
                    existeDetalle = true;
                    this.loading = true;
                    this.sumarCantidadDetalle(detalle, 1);
                    this.loading = false;
                    return;
                }
            });
        }
        if (existeDetalle) {
            this.articuloBuscar = '';
            this.focusArticulo = true;
            return;
        }
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
        this.modo = !this.modo;
        if (this.modo) {
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
}
