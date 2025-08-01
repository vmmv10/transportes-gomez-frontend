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
import { DialogModule } from 'primeng/dialog';
import { SelectUnidadMedidaComponent } from '../../../uikit/components/select-unidad-medida/select-unidad-medida.component';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { MarcasSelectComponent } from '../../../marcas/components/marcas-select/marcas-select.component';
import { CategoriasSelectComponent } from '../../../categorias/components/categorias-select/categorias-select.component';
import { PaginatorModule } from 'primeng/paginator';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { Marca } from '../../models/marca.model';
import { MarcaFiltro } from '../../models/marca-filtro.model';
import { Page } from '../../../uikit/models/page.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { MarcasService } from '../../services/marcas.service';

@Component({
    selector: 'app-marcas',
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
        TextareaModule,
        ToastModule,
        ConfirmDialogModule,
        TooltipModule,
        ModalLoadingComponent,
        PaginatorModule,
        TableMobileComponent
    ],
    templateUrl: './marcas.component.html',
    styleUrl: './marcas.component.scss',
    standalone: true,
    providers: [MessageService, ConfirmationService]
})
export class MarcasComponent {
    marcas!: Page<Marca>;
    marca: Marca | undefined = undefined;
    tok: string = '';
    filtro: MarcaFiltro = new MarcaFiltro();
    breadcrumb: MenuItem[] = [];
    loading: boolean = true;
    visible: boolean = false;

    campos: any[] = [
        { etiqueta: 'id', propiedad: 'id', tipo: 'texto' },
        { etiqueta: 'Nombre', propiedad: 'nombre', tipo: 'texto' },
    ];

    accionesItems = [
        {
            tooltip: 'Editar',
            icono: 'pi pi-pencil',
            color: 'info',
            tipo: 'accion',
            label: 'Editar',
            outlined: true
        },
        {
            tooltip: 'Desactivar',
            icono: 'pi pi-ban',
            color: 'warn',
            tipo: 'accion',
            accion: 'desactivar',
            label: 'Desactivar',
            outlined: true
        }
    ];

    constructor(
        private MessageService: MessageService,
        private confirmationService: ConfirmationService,
        private marcasService: MarcasService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Marcas', routerLink: '/marcas' }
        ];
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.filtro.activo = true;
        this.loading = true;
        this.marcasService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.marcas = data;
                this.loading = false;
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener Marcas' });
                this.loading = false;
                console.error('Error fetching marcas:', error);
            }
        });
    }

    displayFormulario() {
        this.visible = true;
        this.marca = new Marca();
    }

    desactivar(marca: Marca) {
        this.loading = true;
        this.marcasService.desactivate(marca.id).subscribe({
            next: () => {
                this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Marca desactivada correctamente' });
                this.loading = false;
                this.getData();
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al desactivar el marca' });
                console.error('Error deactivating marca:', error);
                this.loading = false;
            }
        });
    }

    async editar(marca: Marca) {
        this.loading = true;
        await this.get(marca.id);
        this.loading = false;
        this.visible = true;
    }

    async get(id: number) {
        try {
            this.marca = await this.marcasService.getById(id).toPromise();
            this.visible = true;
        } catch (error) {
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el marca' });
            console.error('Error fetching marca:', error);
        }
    }

    guardar() {
        if (this.marca) {
            this.loading = true;
            if (this.marca.id) {
                this.marcasService.update(this.marca).subscribe({
                    next: (updatedItem) => {
                        this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Marca actualizada correctamente' });
                        this.visible = false;
                        this.marca = undefined;
                        this.loading = false;
                        this.getData();
                    },
                    error: (error) => {
                        this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el marca' });
                        console.error('Error updating marca:', error);
                        this.loading = false;
                    }
                });
            } else {
                this.marcasService.create(this.marca).subscribe({
                    next: (newItem) => {
                        this.MessageService.add({ severity: 'success', summary: 'Éxito', detail: 'Marca creada correctamente' });
                        this.visible = false;
                        this.marca = undefined;
                        this.loading = false;
                        this.getData();
                    },
                    error: (error) => {
                        this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el marca' });
                        console.error('Error creating marca:', error);
                        this.loading = false;
                    }
                });
            }
        }
    }

    cerrarModal() {
        this.visible = false;
        this.marca = undefined;
    }

    confirmarDesactivar(marca: Marca) {
        this.confirmationService.confirm({
            message: '¿Desea desactivar el marca ' + marca.nombre + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.desactivar(marca),
            key: 'cDesactive'
        });
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    resolverAccion(event: { tipo: string; item: any }) {
        switch (event.tipo) {
            case 'editar':
                this.editar(event.item);
                break;
            case 'desactivar':
                this.confirmarDesactivar(event.item);
                break;
        }
    }
}
