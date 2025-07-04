import { Component } from '@angular/core';
import { RutasService } from '../../services/rutas.service';
import { Entrega } from '../../../entregas/models/entrega.models';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EntregasButtonRecepcionComponent } from '../../../entregas/components/entregas-button-recepcion/entregas-button-recepcion.component';
import { Ruta } from '../../models/ruta.model';
import { TableModule } from 'primeng/table';

@Component({
  standalone: true,
  selector: 'app-rutas-actual',
  imports: [CommonModule, ButtonModule, EntregasButtonRecepcionComponent, TableModule],
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

}
