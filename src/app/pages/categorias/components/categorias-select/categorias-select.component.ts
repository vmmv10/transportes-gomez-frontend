import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Categoria } from '../../models/categoria.model';
import { MessageService } from 'primeng/api';
import { CategoriasService } from '../../services/categorias.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-categorias-select',
  imports: [FormsModule, CommonModule, SelectModule, SkeletonModule],
  templateUrl: './categorias-select.component.html',
  styleUrl: './categorias-select.component.scss',
  standalone: true,
  providers: [MessageService]
})
export class CategoriasSelectComponent {
  @Input() categoria: Categoria | undefined;
  @Output() categoriaChange = new EventEmitter<Categoria>();
  @Input() showClear: boolean = false;
  @Input() validar: boolean = false;
  @Input() showFilter: boolean = false;

  categorias: Categoria[] = [];
  loading: boolean = true;

  constructor(
      private categoriasServices: CategoriasService,
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
          const categorias = await this.categoriasServices.getAllList().toPromise();
          this.categorias = categorias || [];
      } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener categorias' });
          console.error('Error fetching categorias:', error);
      } finally {
          this.loading = false;
      }
  }

  onChangeSelect(categoria: Categoria) {
      this.categoriaChange.emit(categoria);
  }
}
