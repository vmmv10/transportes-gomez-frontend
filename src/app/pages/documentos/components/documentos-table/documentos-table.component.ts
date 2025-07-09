import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DocumentoFiltro } from '../../models/documento-filtro.model';
import { Documento } from '../../models/documento.model';
import { Page } from '../../../uikit/models/page.model';
import { DocumentosService } from '../../services/documentos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImagenesService } from '../../../uikit/services/imagenes.service';
import { Imagen } from '../../../uikit/models/imagen.model';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DocumentosTipoSelectComponent } from '../documentos-tipo-select/documentos-tipo-select.component';
import { ProveedorSelectComponent } from '../../../proveedor/components/proveedor-select/proveedor-select.component';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-documentos-table',
  imports: [TableModule, PaginatorModule, ButtonModule, DocumentosTipoSelectComponent, ProveedorSelectComponent, InputTextModule, FormsModule, CommonModule, ButtonModule, TooltipModule, RouterLink, TableMobileComponent, ConfirmDialogModule, ModalLoadingComponent, ToastModule],
  templateUrl: './documentos-table.component.html',
  styleUrl: './documentos-table.component.scss',
  providers: [MessageService, ConfirmationService],
  standalone: true
})
export class DocumentosTableComponent {
  @Input() filtro: DocumentoFiltro = new DocumentoFiltro();
  @Input() filtros: boolean = false;
  @Input() tipo: boolean = false;
  @Input() proveedor: boolean = false;
  @Input() bodega: boolean = false;
  @Input() acciones: boolean = false;
  documentos!: Page<Documento>;
  documento: Documento | undefined;
  tok: string = '';
  loading: boolean = true;
  visible: boolean = false;
  imagenes: Imagen[] = [];
  imagenSeleccionada: Imagen | undefined;

  campos: any[] = [
      { etiqueta: 'Folio', propiedad: 'numero', tipo: 'texto' },
      {
          etiqueta: 'Tipo Documento',
          propiedad: 'tipo.nombre',
          tipo: 'objeto'
      },
      { etiqueta: 'Proveedor', propiedad: 'proveedor.nombre', tipo: 'objeto' },
      { etiqueta: 'Proveedor Rut', propiedad: 'proveedor.rut', tipo: 'objeto' },
      { etiqueta: 'Bodega', propiedad: 'bodega.nombre', tipo: 'objeto' },
  ];

  accionesDocumentos = [
      {
          tooltip: 'Editar',
          icono: 'pi pi-pencil',
          color: 'info',
          tipo: 'link',
          ruta: '/documents/formulario/',
          rutaConId: true,
          label: 'Editar',
          outlined: true
      },
      {
          tooltip: 'Eliminar',
          icono: 'pi pi-trash',
          color: 'warn',
          tipo: 'accion',
          accion: 'eliminar',
          deshabilitarSi: 'asignado',
          label: 'Eliminar',
          outlined: true
      },
      {
          tooltip: 'Ver PDF',
          icono: 'pi pi-file-pdf',
          color: 'danger',
          tipo: 'accion',
          accion: 'verPdf',
          label: ' PDF',
          outlined: true
      }
  ];

  constructor(
      private documentosService: DocumentosService,
      private MessageService: MessageService,
      private confirmationService: ConfirmationService,
      private imagenesService: ImagenesService
  ) {}

  ngOnInit() {
      this.getData();
  }

  pageChange(event: any) {
      this.filtro.page = event.page;
      this.filtro.size = event.rows;
      this.getData();
  }

  getData() {
      this.loading = true;
      this.documentosService.getAll(this.filtro).subscribe({
          next: (data) => {
              this.documentos = data;
              this.loading = false;
          },
          error: (error) => {
              this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los Documentos' });
              this.loading = false;
              console.error('Error fetching documentos:', error);
          }
      });
  }

  eliminar(documento: Documento) {
      this.loading = true;
      this.documentosService.delete(documento.id.toString()).subscribe({
          next: () => {
              this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Documento eliminado correctamente' });
              this.loading = false;
              this.getData();
          },
          error: (error) => {
              this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el documento' });
              console.error('Error deleting documento:', error);
              this.loading = false;
          }
      });
  }

  confirmarEliminar(documento: Documento) {
      this.confirmationService.confirm({
          message: '¿Desea eliminar el documento ' + documento.id + '?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          key: 'eliminarDoc',
          accept: () => this.eliminar(documento)
      });
  }

  async displayImagen(documento: Documento) {
      this.documento = documento;
      await this.getImagenes(documento);
      this.visible = true;
  }

  async getImagenes(documento: any) {
      this.loading = true;
      try {
          const data = await this.imagenesService.getImagenes(4, documento.id).toPromise();
          this.imagenes = data ?? [];
          if (this.imagenes.length > 0) {
              this.imagenSeleccionada = this.imagenes[0]; // Selecciona la primera imagen por defecto
              this.descargarPdf(this.imagenSeleccionada.itemImageSrc);
          } else {
              this.MessageService.add({ severity: 'info', summary: 'Información', detail: 'No se encontraron imágenes para este documento' });
          }
          this.loading = false;
      } catch (error) {
          this.loading = false;
          console.error('Error fetching images:', error);
          this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las imágenes del documento' });
      }
  }

  cerrarModal() {
      this.visible = false;
      this.imagenes = [];
      this.documento = undefined;
  }

  onImagenChange(event: any) {
      const index = event.index;
      this.imagenSeleccionada = this.imagenes[index];
  }

  descargarImagen() {
      if (!this.imagenSeleccionada) return;

      const url = this.imagenSeleccionada.itemImageSrc;
      const link = document.createElement('a');
      link.href = url;

      // Intentar obtener nombre de archivo desde URL
      const nombreArchivo = url.substring(url.lastIndexOf('/') + 1).split('?')[0];
      link.download = nombreArchivo || 'imagen-descargada';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }

  resolverAccion(event: { tipo: string; item: any }) {
      switch (event.tipo) {
          case 'eliminar':
              this.confirmarEliminar(event.item);
              break;
          case 'verPdf':
              this.getImagenes(event.item);
              break;
      }
  }

  descargarPdf(ruta: string) {
      const url = ruta;
      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      a.target = '_blank';
      a.click();
  }
}
