import { Component } from '@angular/core';
import { EntregasComponent } from './components/entregas/entregas.component';
import { EntregasMesChartComponent } from '../entregas/components/entregas-mes-chart/entregas-mes-chart.component';
import { EntregasCountComponent } from '../entregas/components/entregas-count/entregas-count.component';
import { CommonModule } from '@angular/common';
import { RolService } from '../uikit/services/rol.service';
import { Observable } from 'rxjs';
import { RutasActualComponent } from '../rutas/components/rutas-actual/rutas-actual.component';
import { EntregasTableComponent } from '../entregas/components/entregas-table/entregas-table.component';

@Component({
    selector: 'app-dashboard',
    imports: [EntregasComponent, EntregasTableComponent, EntregasMesChartComponent, EntregasCountComponent, CommonModule, RutasActualComponent],
    template: `
        <div class="flex flex-column gap-2" *ngIf="esAdmin$ | async">
            <div class="flex flex-column md:flex-row gap-5 md:gap-2 w-12 mb-5">
                <app-entregas-count tipo="Activas" class="w-12" />
                <app-entregas-count tipo="Realizadas" class="w-12" />
            </div>
            <div class="flex flex-column md:flex-row gap-2">
                <app-entregas class="w-12" />
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
            <div class="card">
                <app-entregas-table [escuela]="true" [card]="false" [proveedor]="true" [documento]="true" [filtros]="true"></app-entregas-table>
            </div>
        </div>
    `
})
export class Dashboard {
    esAdmin$!: Observable<boolean>;
    esConductor$!: Observable<boolean>;
    esCliente$!: Observable<boolean>;

    constructor(private rolService: RolService) {}

    ngOnInit() {
        this.esAdmin$ = this.rolService.tieneRol('Administrador');
        this.esConductor$ = this.rolService.tieneRol('Conductor');
        this.esCliente$ = this.rolService.tieneRol('Cliente');
    }
}
