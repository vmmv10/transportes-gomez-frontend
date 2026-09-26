import { Component, Input, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Escuela } from '../../models/escuela.models';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EscuelasService } from '../../services/escuelas.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { EntregaFiltro } from '../../../entregas/models/entrega-filtro.models';
import { EntregasMesChartComponent } from '../../../entregas/components/entregas-mes-chart/entregas-mes-chart.component';
import { EntregasDashboardComponent } from '../../../entregas/components/entregas-dashboard/entregas-dashboard.component';
import { OrdenServicioFiltro } from '../../../ordenes-servicios/models/orden-servicio-filtro.model';
import { OrdenesServiciosItemsDespachadosChartComponent } from '../../../ordenes-servicios/components/ordenes-servicios-items-despachados-chart/ordenes-servicios-items-despachados-chart.component';

@Component({
    standalone: true,
    selector: 'app-escuelas-dashboard',
    imports: [OrdenesServiciosItemsDespachadosChartComponent, BreadcrumbModule, EntregasDashboardComponent, CommonModule, ButtonModule, FormsModule, RouterModule, EntregasMesChartComponent, SkeletonModule, TooltipModule],
    templateUrl: './escuelas-dashboard.component.html',
    styleUrl: './escuelas-dashboard.component.scss'
})
export class EscuelasDashboardComponent implements OnDestroy {
    @Input() escuela: Escuela | undefined;
    items: MenuItem[] = [];
    private map!: L.Map;
    private marcador: L.Marker | undefined;
    filtroEntregas: EntregaFiltro = new EntregaFiltro();
    filtroOs: OrdenServicioFiltro = new OrdenServicioFiltro();
    tieneCoordenadas: boolean = false;
    rbdCopiado: boolean = false;
    lat: number | undefined;
    lon: number | undefined;

    constructor(
        private route: ActivatedRoute,
        private escuelasService: EscuelasService
    ) {
        this.items = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Establecimientos', routerLink: '/establecimientos' },
            { label: 'Dashboard', routerLink: '/establecimientos/dashboard' }
        ];
    }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            await this.getEscuela(id);
        }
    }

    async getEscuela(id: string) {
        try {
            this.escuela = await this.escuelasService.getEscuela(id).toPromise();
            this.filtroEntregas.escuela = this.escuela;
            this.filtroOs.escuela = this.escuela;
            if (this.escuela?.nombre) {
                this.items = [...this.items.slice(0, 2), { label: this.escuela.nombre }];
            }
            this.initMap();
        } catch (error) {
            console.error('Error al obtener la escuela:', error);
        }
    }

    ngOnDestroy(): void {
        // Evita "Map container is already initialized" al volver a entrar a la ficha
        this.map?.remove();
    }

    /** Copia el RBD (identificador oficial del establecimiento) al portapapeles. */
    copiarRbd(): void {
        const rbd = this.escuela?.rbd;
        if (!rbd || !navigator.clipboard) {
            return;
        }
        navigator.clipboard.writeText(rbd).then(() => {
            this.rbdCopiado = true;
            setTimeout(() => (this.rbdCopiado = false), 1500);
        });
    }

    abrir(url: string): void {
        window.open(url, '_blank', 'noopener');
    }

    /** Vuelve a centrar el mapa en el establecimiento. */
    recentrar(): void {
        if (this.map && this.lat && this.lon) {
            this.map.flyTo([this.lat, this.lon], 16, { duration: 0.6 });
            this.marcador?.openPopup();
        }
    }

    private initMap(): void {
        const lat = Number(this.escuela?.latitud?.replace(',', '.'));
        const lon = Number(this.escuela?.longitud?.replace(',', '.'));

        if (!lat || !lon) {
            this.tieneCoordenadas = false;
            return;
        }
        this.tieneCoordenadas = true;
        this.lat = lat;
        this.lon = lon;

        this.map = L.map('map', {
            zoomControl: false,
            // La rueda del mouse solo hace zoom después de hacer clic en el mapa (no "atrapa" el scroll de la página)
            scrollWheelZoom: false,
            attributionControl: true
        }).setView([lat, lon], 16);
        this.map.once('click', () => this.map.scrollWheelZoom.enable());
        this.map.on('mouseout', () => this.map.scrollWheelZoom.disable());

        L.control.zoom({ position: 'topright', zoomInTitle: 'Acercar', zoomOutTitle: 'Alejar' }).addTo(this.map);
        this.map.attributionControl.setPrefix(false);

        // Mapa base de OpenStreetMap (no requiere API key). El tono suave y el modo oscuro
        // se logran con filtros CSS sobre la capa de mosaicos (ver .escuela-mapa en styles.scss).
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
            maxZoom: 19,
            className: 'escuela-mapa__tiles'
        }).addTo(this.map);

        // Marcador con el estilo de la app (pin azul con el ícono de escuela)
        const icono = L.divIcon({
            className: 'escuela-marker',
            html: '<span class="escuela-marker__pulso"></span><span class="escuela-marker__pin"><i class="pi pi-graduation-cap"></i></span>',
            iconSize: [40, 48],
            iconAnchor: [20, 46],
            popupAnchor: [0, -44]
        });

        this.marcador = L.marker([lat, lon], { icon: icono, title: this.escuela?.nombre ?? '' }).addTo(this.map);

        const popup = this.crearPopup(this.escuela?.nombre ?? 'Establecimiento', 'Buscando dirección…', lat, lon);
        this.marcador.bindPopup(popup.contenedor, { className: 'escuela-popup', closeButton: true, maxWidth: 300, minWidth: 220 }).openPopup();

        // Reverse Geocoding con Nominatim (solo para mostrar la dirección en el popup)
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es`)
            .then((res) => res.json())
            .then((data) => {
                popup.direccion.textContent = data.display_name || 'Dirección no encontrada';
                this.marcador?.getPopup()?.update();
            })
            .catch((err) => {
                console.error('Error obteniendo dirección:', err);
                popup.direccion.textContent = this.escuela?.direccion || 'Dirección no disponible';
            });
    }

    /** Construye el contenido del popup con DOM (sin innerHTML: el nombre viene de la base de datos). */
    private crearPopup(nombre: string, direccion: string, lat: number, lon: number) {
        const contenedor = document.createElement('div');
        contenedor.className = 'escuela-popup__body';

        const titulo = document.createElement('strong');
        titulo.className = 'escuela-popup__titulo';
        titulo.textContent = nombre;

        const dir = document.createElement('span');
        dir.className = 'escuela-popup__direccion';
        dir.textContent = direccion;

        const link = document.createElement('a');
        link.className = 'escuela-popup__link';
        link.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Cómo llegar →';

        contenedor.append(titulo, dir, link);
        return { contenedor, direccion: dir };
    }
}
