import { Component } from '@angular/core';
import { Page } from '../../../uikit/models/page.model';
import { Documento } from '../../models/documento.model';
import { DocumentoFiltro } from '../../models/documento-filtro.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DocumentosService } from '../../services/documentos.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { GalleriaModule } from 'primeng/galleria';
import { ImagenesService } from '../../../uikit/services/imagenes.service';
import { Imagen } from '../../../uikit/models/imagen.model';
import { DialogModule } from 'primeng/dialog';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';

@Component({
    standalone: true,
    selector: 'app-documentos',
    imports: [
        CommonModule,
        TableModule,
        DialogModule,
        ButtonModule,
        FormsModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        BreadcrumbModule,
        RouterModule,
        ToastModule,
        ConfirmDialogModule,
        TooltipModule,
        GalleriaModule,
        ModalLoadingComponent,
        TableMobileComponent
    ],
    templateUrl: './documentos.component.html',
    styleUrl: './documentos.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class DocumentosComponent {
    documentos!: Page<Documento>;
    documento: Documento | undefined;
    tok: string = '';
    filtro: DocumentoFiltro = new DocumentoFiltro();
    breadcrumb: MenuItem[] = [];
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
        { etiqueta: 'Destino', propiedad: 'escuela.nombre', tipo: 'objeto' },
        { etiqueta: 'Comuna', propiedad: 'escuela.comuna', tipo: 'objeto' }
    ];

    accionesDocumentos = [
        {
            tooltip: 'Editar',
            icono: 'pi pi-pencil',
            color: 'info',
            tipo: 'link',
            ruta: '/documentos/formulario/',
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
        private documentosService: DocumentosService,
        private MessageService: MessageService,
        private confirmationService: ConfirmationService,
        private imagenesService: ImagenesService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Documentos', routerLink: '/documentos' }
        ];
    }

    ngOnInit() {
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
        console.log('Acción recibida:', event);
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
