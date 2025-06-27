import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Escuela } from '../../models/escuela.models';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EscuelasService } from '../../services/escuelas.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { EntregasTableComponent } from '../../../entregas/components/entregas-table/entregas-table.component';
import { EntregaFiltro } from '../../../entregas/models/entrega-filtro.models';

@Component({
    standalone: true,
    selector: 'app-escuelas-dashboard',
    imports: [BreadcrumbModule, CommonModule, ButtonModule, FormsModule, RouterModule, EntregasTableComponent],
    templateUrl: './escuelas-dashboard.component.html',
    styleUrl: './escuelas-dashboard.component.scss'
})
export class EscuelasDashboardComponent {
    @Input() escuela: Escuela | undefined;
    items: MenuItem[] = [];
    private map!: L.Map;
    filtroEntegas: EntregaFiltro = new EntregaFiltro();

    constructor(
        private route: ActivatedRoute,
        private escuelasService: EscuelasService
    ) {
        this.items = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Escuelas', routerLink: '/escuelas' },
            { label: 'Dashboard', routerLink: '/escuelas/dashboard' }
        ];
    }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            await this.getEscuela(id);
            this.filtroEntegas.escuela = id;
            this.filtroEntegas.estado = true;
        }
    }

    async getEscuela(id: string) {
        try {
            this.escuela = await this.escuelasService.getEscuela(id).toPromise();
            this.initMap();
        } catch (error) {
            console.error('Error al obtener la escuela:', error);
        }
    }

    private initMap(): void {
        const lat = Number(this.escuela?.latitud?.replace(',', '.'));
        const lon = Number(this.escuela?.longitud?.replace(',', '.'));

        if (!lat || !lon) {
            console.warn('Coordenadas no válidas');
            return;
        }

        this.map = L.map('map').setView([lat, lon], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Ícono personalizado
        const customIcon = L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png', // o usa uno local como 'assets/mi-icono.png'
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        const marker = L.marker([lat, lon], { icon: customIcon }).addTo(this.map);

        // Reverse Geocoding con Nominatim
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
            .then((res) => res.json())
            .then((data) => {
                const address = data.display_name || 'Dirección no encontrada';
                marker.bindPopup(address).openPopup();
            })
            .catch((err) => {
                console.error('Error obteniendo dirección:', err);
                marker.bindPopup('Ubicación cargada').openPopup();
            });
    }
}
