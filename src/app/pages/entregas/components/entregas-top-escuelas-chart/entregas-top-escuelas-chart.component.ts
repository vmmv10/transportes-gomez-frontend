import { Component, Input } from '@angular/core';
import { EntregasService } from '../../services/entregas.service';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';
import { altoHorizontal, datasetBarras, opcionesBarras } from '../../../uikit/charts/chart-theme';
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
    altura: string = '12rem';
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
                    labels,
                    datasets: [datasetBarras('Entregas', values, true)]
                };
                this.altura = altoHorizontal(labels.length);
                this.basicOptions = opcionesBarras({ horizontal: true, unidad: 'entregas', maxEtiqueta: 24 });
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
