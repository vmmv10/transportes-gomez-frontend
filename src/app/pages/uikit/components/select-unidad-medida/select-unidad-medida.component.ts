import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UnidadesMedidasService } from '../../services/unidades-medidas.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { UnidadMedida } from '../../models/unidad-medida.model';

@Component({
  standalone: true,
  selector: 'app-select-unidad-medida',
  imports: [
    SelectModule,
    FormsModule,
    CommonModule,
    SkeletonModule
  ],
  templateUrl: './select-unidad-medida.component.html',
  styleUrl: './select-unidad-medida.component.scss',
  providers: [MessageService]
})
export class SelectUnidadMedidaComponent {
  @Input() unidadMedida: UnidadMedida = new UnidadMedida();
  @Output() unidadMedidaChange = new EventEmitter<UnidadMedida>();
  @Input() showClear: boolean = false;
  @Input() validar: boolean = false;
  @Input() showFilter: boolean = false;


  unidades: UnidadMedida[] = [];
  loading: boolean = true;

  constructor(
    private unidadesMedidasService: UnidadesMedidasService,
    private messageService: MessageService
  ) {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.unidadesMedidasService.getAll().subscribe({
      next: (unidades) => {
        this.unidades = unidades;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener unidades de medida' });
        console.error('Error fetching unidades de medida:', error);
        this.loading = false;
      }
    });
  }

  onUnidadMedidaSeleccionada(unidad: UnidadMedida) {
    this.unidadMedida = unidad;
    this.unidadMedidaChange.emit(unidad);
  }
}
