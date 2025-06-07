import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Documento } from '../../models/documento.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DocumentosService } from '../../services/documentos.service';
import { FileUploadModule } from 'primeng/fileupload';
import { PrimeNG } from 'primeng/config';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { EscuelasSelectComponent } from '../../../escuelas/components/escuelas-select/escuelas-select.component';
import { ProveedorSelectComponent } from '../../../proveedor/components/proveedor-select/proveedor-select.component';
import { SelectModule } from 'primeng/select';
import { GalleriaModule } from 'primeng/galleria';
import { ImagenesService } from '../../../uikit/services/imagenes.service';
import { Imagen } from '../../../uikit/models/imagen.model';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DocumentosTipoSelectComponent } from '../documentos-tipo-select/documentos-tipo-select.component';

@Component({
    selector: 'app-documentos-form',
    imports: [
        CommonModule,
        ButtonModule,
        FormsModule,
        GalleriaModule,
        InputTextModule,
        BreadcrumbModule,
        RouterModule,
        ToastModule,
        FileUploadModule,
        BadgeModule,
        ProgressBarModule,
        TooltipModule,
        EscuelasSelectComponent,
        ProveedorSelectComponent,
        SelectModule,
        ConfirmDialogModule,
        DocumentosTipoSelectComponent
    ],
    templateUrl: './documentos-form.component.html',
    styleUrl: './documentos-form.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class DocumentosFormComponent {
    documento: Documento = new Documento();
    menus: MenuItem[] = [];
    files: any[] = [];
    totalSize: number = 0;
    imagenes: Imagen[] = [];
    totalSizePercent: number = 0;
    imagenSeleccionada: Imagen | undefined;
    loading: boolean = false;

    responsiveOptions: any[] = [
        {
            breakpoint: '1300px',
            numVisible: 4
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

    constructor(
        private route: ActivatedRoute,
        private messageService: MessageService,
        private documentosService: DocumentosService,
        private config: PrimeNG,
        private imagenesService: ImagenesService,
        private confirmationService: ConfirmationService
    ) {
        this.menus = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Documentos', routerLink: '/documentos' },
            { label: 'Formulario', routerLink: '/documentos/formulario' }
        ];
    }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loading = true;
            await this.getEscuela(id);
            await this.getImagenes(id);
            this.loading = false;
        }
    }

    async getEscuela(id: string) {
        try {
            const data = await this.documentosService.get(id).toPromise();
            if (data) {
                this.documento = data;
            } else {
                this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Documento no encontrado' });
            }
        } catch (error) {
            console.error('Error fetching documento:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el documento' });
        }
    }

    guardar() {
        if (!this.documento.tipo) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un tipo de documento' });
            return;
        }
        if (this.documento.id) {
            this.documentosService.update(this.documento, this.files).subscribe({
                next: (data) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Documento actualizado' });
                    this.ngOnInit();
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar Documento' });
                    console.error('Error updating documento:', error);
                }
            });
        } else {
            this.documentosService.create(this.documento, this.files).subscribe({
                next: (data) => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Documento creado' });
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear Documento' });
                    console.error('Error creating documento:', error);
                }
            });
        }
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
            const data = await this.imagenesService.getImagenes('Documento', Number(id)).toPromise();
            this.imagenes = data ?? [];
            if (this.imagenes.length > 0) {
                this.imagenSeleccionada = this.imagenes[0]; // Selecciona la primera imagen por defecto
            } else {
                this.messageService.add({ severity: 'info', summary: 'Información', detail: 'No se encontraron imágenes para este documento' });
            }
        } catch (error) {
            console.error('Error fetching images:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las imágenes del documento' });
        }
    }

    confirmarEliminar() {
        this.confirmationService.confirm({
            message: '¿Desea desactivar el item ?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.eliminarImagen()
        });
    }

    eliminarImagen() {
        if (this.imagenSeleccionada) {
            this.imagenesService.delete(this.imagenSeleccionada.id).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Imagen eliminada correctamente' });
                    this.imagenes = this.imagenes.filter((img) => img.id !== this.imagenSeleccionada?.id);
                    if (this.imagenes.length > 0) {
                        this.imagenSeleccionada = this.imagenes[0];
                    } else {
                        this.imagenSeleccionada = undefined;
                    }
                },
                error: (error) => {
                    console.error('Error deleting image:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la imagen' });
                }
            });
        } else {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'No hay imagen seleccionada para eliminar' });
        }
    }
}
