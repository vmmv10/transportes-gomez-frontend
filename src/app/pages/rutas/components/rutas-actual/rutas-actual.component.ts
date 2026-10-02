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
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { mensajeError } from '../../../uikit/utils/error-mensaje';

@Component({
    standalone: true,
    selector: 'app-rutas-actual',
    imports: [CommonModule, FormsModule, InputNumberModule, ButtonModule, EntregasButtonRecepcionComponent, TableModule, ModalLoadingComponent, ConfirmDialogModule, ToastModule, AccordionModule],
    templateUrl: './rutas-actual.component.html',
    styleUrl: './rutas-actual.component.scss',
    providers: [ConfirmationService, MessageService]
})
export class RutasActualComponent {
    ruta: Ruta | undefined;
    entrega: Entrega | undefined;
    loading: boolean = false;
    kmSalida: number | null = null;

    constructor(
        private rutasService: RutasService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.cargarRuta();
    }

    cargarRuta() {
        this.loading = true;
        this.rutasService.getRutaHoy().subscribe({
            next: (data) => {
                if (data) {
                    this.ruta = data;
                    for (const entrega of data.entregas) {
                        if (!entrega.entregado) {
                            this.entrega = entrega;
                            break;
                        }
                    }
                } else {
                    this.ruta = undefined;
                    this.entrega = undefined;
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
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Entrega recepcionada correctamente.' });
        this.cargarRuta();
    }

    /** La ruta no ha comenzado: hay que registrar el odómetro de salida antes de entregar. */
    get sinComenzar(): boolean {
        return !!this.ruta && !this.ruta.enTransito && !this.ruta.inicio && this.ruta.estado !== 'FINALIZADA';
    }

    /** Comenzó sin odómetro (ej. antes de que fuera obligatorio). */
    get faltaKmSalida(): boolean {
        return !!this.ruta && !this.sinComenzar && this.ruta.estado !== 'FINALIZADA' && this.ruta.kmSalida == null;
    }

    comenzarRuta() {
        if (!this.ruta) {
            return;
        }
        if (this.kmSalida == null || this.kmSalida < 0) {
            this.messageService.add({ severity: 'warn', summary: 'Falta el kilometraje', detail: 'Ingresa el odómetro de salida del vehículo.' });
            return;
        }
        this.loading = true;
        const ruta = this.ruta;
        const peticion = this.sinComenzar
            ? this.rutasService.comenzarRuta(ruta.id, this.kmSalida)
            : this.rutasService.asignarKilometros({ id: ruta.id, kmSalida: this.kmSalida, kmLlegada: ruta.kmLlegada ?? null, kilometros: ruta.kilometros });
        peticion.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: this.sinComenzar ? 'Ruta comenzada' : 'Kilometraje de salida registrado' });
                this.kmSalida = null;
                this.cargarRuta();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'No se pudo comenzar la ruta') });
            }
        });
    }
}
