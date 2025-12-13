import { Component, Input } from '@angular/core';
import { EntregaDashboard } from '../../models/entrega-dashboard.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntregasTableComponent } from '../entregas-table/entregas-table.component';
import { MessageService } from 'primeng/api';
import { EntregasService } from '../../services/entregas.service';
import { EntregaFiltro } from '../../models/entrega-filtro.models';
import { EntregasKpiComponent } from '../entregas-kpi/entregas-kpi.component';

@Component({
    selector: 'app-entregas-dashboard',
    imports: [CommonModule, FormsModule, EntregasTableComponent, EntregasKpiComponent],
    templateUrl: './entregas-dashboard.component.html',
    styleUrl: './entregas-dashboard.component.scss',
    standalone: true,
    providers: [MessageService]
})
export class EntregasDashboardComponent {
    data: EntregaDashboard = new EntregaDashboard();
    loading: boolean = true;
    @Input() filtro: EntregaFiltro = new EntregaFiltro();
    hoySeleccionado: boolean = true;
    realizadasSeleccionado: boolean = false;
    pendientesSeleccionado: boolean = false;

    constructor(
        private entregasService: EntregasService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getDashboardData();
        this.pendientesSeleccionado = false;
        this.realizadasSeleccionado = true;
        this.hoySeleccionado = false;
        this.filtro.entregado = true;
        this.filtro = { ...this.filtro, entregado: true, page: 0, size: 5 };
    }

    ngOnChanges() {
        this.getDashboardData();
    }

    getDashboardData() {
        this.loading = true;
        this.entregasService.getDashboardData(this.filtro).subscribe(
            (data) => {
                this.data = data;
                this.loading = false;
            },
            (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar datos del dashboard' });
                this.loading = false;
            }
        );
    }

    changeFiltro(tipo: string) {
        switch (tipo) {
            case 'Pendientes':
                this.pendientesSeleccionado = true;
                this.realizadasSeleccionado = false;
                this.hoySeleccionado = false;
                this.filtro.entregado = false;
                this.filtro.fecha = undefined;
                this.filtro = { ...this.filtro, entregado: false, page: 0, size: 5 };
                break;
            case 'Realizadas':
                this.pendientesSeleccionado = false;
                this.realizadasSeleccionado = true;
                this.filtro.fecha = undefined;
                this.hoySeleccionado = false;
                this.filtro.entregado = true;
                this.filtro = { ...this.filtro, entregado: true, page: 0, size: 5 };
                break;
            default:
                this.pendientesSeleccionado = false;
                this.realizadasSeleccionado = false;
                this.hoySeleccionado = true;
                this.filtro.entregado = false;
                const fechaFormateada = new Date().toISOString().split('T')[0];
                this.filtro = { ...this.filtro, entregado: false, page: 0, size: 5, fecha: fechaFormateada };
                break;
        }
    }
}
