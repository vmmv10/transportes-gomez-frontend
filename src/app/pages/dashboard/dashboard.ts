import { Component } from '@angular/core';
import { EntregasMesChartComponent } from '../entregas/components/entregas-mes-chart/entregas-mes-chart.component';
import { EntregasCountComponent } from '../entregas/components/entregas-count/entregas-count.component';
import { CommonModule } from '@angular/common';
import { RolService } from '../uikit/services/rol.service';
import { Observable } from 'rxjs';
import { RutasActualComponent } from '../rutas/components/rutas-actual/rutas-actual.component';
import { EntregasTableComponent } from '../entregas/components/entregas-table/entregas-table.component';
import { EntregaFiltro } from '../entregas/models/entrega-filtro.models';

@Component({
    selector: 'app-dashboard',
    imports: [EntregasTableComponent, EntregasMesChartComponent, EntregasCountComponent, CommonModule, RutasActualComponent],
    template: `
        <div class="flex flex-column gap-2" *ngIf="esAdmin$ | async">
            <div class="flex flex-column md:flex-row gap-5 md:gap-2 w-12 mb-5">
                <app-entregas-count tipo="Activas" class="w-12" />
                <app-entregas-count tipo="Realizadas" class="w-12" />
            </div>
            <div class="card w-12 flex flex-column gap-4">
                <span class="text-xl font-bold">Ordenes de Servicio Entregadas</span>
                <app-entregas-table class="w-12" [filtro]="filtroEntregasAdministrador" [escuela]="true" [card]="false"></app-entregas-table>
            </div>
            <div class="flex flex-column w-12">
                <div class="card">
                    <app-entregas-mes-chart></app-entregas-mes-chart>
                </div>
            </div>
        </div>
        <div class="flex flex-column gap-2" *ngIf="esConductor$ | async">
            <app-rutas-actual class="w-12" />
        </div>
        <div class="flex flex-column gap-2" *ngIf="esCliente$ | async">
            <div class="card flex flex-column gap-4 w-12">
                <span class="text-xl font-bold">Ordenes de Servicio Entregadas</span>
                <app-entregas-table [filtro]="filtroEntregasCliente" [escuela]="true" [card]="false"></app-entregas-table>
            </div>
            <div class="card">
                <app-entregas-mes-chart></app-entregas-mes-chart>
            </div>
        </div>
    `
})
export class Dashboard {
    esAdmin$!: Observable<boolean>;
    esConductor$!: Observable<boolean>;
    esCliente$!: Observable<boolean>;

    filtroEntregasCliente: EntregaFiltro = new EntregaFiltro();
    filtroEntregasAdministrador: EntregaFiltro = new EntregaFiltro();

    constructor(private rolService: RolService) {}

    ngOnInit() {
        this.esAdmin$ = this.rolService.tieneRol('Administrador');
        this.esConductor$ = this.rolService.tieneRol('Conductor');
        this.esCliente$ = this.rolService.tieneRol('Cliente');

        if (this.esCliente$) {
            this.filtroEntregasCliente.entregado = true;
        }

        if (this.esAdmin$) {
            this.filtroEntregasAdministrador.entregado = true;
        }
    }
}
