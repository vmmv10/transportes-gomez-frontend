import { Component, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { OrdenesServiciosService } from '../../services/ordenes-servicios.service';
import { Escuela } from '../../../escuelas/models/escuela.models';
import { OrdenServicioFiltro } from '../../models/orden-servicio-filtro.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-ordenes-servicios-items-despachados-chart',
    imports: [ChartModule, FormsModule],
    templateUrl: './ordenes-servicios-items-despachados-chart.component.html',
    styleUrl: './ordenes-servicios-items-despachados-chart.component.scss'
})
export class OrdenesServiciosItemsDespachadosChartComponent {
    @Input() escuela: string | undefined;
    @Input() filtro: OrdenServicioFiltro = new OrdenServicioFiltro();
    basicData: any;
    basicOptions: any;
    constructor(private ordenesServiciosService: OrdenesServiciosService) {}

    ngOnInit() {
        this.getData();
    }

    getData() {
        if (this.escuela) {
            this.filtro.escuela = new Escuela();
            this.filtro.escuela.id = Number(this.escuela);
        }
        this.ordenesServiciosService.getTopItems(this.filtro).subscribe({
            next: (data) => {
                const labels = data.map((d) => d.titulo);
                const values = data.map((d) => d.total);
                this.basicData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Top Artículos Despachados',
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
                                text: 'Cantidad de Artículos Despachados',
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
                            text: 'Cantidad de Artículos Despachados',
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
            error: (error) => {}
        });
    }
}
