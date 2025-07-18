import { Component, Input } from '@angular/core';
import { EntregaFiltro } from '../../models/entrega-filtro.models';
import { EntregasService } from '../../services/entregas.service';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-entregas-count',
    imports: [CommonModule],
    templateUrl: './entregas-count.component.html',
    styleUrl: './entregas-count.component.scss'
})
export class EntregasCountComponent {
    @Input() tipo: string = 'Totales';
    @Input() filtro: EntregaFiltro = new EntregaFiltro();
    cantidad: number = 0;
    loading: boolean = false;

    constructor(private entregaService: EntregasService) {}

    ngOnInit() {
        switch (this.tipo) {
            case 'Activas':
                this.filtro.entregado = false;
                break;
            case 'Realizadas':
                this.filtro.entregado = true;
                break;
            default:
                this.filtro.entregado = undefined;
                break;
        }
        this.getCount();
    }

    getCount() {
        this.loading = true;
        this.entregaService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.cantidad = data.totalElements;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al obtener el conteo de entregas:', error);
                this.loading = false;
            }
        });
    }
}
