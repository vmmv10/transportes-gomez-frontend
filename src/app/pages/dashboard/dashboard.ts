import { Component } from '@angular/core';
import { EntregasMesChartComponent } from '../entregas/components/entregas-mes-chart/entregas-mes-chart.component';
import { EntregasCountComponent } from '../entregas/components/entregas-count/entregas-count.component';
import { CommonModule } from '@angular/common';
import { RolService } from '../uikit/services/rol.service';
import { Observable } from 'rxjs';
import { RutasActualComponent } from '../rutas/components/rutas-actual/rutas-actual.component';
import { EntregasTableComponent } from '../entregas/components/entregas-table/entregas-table.component';
import { EntregaFiltro } from '../entregas/models/entrega-filtro.models';
import { EntregasTopEscuelasChartComponent } from '../entregas/components/entregas-top-escuelas-chart/entregas-top-escuelas-chart.component';

// PrimeNG
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { EscuelasSelectComponent } from '../escuelas/components/escuelas-select/escuelas-select.component';
import { MessageService } from 'primeng/api';
import { EntregasCardComponent } from '../entregas/components/entregas-card/entregas-card.component';
import { OrdenesServiciosItemsDespachadosChartComponent } from '../ordenes-servicios/components/ordenes-servicios-items-despachados-chart/ordenes-servicios-items-despachados-chart.component';
import { OrdenServicioFiltro } from '../ordenes-servicios/models/orden-servicio-filtro.model';
import { EntregasDashboardComponent } from '../entregas/components/entregas-dashboard/entregas-dashboard.component';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-dashboard',
    imports: [
        ToolbarModule,
        FormsModule,
        EntregasTopEscuelasChartComponent,
        EntregasMesChartComponent,
        CommonModule,
        RutasActualComponent,
        CardModule,
        CalendarModule,
        DropdownModule,
        TableModule,
        ChartModule,
        ButtonModule,
        InputIconModule,
        EscuelasSelectComponent,
        OrdenesServiciosItemsDespachadosChartComponent,
        EntregasDashboardComponent,
        DatePickerModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.scss'],
    standalone: true,
    providers: [MessageService]
})
export class Dashboard {
    esAdmin$!: Observable<boolean>;
    esConductor$!: Observable<boolean>;
    esCliente$!: Observable<boolean>;

    filtroEntregasCliente: EntregaFiltro = new EntregaFiltro();
    filtroEntregasAdministrador: EntregaFiltro = new EntregaFiltro();
    filtroOs: OrdenServicioFiltro = new OrdenServicioFiltro();

    fechaFiltro: Date | null = null;
    escuelaSeleccionada: any = null;
    escuelas = [
        { label: 'Escuela A', value: 'A' },
        { label: 'Escuela B', value: 'B' }
    ];

    entregasHoy = 12;
    entregasPendientes = 3;
    escuelasActivas = 15;

    topEscuelasData: any;
    entregasMensualesData: any;
    estadoEntregasData: any;

    chartOptions: any;
    ultimasEntregas = [
        { fecha: new Date(), escuela: 'Escuela A', estado: 'Completada', cantidad: 5 },
        { fecha: new Date(), escuela: 'Escuela B', estado: 'Pendiente', cantidad: 3 }
    ];

    constructor(private rolService: RolService) {}

    ngOnInit() {
        this.esAdmin$ = this.rolService.tieneRol('Administrador');
        this.esConductor$ = this.rolService.tieneRol('Conductor');
        this.esCliente$ = this.rolService.tieneRol('Cliente');

        if (this.esCliente$) {
            this.filtroEntregasCliente.entregado = false;
            this.filtroEntregasCliente.size = 5;
        }

        if (this.esAdmin$) {
            this.filtroEntregasAdministrador.size = 5;
            this.filtroEntregasAdministrador.entregado = false;
        }

        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false
        };

        this.topEscuelasData = {
            labels: ['Escuela A', 'Escuela B', 'Escuela C'],
            datasets: [{ label: 'Entregas', data: [12, 8, 5], backgroundColor: ['#50E3C2', '#4A90E2', '#F5A623'] }]
        };

        this.entregasMensualesData = {
            labels: ['Enero', 'Febrero', 'Marzo'],
            datasets: [{ label: 'Entregas', data: [15, 10, 20], borderColor: '#4A90E2', fill: false }]
        };

        this.estadoEntregasData = {
            labels: ['Completadas', 'Pendientes', 'Rechazadas'],
            datasets: [{ data: [70, 20, 10], backgroundColor: ['#2ecc71', '#f39c12', '#e74c3c'] }]
        };
    }

    escuelaChange(event: any) {
        this.escuelaSeleccionada = event;
        this.filtroEntregasAdministrador = {
            ...this.filtroEntregasAdministrador,
            escuela: event
        };
        this.filtroOs = {
            ...this.filtroOs,
            escuela: event
        };
    }
}
