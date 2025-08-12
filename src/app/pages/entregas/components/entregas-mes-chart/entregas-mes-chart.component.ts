import { Component, Input } from '@angular/core';
import { EntregasService } from '../../services/entregas.service';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
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
                    labels: labels,
                    datasets: [
                        {
                            backgroundColor: '#42A5F5',
                            data: values,
                            label: 'Entregas por Mes'
                        }
                    ]
                };

                this.basicOptions = {
                    responsive: true,
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                color: '#333',
                                font: { size: 14, weight: 'bold' }
                            },
                            ticks: {
                                stepSize: 1,
                                color: '#555',
                                font: { size: 12 }
                            },
                            grid: { color: '#eee' }
                        },
                        y: {
                            ticks: { color: '#555', font: { size: 12 } },
                            grid: { color: '#f5f5f5' }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: '#333',
                                font: { size: 13 }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Entregas por Mes',
                            color: '#222',
                            font: { size: 18, weight: 'bold' },
                            padding: { bottom: 20 }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context: any) {
                                    return `${context.formattedValue} entregas`;
                                }
                            }
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
