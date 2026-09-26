import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { EntregasService } from '../../services/entregas.service';
import { EntregaFiltro } from '../../models/entrega-filtro.models';
import { Kpi } from '../../../uikit/models/Kpi.model';

@Component({
    selector: 'app-entregas-kpi',
    imports: [FormsModule, CommonModule, CardModule],
    templateUrl: './entregas-kpi.component.html',
    styleUrl: './entregas-kpi.component.scss'
})
export class EntregasKpiComponent implements OnChanges {
    constructor(private entregasService: EntregasService) {}
    @Input() filtro: EntregaFiltro = new EntregaFiltro();
    entregasATiempo: number = 0;
    entregasPendientes: number = 0;
    escuelasActivas: number = 0;
    loading: boolean = true;
    kpis: Kpi[] = [];

    /** Tarjetas vacías mientras llega la primera respuesta (evita que la fila "salte"). */
    readonly placeholders = [{ nombre: 'Entregas a Tiempo' }, { nombre: 'Quiebre de Stock' }, { nombre: 'Tiempo de Respuesta Interno' }] as Kpi[];

    private readonly iconos: Record<string, string> = {
        'entregas a tiempo': 'pi-clock',
        'quiebre de stock': 'pi-box',
        'tiempo de respuesta interno': 'pi-stopwatch'
    };

    icono(nombre: string | undefined): string {
        return this.iconos[(nombre ?? '').toLowerCase()] ?? 'pi-chart-bar';
    }

    async ngOnChanges(changes: SimpleChanges) {
        // Recarga cuando cambian los filtros del dashboard (no en la primera asignación)
        if (changes['filtro'] && !changes['filtro'].firstChange) {
            this.loading = true;
            await this.getKpis();
            this.loading = false;
        }
    }

    async ngOnInit() {
        this.loading = true;
        await this.getKpis();
        this.loading = false;
    }

    async getKpis(): Promise<void> {
        try {
            const data = await this.entregasService.getKpis(this.filtro).toPromise();
            this.kpis = data && data.length > 0 ? data : [];
        } catch (error) {
            // Si el backend falla (p. ej. un establecimiento sin datos) no dejamos las tarjetas cargando para siempre
            console.error('Error al obtener KPIs:', error);
            this.kpis = [];
        }
    }
}
