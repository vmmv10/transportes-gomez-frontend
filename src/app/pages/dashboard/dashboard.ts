import { Component } from '@angular/core';
import { EntregasComponent } from './components/entregas/entregas.component';
import { EntregasMesChartComponent } from '../entregas/components/entregas-mes-chart/entregas-mes-chart.component';
import { EntregasCountComponent } from '../entregas/components/entregas-count/entregas-count.component';

@Component({
    selector: 'app-dashboard',
    imports: [EntregasComponent, EntregasMesChartComponent, EntregasCountComponent],
    template: `
        <div class="flex flex-column gap-2">
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
    `
})
export class Dashboard {}
