import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { OrdenServicio } from '../../../ordenes-servicios/models/orden-servicio.model';
import { OrdenesServiciosModalSelectComponent } from '../../../ordenes-servicios/components/ordenes-servicios-modal-select/ordenes-servicios-modal-select.component';
import * as L from 'leaflet';
import { UsuariosSelectComponent } from '../../../usuarios/components/usuarios-select/usuarios-select.component';
import { Ruta } from '../../models/ruta.model';
import { RutasService } from '../../services/rutas.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { environment } from '../../../../../environments';
import 'leaflet-routing-machine';
import { DatePickerModule } from 'primeng/datepicker';
import { ChipModule } from 'primeng/chip';

declare module 'leaflet' {
    namespace Routing {
        function control(options: any): L.Control;
        class OSRMv1 {
            constructor(options?: any);
        }
    }
}

@Component({
    standalone: true,
    selector: 'app-rutas-form',
    imports: [
        CommonModule,
        UsuariosSelectComponent,
        OrdenesServiciosModalSelectComponent,
        ButtonModule,
        FormsModule,
        InputTextModule,
        BreadcrumbModule,
        RouterModule,
        ToastModule,
        TooltipModule,
        ModalLoadingComponent,
        PanelModule,
        TableModule,
        DialogModule,
        ConfirmDialogModule,
        DatePickerModule,
        ChipModule
    ],
    templateUrl: './rutas-form.component.html',
    styleUrl: './rutas-form.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class RutasFormComponent {
    breadcrumb: MenuItem[] = [];
    loading: boolean = false;
    validar: boolean = false;
    private mapa!: L.Map;
    private puntos: L.LatLng[] = [];
    private controlRouting: any;
    ruta: Ruta = new Ruta();
    minFecha: Date = new Date(new Date().setHours(0, 0, 0, 0));

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router,
        private rutasService: RutasService,
        private confirmationService: ConfirmationService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Rutas', routerLink: '/rutas' }
        ];
    }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.breadcrumb.push({ label: 'Editar Ruta', routerLink: `/rutas/formulario/${id}` });
            this.loading = true;
            await this.getRuta(id);
            this.loading = false;
        } else {
            this.breadcrumb.push({ label: 'Nueva Ruta', routerLink: '/rutas/formulario' });
        }
    }

    async getRuta(id: string) {
        try {
            const data = await this.rutasService.get(id).toPromise();
            if (!data) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ruta no encontrada.' });
                this.router.navigate(['/rutas']);
                return;
            }
            this.ruta = data;
            const [anio, mes, dia] = data.fecha.split('-').map(Number);
            this.ruta.fechaJS = new Date(Date.UTC(anio, mes - 1, dia));
            await this.cargarMapa();
            await this.actualizarPuntos();
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener la ruta.' });
            console.error('Error fetching ruta:', error);
        }
    }

    guardarRuta() {
        this.validar = true;
        if (!this.ruta.chofer) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un chofer.' });
            return;
        }
        if (this.ruta.ordenes.length === 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar al menos una orden de servicio.' });
            return;
        }
        if (!this.ruta.fechaJS) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una fecha.' });
            return;
        }
        this.validar = false;
        this.loading = true;
        this.ruta.fecha = this.ruta.fechaJS.toISOString().split('T')[0];
        if (this.ruta.id > 0) {
            this.rutasService.update(this.ruta).subscribe({
                next: (data) => {
                    this.messageService.add({ severity: 'success', summary: 'Ruta Actualizada', detail: 'La ruta ha sido actualizada correctamente.' });
                    this.loading = false;
                    this.ngOnInit();
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la ruta.' });
                    this.loading = false;
                    console.error('Error updating ruta:', error);
                }
            });
        } else {
            this.rutasService.create(this.ruta).subscribe({
                next: (data) => {
                    this.messageService.add({ severity: 'success', summary: 'Ruta Creada', detail: 'La ruta ha sido creada correctamente.' });
                    this.loading = false;
                    this.router.navigate(['/rutas']);
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la ruta.' });
                    this.loading = false;
                    console.error('Error creating ruta:', error);
                }
            });
        }
    }

    async onRowReorder() {
        await this.actualizarPuntos();
        this.messageService.add({ severity: 'success', summary: 'Ordenes Actualizadas', detail: 'Las ordenes de servicio han sido actualizadas correctamente.' });
    }

    async ordenesServiciosSeleccionadosChange(ordenes: OrdenServicio[]) {
        await this.cargarMapa();
        this.ruta.ordenes = ordenes;
        console.log('Ordenes seleccionadas:', this.ruta.ordenes);
        await this.actualizarPuntos();
    }

    async cargarMapa() {
        if (this.mapa) {
            return;
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 0)); // Espera a que el DOM esté listo
        this.mapa = L.map('mapa').setView([-42.4824, -73.7643], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(this.mapa);
    }

    async actualizarPuntos() {
        this.puntos = [];
        if (this.controlRouting) {
            this.mapa.removeControl(this.controlRouting);
        }
        this.mapa.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                this.mapa.removeLayer(layer);
            }
        });

        // Agrega puntos de escuelas
        this.ruta.ordenes.forEach((os, index) => {
            const lat = Number(os.escuela?.latitud?.replace(',', '.'));
            const lon = Number(os.escuela?.longitud?.replace(',', '.'));

            if (!isNaN(lat) && !isNaN(lon)) {
                const punto = L.latLng(lat, lon);
                this.puntos.push(punto);

                L.marker(punto, {
                    icon: L.divIcon({
                        className: 'entrega-icon',
                        html: `<div class="entrega-label">📦${index + 1}</div>`,
                        iconSize: [34, 34],
                        iconAnchor: [17, 17]
                    })
                })
                    .addTo(this.mapa)
                    .bindPopup(`${index + 1}. ${os.escuela?.nombre}`);
            }
        });

        if (this.puntos.length < 2) {
            // Si hay menos de dos puntos no hace falta ruta
            if (this.puntos.length === 1) {
                this.mapa.setView(this.puntos[0], 13);
            }
            return;
        }
        console.log('L:', L);
        console.log('L.Routing:', L.Routing);
        console.log('typeof L.Routing.control:', typeof L.Routing?.control);
        // Crear control de ruta
        this.controlRouting = L.Routing.control({
            waypoints: this.puntos,
            lineOptions: {
                styles: [{ color: '#4287f5', opacity: 0.7, weight: 4 }]
            },
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            router: new L.Routing.OSRMv1({
                serviceUrl: environment.osrm
            }),
            createMarker: (i: any, waypoint: any) => {
                return L.marker(waypoint.latLng, {
                    icon: L.divIcon({
                        className: 'entrega-icon',
                        html: `<div class="entrega-label">📦${i + 1}</div>`,
                        iconSize: [34, 34],
                        iconAnchor: [17, 17]
                    })
                }).bindPopup(`${i + 1}. ${this.ruta.ordenes[i].escuela?.nombre}`);
            }
        }).addTo(this.mapa);
    }

    confirmarEliminar(orden: OrdenServicio) {
        this.confirmationService.confirm({
            message: '¿Desea eliminar la orden ' + orden.id + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            key: 'eliminarEntrega',
            accept: async () => await this.eliminarOrden(orden)
        });
    }

    async eliminarOrden(orden: OrdenServicio) {
        if (!this.ruta.id && this.ruta.id > 0) {
            this.rutasService.deleteEntrega(this.ruta.id.toString(), orden.id.toString()).subscribe({
                next: async () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden de servicio eliminada correctamente.' });
                    this.ruta.ordenes = this.ruta.ordenes.filter((o) => o.id !== orden.id);
                    await this.actualizarPuntos();
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la orden de servicio.' });
                    console.error('Error deleting orden:', error);
                }
            });
        } else {
            this.ruta.ordenes = this.ruta.ordenes.filter((o) => o.id !== orden.id);
        }
    }
}
