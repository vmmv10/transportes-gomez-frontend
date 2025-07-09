import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Page } from '../../../uikit/models/page.model';
import { Item } from '../../models/item.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ItemsService } from '../../services/items.service';
import { ItemFiltro } from '../../models/item-filtro.model';
import { DialogModule } from 'primeng/dialog';
import { SelectUnidadMedidaComponent } from '../../../uikit/components/select-unidad-medida/select-unidad-medida.component';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';

@Component({
  standalone: true,
  selector: 'app-items-lista',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    BreadcrumbModule,
    RouterModule,
    DialogModule,
    SelectUnidadMedidaComponent,
    TextareaModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    ModalLoadingComponent
  ],
  templateUrl: './items-lista.component.html',
  styleUrl: './items-lista.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class ItemsListaComponent {

  items!: Page<Item>;
  item: Item | undefined = undefined;
  tok: string = '';
  filtro: ItemFiltro = new ItemFiltro();
  breadcrumb: MenuItem[] = [];
  loading: boolean = true;
  visible: boolean = false;

  constructor(
    private itemService: ItemsService,
    private MessageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.breadcrumb = [
      { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
      { label: 'Items', routerLink: '/items' },
    ];
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.filtro.activo = true;
    this.loading = true;
    this.itemService.getAll(this.filtro).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (error) => {
        this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener Items' });
        this.loading = false;
        console.error('Error fetching items:', error);
      }
    });
  }

  displayFormulario() {
    this.visible = true;
    this.item = new Item();
  }

  eliminar(item: Item) {
    this.loading = true;
    this.itemService.delete(item.id.toString()).subscribe({
      next: () => {
        this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item eliminado correctamente' });
        this.loading = false;
        this.getData();
      },
      error: (error) => {
        this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el item' });
        console.error('Error deleting item:', error);
        this.loading = false;
      }
    });
  }

  desactivar(item: Item) {
    this.loading = true;
    this.itemService.desactivar(item.id.toString()).subscribe({
      next: () => {
        this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item desactivado correctamente' });
        this.loading = false;
        this.getData();
      },
      error: (error) => {
        this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al desactivar el item' });
        console.error('Error deactivating item:', error);
        this.loading = false;
      }
    });
  }

  async editar(item: Item) {
    this.loading = true;
    await this.get(item.id.toString());
    this.loading = false;
    this.visible = true;
  }

  async get(id: string) {
    try {
      this.item = await this.itemService.get(id).toPromise();
      this.visible = true;
    } catch (error) {
      this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el item' });
      console.error('Error fetching item:', error);
    }
  }

  guardar() {
    if (this.item) {
      if (this.item.id) {
        this.itemService.update(this.item).subscribe({
          next: (updatedItem) => {
            this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item actualizado correctamente' });
            this.visible = false;
            this.getData();
          },
          error: (error) => {
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el item' });
            console.error('Error updating item:', error);
          }
        });
      } else {
        this.itemService.create(this.item).subscribe({
          next: (newItem) => {
            this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item creado correctamente' });
            this.visible = false;
            this.getData();
          },
          error: (error) => {
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el item' });
            console.error('Error creating item:', error);
          }
        });
      }
    }
  }

  cerrarModal() {
    this.visible = false;
    this.item = undefined;
  }

  confirmarDesactivar(item: Item) {
    this.confirmationService.confirm({
      message: '¿Desea desactivar el item ' + item.nombre + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.desactivar(item),
    });
  }
}
