import { Component, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { altoHorizontal, datasetBarras, opcionesBarras } from '../../../uikit/charts/chart-theme';
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
    altura: string = '12rem';
    constructor(private ordenesServiciosService: OrdenesServiciosService) {}

    ngOnInit() {
        this.getData();
    }

    ngOnChanges() {
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
                    labels,
                    datasets: [datasetBarras('Despachados', values, true)]
                };
                this.altura = altoHorizontal(labels.length);
                this.basicOptions = opcionesBarras({ horizontal: true, unidad: 'despachados', maxEtiqueta: 24 });
            },
            error: (error) => {}
        });
    }
}
