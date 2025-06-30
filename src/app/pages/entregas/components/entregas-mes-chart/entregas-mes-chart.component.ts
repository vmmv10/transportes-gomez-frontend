import { Component, Input } from '@angular/core';
import { EntregasService } from '../../services/entregas.service';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { ReporteMes } from '../../../uikit/models/reporte-mes.model';
import { EntregaFiltro } from '../../models/entrega-filtro.models';

@Component({
    standalone: true,
    selector: 'app-entregas-mes-chart',
    imports: [ChartModule],
    templateUrl: './entregas-mes-chart.component.html',
    styleUrl: './entregas-mes-chart.component.scss',
    providers: [MessageService]
})
export class EntregasMesChartComponent {
    @Input() escuela: string | undefined;
    filtro: EntregaFiltro = new EntregaFiltro();
    basicData: any;
    basicOptions: any;
    constructor(
        private entregasService: EntregasService,
        private MessageService: MessageService
    ) {}

    ngOnInit() {
        this.getEntregasMes();
    }

    getEntregasMes() {
        if (this.escuela) {
            this.filtro.escuela = this.escuela;
        }
        this.entregasService.getEntregasMes(this.filtro).subscribe({
            next: (data) => {
                const labels = data.map((d) => d.mes);
                const values = data.map((d) => d.total);
                this.basicData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Entregas por mes',
                            backgroundColor: '#42A5F5',
                            data: values
                        }
                    ]
                };

                this.basicOptions = {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text: 'Entregas por mes'
                        }
                    }
                };
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
