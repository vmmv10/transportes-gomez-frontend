import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Marca } from '../../models/marca.model';
import { MarcasService } from '../../services/marcas.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-marcas-select',
  imports: [FormsModule, CommonModule, SelectModule, SkeletonModule],
  templateUrl: './marcas-select.component.html',
  styleUrl: './marcas-select.component.scss',
  standalone: true,
  providers: [MessageService]
})
export class MarcasSelectComponent {
  @Input() marca: Marca | undefined;
  @Output() marcaChange = new EventEmitter<Marca>();
  @Input() showClear: boolean = false;
  @Input() validar: boolean = false;
  @Input() showFilter: boolean = false;

  marcas: Marca[] = [];
  loading: boolean = true;

  constructor(
      private marcasServices: MarcasService,
      private messageService: MessageService
  ) {}

  async ngOnInit(): Promise<void> {
      this.loading = true;
      await this.getData();
      this.loading = false;
  }

  async getData() {
      try {
          this.loading = true;
          const marcas = await this.marcasServices.getAllList().toPromise();
          this.marcas = marcas || [];
      } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener marcas' });
          console.error('Error fetching marcas:', error);
      } finally {
          this.loading = false;
      }
  }

  onChangeSelect(marca: Marca) {
      this.marcaChange.emit(marca);
  }
}
