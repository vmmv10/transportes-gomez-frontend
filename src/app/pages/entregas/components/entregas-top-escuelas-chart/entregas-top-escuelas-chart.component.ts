import { Component, Input } from '@angular/core';
import { EntregasService } from '../../services/entregas.service';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { EntregaFiltro } from '../../models/entrega-filtro.models';
import { Escuela } from '../../../escuelas/models/escuela.models';
@Component({
    selector: 'app-entregas-top-escuelas-chart',
    imports: [ChartModule],
    templateUrl: './entregas-top-escuelas-chart.component.html',
    styleUrl: './entregas-top-escuelas-chart.component.scss',
    providers: [MessageService],
    standalone: true
})
export class EntregasTopEscuelasChartComponent {
    @Input() escuela: string | undefined;
    filtro: EntregaFiltro = new EntregaFiltro();
    basicData: any;
    basicOptions: any;
    constructor(
        private entregasService: EntregasService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getData();
    }

    getData() {
        if (this.escuela) {
            this.filtro.escuela = new Escuela();
            this.filtro.escuela.id = Number(this.escuela);
        }
        this.entregasService.getTopEscuelas(this.filtro).subscribe({
            next: (data) => {
                const labels = data.map((d) => d.titulo);
                const values = data.map((d) => d.total);
                this.basicData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Entregas por mes',
                            backgroundColor: '#50E3C2',
                            data: values
                        }
                    ]
                };

                this.basicOptions = {
                    responsive: true,
                    indexAxis: 'y',
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Cantidad de Entregas',
                                color: '#333',
                                font: { size: 14, weight: 'bold' }
                            },
                            ticks: {
                                stepSize: 1,
                                color: '#555',
                                font: { size: 12 },
                                callback: function (value: any) {
                                    return Number.isInteger(value) ? value : '';
                                }
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
                            text: 'Entregas por Escuela',
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
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error al cargar datos',
                    detail: 'No se pudieron cargar los datos de entregas por mes.'
                });
            }
        });
    }
}
