import { Component } from '@angular/core';
import { RutasService } from '../../services/rutas.service';
import { Entrega } from '../../../entregas/models/entrega.models';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EntregasButtonRecepcionComponent } from '../../../entregas/components/entregas-button-recepcion/entregas-button-recepcion.component';
import { Ruta } from '../../models/ruta.model';
import { TableModule } from 'primeng/table';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    standalone: true,
    selector: 'app-rutas-actual',
    imports: [CommonModule, ButtonModule, EntregasButtonRecepcionComponent, TableModule, ModalLoadingComponent, ConfirmDialogModule],
    templateUrl: './rutas-actual.component.html',
    styleUrl: './rutas-actual.component.scss',
    providers: [ConfirmationService, MessageService]
})
export class RutasActualComponent {
    ruta: Ruta | undefined;
    entrega: Entrega | undefined;
    loading: boolean = false;

    constructor(
        private rutasService: RutasService,
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit() {
        this.cargarRuta();
    }

    cargarRuta() {
        this.loading = true;
        this.rutasService.getRutaHoy().subscribe({
            next: (data) => {
                this.ruta = data;
                for (const entrega of data.entregas) {
                    if (!entrega.entregado) {
                        this.entrega = entrega;
                        break; // Solo necesitamos la primera entrega pendiente
                        
                    }
                }
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                console.error('Error al obtener la ruta del día:', error);
            }
        });
    }

    recepcionado() {
        this.cargarRuta();
    }

    comenzarRuta() {
        this.confirmationService.confirm({
            header: 'Confirmar Inicio de Ruta',
            key: 'cInicioRuta',
            accept: () => {
                if (this.ruta) {
            this.loading = true;
            this.rutasService.comenzarRuta(this.ruta.id).subscribe({
                next: (data) => {
                    this.ruta = data;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error al comenzar la ruta:', error);
                    this.loading = false;
                }
                });
            }
        }});
    }
}
