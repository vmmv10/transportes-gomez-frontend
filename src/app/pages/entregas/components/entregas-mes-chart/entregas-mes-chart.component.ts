import { Component, Input } from '@angular/core';
import { EntregasService } from '../../services/entregas.service';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { altoHorizontal, datasetBarras, opcionesBarras } from '../../../uikit/charts/chart-theme';
import { EntregaFiltro } from '../../models/entrega-filtro.models';
import { Escuela } from '../../../escuelas/models/escuela.models';

@Component({
    standalone: true,
    selector: 'app-entregas-mes-chart',
    imports: [ChartModule],
    templateUrl: './entregas-mes-chart.component.html',
    styleUrl: './entregas-mes-chart.component.scss',
    providers: [MessageService]
})
export class EntregasMesChartComponent {
    @Input() filtro: EntregaFiltro = new EntregaFiltro();
    basicData: any;
    basicOptions: any;
    altura: string = '16rem';
    constructor(
        private entregasService: EntregasService,
        private MessageService: MessageService
    ) {}

    ngOnInit() {
        this.getEntregasMes();
    }

    ngOnChanges() {
        this.getEntregasMes();
    }

    getEntregasMes() {
        this.entregasService.getEntregasMes(this.filtro).subscribe({
            next: (data) => {
                const labels = data.map((d) => d.titulo);
                const values = data.map((d) => d.total);
                this.basicData = {
                    labels,
                    datasets: [datasetBarras('Entregas por mes', values, false)]
                };
                this.basicOptions = opcionesBarras({ horizontal: false, unidad: 'entregas' });
            },
            error: (error) => {
                this.MessageService.add({
                    severity: 'error',
                    summary: 'Error al cargar datos',
                    detail: 'No se pudieron cargar los datos de entregas por mes.'
                });
            }
        });
    }
}
