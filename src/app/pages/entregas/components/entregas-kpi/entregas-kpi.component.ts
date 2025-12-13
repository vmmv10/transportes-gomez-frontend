import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
export class EntregasKpiComponent {
    constructor(private entregasService: EntregasService) {}
    @Input() filtro: EntregaFiltro = new EntregaFiltro();
    entregasATiempo: number = 0;
    entregasPendientes: number = 0;
    escuelasActivas: number = 0;
    loading: boolean = true;
    kpis: Kpi[] = [];

    async ngOnInit() {
        this.loading = true;
        await this.getKpis();
        this.loading = false;
    }

    async getKpis(): Promise<void> {
        const data = await this.entregasService.getKpis(this.filtro).toPromise();
        if (data && data.length > 0) {
            this.kpis = data;
        }
    }
}
