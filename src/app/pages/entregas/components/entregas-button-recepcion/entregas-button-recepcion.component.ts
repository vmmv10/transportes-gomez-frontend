import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { EntregasService } from '../../services/entregas.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { Imagen } from '../../../uikit/models/imagen.model';
import { PrimeNG } from 'primeng/config';
import { ImagenesService } from '../../../uikit/services/imagenes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entregas-button-recepcion',
  imports: [ButtonModule, ConfirmDialogModule, ModalLoadingComponent, FileUploadModule, BadgeModule, CommonModule],
  templateUrl: './entregas-button-recepcion.component.html',
  styleUrl: './entregas-button-recepcion.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class EntregasButtonRecepcionComponent {
  @Input() entregaId!: string;
  @Output() onRecepcionada = new EventEmitter<void>();
  loading: boolean = false;
  imagenes: Imagen[] = [];
  totalSizePercent: number = 0;
  imagenSeleccionada: Imagen | undefined;
  files: any[] = [];
  totalSize: number = 0;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private entregasService: EntregasService,
    private config: PrimeNG,
    private imagenesService: ImagenesService
  ) {}

  confirmarRecepcion() {
    this.confirmationService.confirm({
      header: 'Confirmar Recepción',
      key: 'cRecepcion',
      accept: () => {
        this.loading = true;
        this.entregasService.entregaRecepcionada(this.entregaId, this.files).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Entrega recepcionada correctamente.' });
            this.loading = false;
            this.onRecepcionada.emit();
          },
          error: (error) => {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo recepcionar la entrega.' });
            console.error('Error al recepcionar la entrega:', error);
          }
        });
      }
    });
  }

  choose(event: any, callback: any) {
        callback();
    }

    onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
        removeFileCallback(event, index);
        this.totalSize -= parseInt(this.formatSize(file.size));
        this.totalSizePercent = this.totalSize / 10;
    }

    onClearTemplatingUpload(clear: any) {
        clear();
        this.totalSize = 0;
        this.totalSizePercent = 0;
    }

    onTemplatedUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    }

    onSelectedFiles(event: any) {
        this.files = event.currentFiles;
        this.files.forEach((file) => {
            this.totalSize += parseInt(this.formatSize(file.size));
        });
        this.totalSizePercent = this.totalSize / 10;
    }

    uploadEvent(callback: any) {
        callback();
    }

    formatSize(bytes: any) {
        const k = 1024;
        const dm = 3;
        const sizes = this.config.translation?.fileSizeTypes ?? ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) {
            return `0 ${sizes.length > 0 ? sizes[0] : 'Bytes'}`;
        }

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

        return `${formattedSize} ${sizes[i]}`;
    }

    onImagenChange(event: any) {
        const index = event.index;
        this.imagenSeleccionada = this.imagenes[index];
    }

    async getImagenes(id: string) {
        try {
            const data = await this.imagenesService.getImagenes(1, Number(id)).toPromise();
            this.imagenes = data ?? [];
            if (this.imagenes.length > 0) {
                this.imagenSeleccionada = this.imagenes[0];
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las imágenes de la orden' });
        }
    }

    handleFotoTomada(file: File) {
        const newImage = new Imagen();
        newImage.id = 'temp-' + Date.now();
        newImage.nombreOriginal = file.name;
        newImage.ruta = URL.createObjectURL(file);
        newImage.itemImageSrc = newImage.ruta;
        newImage.thumbnailImageSrc = newImage.ruta;
        newImage.alt = 'Imagen tomada';
        newImage.title = 'Imagen tomada';

        this.imagenes.push(newImage);
        this.imagenSeleccionada = newImage;
    }
}
