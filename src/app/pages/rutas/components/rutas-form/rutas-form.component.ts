import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
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
import 'leaflet-routing-machine';

declare module 'leaflet' {
    namespace Routing {
        function control(options: any): L.Control;
    }
}

@Component({
    standalone: true,
    selector: 'app-rutas-form',
    imports: [CommonModule, OrdenesServiciosModalSelectComponent, ButtonModule, FormsModule, InputTextModule, BreadcrumbModule, RouterModule, ToastModule, TooltipModule, ModalLoadingComponent, PanelModule, TableModule, DialogModule],
    templateUrl: './rutas-form.component.html',
    styleUrl: './rutas-form.component.scss',
    providers: [MessageService]
})
export class RutasFormComponent {
    breadcrumb: MenuItem[] = [];
    loading: boolean = false;
    ordenesServiciosSeleccionados: OrdenServicio[] = [];
    private mapa!: L.Map;
    private polyline!: L.Polyline;
    private puntos: L.LatLng[] = [];
    private controlRouting: any;

    constructor(
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
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
            this.loading = false;
        } else {
            this.breadcrumb.push({ label: 'Nueva Ruta', routerLink: '/rutas/formulario' });
        }
    }

    guardarRuta() {}

    onRowReorder() {
        console.log('Row reorder event:', this.ordenesServiciosSeleccionados);
        this.actualizarPuntos();
        this.messageService.add({ severity: 'success', summary: 'Ordenes Actualizadas', detail: 'Las ordenes de servicio han sido actualizadas correctamente.' });
    }

    async ordenesServiciosSeleccionadosChange(ordenes: OrdenServicio[]) {
        await this.cargarMapa();
        this.ordenesServiciosSeleccionados = ordenes;
        console.log('Ordenes seleccionadas:', this.ordenesServiciosSeleccionados);
        this.actualizarPuntos();
    }

    async cargarMapa() {
        if (this.mapa) {
            return;
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 0)); // Espera a que el DOM esté listo
        this.mapa = L.map('mapa').setView([-33.45, -70.66], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(this.mapa);
    }

    actualizarPuntos() {
        // Limpia puntos y marcadores previos
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
        this.ordenesServiciosSeleccionados.forEach((os, index) => {
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
            createMarker: (i: any, waypoint: any) => {
                return L.marker(waypoint.latLng, {
                    icon: L.divIcon({
                        className: 'entrega-icon',
                        html: `<div class="entrega-label">📦${i + 1}</div>`,
                        iconSize: [34, 34],
                        iconAnchor: [17, 17]
                    })
                }).bindPopup(`${i + 1}. ${this.ordenesServiciosSeleccionados[i].escuela?.nombre}`);
            }
        }).addTo(this.mapa);
    }
}
