import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { EntregasService } from '../../services/entregas.service';
import { EntregaFiltro } from '../../models/entrega-filtro.models';

@Component({
    selector: 'app-entregas-card',
    imports: [FormsModule, CommonModule, CardModule],
    templateUrl: './entregas-card.component.html',
    styleUrl: './entregas-card.component.scss'
})
export class EntregasCardComponent {
    constructor(private entregasService: EntregasService) {}
    filtro: EntregaFiltro = new EntregaFiltro();
    entregasHoy: number = 0;
    entregasPendientes: number = 0;
    escuelasActivas: number = 0;
    loading: boolean = true;

    async ngOnInit() {
        this.loading = true;
        await this.getEntregasHoy();
        this.loading = false;
    }

    async getEntregasHoy(): Promise<void> {
        const data = await this.entregasService.countEntregasParaHoyPorEscuela().toPromise();
        this.entregasHoy = data ?? 0;
    }
}
