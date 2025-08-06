import { Component } from '@angular/core';
import { OrdenServicio } from '../../models/orden-servicio.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Imagen } from '../../../uikit/models/imagen.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { ImagenesService } from '../../../uikit/services/imagenes.service';
import { OrdenesServiciosService } from '../../services/ordenes-servicios.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { GalleriaModule } from 'primeng/galleria';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { DocumentosService } from '../../../documentos/services/documentos.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Documento } from '../../../documentos/models/documento.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { OrdenServicioDetalle } from '../../models/orden-servicio-detalle.model';
import { DocumentosModalSelectComponent } from '../../../documentos/components/documentos-modal-select/documentos-modal-select.component';
import { EscuelasSelectComponent } from '../../../escuelas/components/escuelas-select/escuelas-select.component';
import { DocumentosTiposService } from '../../../documentos/services/documentos-tipos.service';
import { BodegasSelectComponent } from '../../../bodegas/components/bodegas-select/bodegas-select.component';
import { AutocompleteSelectComponent } from '../../../inventario/components/autocomplete-select/autocomplete-select.component';
import { SaldoBodegaFiltro } from '../../../inventario/models/saldo-bodega-filtro.model';
import { SaldoBodegaService } from '../../../inventario/services/saldo-bodega.service';

@Component({
    standalone: true,
    selector: 'app-ordenes-servicios-form',
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
        ConfirmDialogModule,
        ModalLoadingComponent,
        ConfirmDialogModule,
        EscuelasSelectComponent,
        InputGroupModule,
        InputGroupAddonModule,
        InputNumberModule,
        PanelModule,
        TableModule,
        TextareaModule,
        DialogModule,
        DocumentosModalSelectComponent,
        BodegasSelectComponent,
        AutocompleteSelectComponent
    ],
    templateUrl: './ordenes-servicios-form.component.html',
    styleUrl: './ordenes-servicios-form.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class OrdenesServiciosFormComponent {
    orden: OrdenServicio = new OrdenServicio();
    menus: MenuItem[] = [];
    files: any[] = [];
    totalSize: number = 0;
    imagenes: Imagen[] = [];
    totalSizePercent: number = 0;
    imagenSeleccionada: Imagen | undefined;
    loading: boolean = false;
    validar: boolean = false;
    documento: Documento = new Documento();
    displayItem: boolean = false;
    detalle: OrdenServicioDetalle = new OrdenServicioDetalle();
    filtroSaldoBodega: SaldoBodegaFiltro = new SaldoBodegaFiltro();
    visibleItem: boolean = false;
    displayConfirmacion: boolean = false;
    indexDetalle: number = -1;

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
        private config: PrimeNG,
        private imagenesService: ImagenesService,
        private confirmationService: ConfirmationService,
        private ordenesServiciosService: OrdenesServiciosService,
        private documentosService: DocumentosService,
        private router: Router,
        private documentosTiposService: DocumentosTiposService,
        private saldoBodegaService: SaldoBodegaService
    ) {
        this.menus = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Ordenes de Servicios', routerLink: '/ordenes-servicios' },
            { label: 'Formulario', routerLink: '/ordenes-servicios/formulario' }
        ];
    }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        const doc = this.route.snapshot.paramMap.get('documento');
        const tipo = this.route.snapshot.paramMap.get('tipo');
        if (id) {
            this.loading = true;
            await this.getOrden(id);
            await this.getImagenes(id);
            this.loading = false;
        }
        if (tipo !== null && doc !== null) {
            this.documentosTiposService.getTipoDocumentoBySii(tipo).subscribe({
                next: (tipoDoc) => {
                    this.documento.tipo = tipoDoc;
                    this.documento.numero = Number(doc);
                    this.getDocumento();
                    this.orden.bodega = {
                        id: 1,
                        nombre: 'Principal',
                        direccion: 'Castro'
                    };
                },
                error: (error) => {
                    console.error('Error fetching document type:', error);
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el tipo de documento' });
                }
            });
        }
    }

    async getOrden(id: string) {
        try {
            const data = await this.ordenesServiciosService.get(id).toPromise();
            if (data) {
                this.orden = data;
            }
        } catch (error) {
            console.error('Error fetching orden:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el orden' });
        }
    }

    documentoChange(Documento: Documento) {
        if (this.documento) {
            this.documento = Documento;
            this.getDocumento();
        }
    }

    getDocumento() {
        if (this.documento.tipo && this.documento.numero) {
            this.loading = true;
            this.documentosService.getByNumeroAndTipo(this.documento.numero.toString(), this.documento.tipo.codigo).subscribe({
                next: (data) => {
                    if (data) {
                        this.orden.documento = data;
                        this.documento = data;
                        if (data.escuela) {
                            this.orden.documento.escuela = data.escuela;
                        }
                    } else {
                        this.messageService.add({ severity: 'info', summary: 'Información', detail: 'Documento no encontrado' });
                    }
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error fetching documento:', error);
                    this.loading = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el documento' });
                }
            });
        }
    }

    guardar() {
        this.validar = true;
        if (this.orden.detalles.length === 0 || !this.orden.escuela) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe completar los campos obligatorios' });
            return;
        }
        this.validar = false;
        this.loading = true;
        if (this.orden.id) {
            this.ordenesServiciosService.update(this.orden, this.files).subscribe({
                next: (data) => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden de Servicio actualizada' });
                    this.loading = false;
                    this.ngOnInit();
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la Orden de Servicio' });
                    console.error('Error updating orden:', error);
                    this.loading = false;
                }
            });
        } else {
            this.ordenesServiciosService.create(this.orden).subscribe({
                next: (data) => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Orden de Servicio creada' });
                    this.loading = false;
                    this.router.navigate(['/ordenes-servicios']);
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la Orden de Servicio' });
                    console.error('Error creating orden:', error);
                    this.loading = false;
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

    confirmarEliminar(id: string) {
        this.confirmationService.confirm({
            message: '¿Desea desactivar el item ?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.eliminarImagen(id)
        });
    }

    eliminarImagen(id: string) {
        if (this.imagenSeleccionada) {
            this.imagenesService.delete(id).subscribe({
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

    agregarFila() {
        if (this.orden.bodega && this.orden.bodega.id === 4) {
            this.displayItem = true;
        }
        if (this.orden.bodega && this.orden.bodega.id !== 4) {
            this.visibleItem = true;
            this.filtroSaldoBodega.bodega = this.orden.bodega;
        }
    }

    guardarDetalle() {
        if (!this.detalle.nombre || !this.detalle.cantidad) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe completar todos los campos del detalle' });
            return;
        }
        if (this.orden.bodega && this.orden.bodega.id !== 4) {
            if (this.detalle.saldoBodega && this.detalle.cantidad > this.detalle.saldoBodega.saldo) {
                this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'La cantidad no puede ser mayor al saldo disponible' });
                return;
            }
        }
        if (!this.orden.detalles) {
            this.orden.detalles = [];
        }
        if (this.orden.bodega && this.orden.bodega.id !== 4) {
            let existeItem = this.orden.detalles.some((d) => d.saldoBodega?.item.id === this.detalle.saldoBodega?.item.id);
            if (existeItem) {
                this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El item ya existe en la orden de servicio' });
                return;
            }
        }
        if (this.indexDetalle !== -1) {
            this.orden.detalles[this.indexDetalle] = { ...this.detalle };
            this.indexDetalle = -1;
        } else {
            this.orden.detalles.push({ ...this.detalle });
        }
        if (this.orden.bodega && this.orden.bodega.id === 4) {
            this.cerrardialogItem();
        }
        if (this.orden.bodega && this.orden.bodega.id !== 4) {
            this.visibleItem = false;
        }
        this.detalle = new OrdenServicioDetalle();
        this.indexDetalle = -1;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Detalle agregado correctamente' });
    }

    cerrardialogItem() {
        this.displayItem = false;
        this.indexDetalle = -1;
        this.detalle = new OrdenServicioDetalle();
    }

    cerrarVistaItem() {
        this.visibleItem = false;
        this.indexDetalle = -1;
        this.detalle = new OrdenServicioDetalle();
    }

    async editarDetalle(index: number) {
        this.detalle = { ...this.orden.detalles[index] };
        this.indexDetalle = index;
        if (this.orden.bodega && this.orden.bodega.id === 4) {
            this.displayItem = true;
        }
        if (this.orden.bodega && this.orden.bodega.id !== 4) {
            this.visibleItem = true;
            this.filtroSaldoBodega.bodega = this.orden.bodega;
            this.loading = true;
            await this.buscarSaldoBodega();
            this.loading = false;
        }
    }

    async buscarSaldoBodega() {
        try {
            console.log('Buscando saldo bodega con filtro:', this.detalle);
            if (this.orden.bodega && this.orden.bodega.id && this.detalle.saldoBodega?.item.id) {
                const saldo = await this.saldoBodegaService.getByBodegaAndCodigo(this.orden.bodega.id, this.detalle.saldoBodega?.item.id).toPromise();
                if (saldo) {
                    saldo.saldo = saldo.saldo + this.detalle.cantidad;
                }
                this.detalle.saldoBodega = saldo;
                console.log('Saldo bodega encontrado:', this.detalle);
            }
        } catch (error) {
            console.error('Error fetching saldo bodega:', error);
        }
    }

    obtenerPdf() {
        this.loading = true;
        this.ordenesServiciosService.generarPdf(this.orden.id.toString()).subscribe({
            next: (data) => {
                const blob = new Blob([data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `OrdenServicio_${this.orden.id}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el PDF' });
                console.error('Error fetching PDF:', error);
                this.loading = false;
            }
        });
    }

    descargarPdfVerificacion(ruta: string) {
        const url = ruta;
        const a = document.createElement('a');
        a.href = url;
        a.download = ''; // El nombre lo pone el navegador o el servidor
        a.target = '_blank';
        a.click();
    }

    saldoSeleccionado(saldo: any) {
        if (saldo) {
            this.detalle.saldoBodega = saldo;
            this.detalle.nombre = saldo.item.nombre;
        }
    }

    confirmarGuardar() {
        if (this.orden.detalles.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Debe agregar al menos un detalle a la orden de servicio' });
            return;
        }
        if (this.orden && this.orden.bodega && this.orden.bodega.id === 4) {
            this.confirmationService.confirm({
                message: '¿Está seguro de que desea guardar los cambios?',
                accept: () => {
                    this.guardar();
                },
                key: 'cGuardar'
            });
        } else {
            this.displayConfirmacion = true;
        }
    }

    cerrardialogConfirmacion() {
        this.displayConfirmacion = false;
    }

    confirmarEliminarDetalle(detalle: OrdenServicioDetalle) {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea eliminar este detalle?',
            accept: async () => {
                if (this.orden.id > 0) {
                    this.loading = true;
                    await this.eliminarDetalle(detalle);
                    this.loading = false;
                } else {
                    if (this.orden.documento && this.orden.documento.id > 0) {
                        this.orden.detalles = this.orden.detalles.filter((d) => d.nombre !== detalle.nombre);
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Detalle eliminado correctamente' });
                    } else {
                        this.orden.detalles.forEach((d, index) => {
                            if (d.saldoBodega?.item.id === detalle.saldoBodega?.item.id) {
                                console.log('Detalle encontrado para eliminar:', d);
                                this.orden.detalles.splice(index, 1);
                            }
                        });
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Detalle eliminado correctamente' });
                    }
                }
            },
            key: 'cEliminarDetalle'
        });
    }

    async eliminarDetalle(detalle: OrdenServicioDetalle) {
        try {
            await this.ordenesServiciosService.deleteDetalle(detalle.id).toPromise();
            const index = this.orden.detalles.indexOf(detalle);
            if (index > -1) {
                this.orden.detalles.splice(index, 1);
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Detalle eliminado correctamente' });
            }
        } catch (error) {
            console.error('Error deleting detalle:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el detalle' });
        }
    }
}
