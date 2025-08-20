import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Page } from '../../../uikit/models/page.model';
import { Ruta } from '../../models/ruta.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TagModule } from 'primeng/tag';
import { RutasService } from '../../services/rutas.service';
import { RutaFiltro } from '../../models/ruta-filtro.model';
import { PaginatorModule } from 'primeng/paginator';
import { FechaPipe } from '../../../uikit/pipe/fecha';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { InputTextModule } from 'primeng/inputtext';
import { UsuariosSelectComponent } from '../../../usuarios/components/usuarios-select/usuarios-select.component';
import { Observable } from 'rxjs';
import { RolService } from '../../../uikit/services/rol.service';
import { firstValueFrom } from 'rxjs';

@Component({
    standalone: true,
    selector: 'app-rutas',
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        BreadcrumbModule,
        RouterModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
        TooltipModule,
        ModalLoadingComponent,
        TagModule,
        ConfirmDialogModule,
        PaginatorModule,
        FechaPipe,
        TableMobileComponent,
        InputTextModule,
        UsuariosSelectComponent
    ],
    templateUrl: './rutas.component.html',
    styleUrl: './rutas.component.scss',
    providers: [ConfirmationService, MessageService]
})
export class RutasComponent {
    breadcrumb: MenuItem[] = [];
    loading: boolean = false;
    data!: Page<Ruta>;
    filtro: RutaFiltro = new RutaFiltro();
    esAdmin$!: Observable<boolean>;
    esConductor$!: Observable<boolean>;
    esConductor: boolean = false;

    campos: any[] = [
        { etiqueta: 'Número', propiedad: 'id', tipo: 'texto' },
        { etiqueta: 'Fecha', propiedad: 'fecha', tipo: 'fecha' },
        { etiqueta: 'Chofer', propiedad: 'chofer.nombre', tipo: 'objeto' },
        { etiqueta: 'Estado', propiedad: 'estado', tipo: 'text' }
    ];
    acciones: any[] = [];

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private rutasService: RutasService,
        private rolService: RolService
    ) {
        this.esAdmin$ = this.rolService.tieneRol('Administrador');
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Rutas', routerLink: '/rutas' }
        ];
        this.acciones = [
            {
                tooltip: 'Editar',
                icono: 'pi pi-pencil',
                color: 'info',
                tipo: 'link',
                ruta: '/rutas/formulario/',
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
                deshabilitarSi: 'entregado',
                label: 'Eliminar',
                outlined: true
            }
        ];
    }

    async ngOnInit() {
        this.getData(); // se carga solo después de saber si es conductor
    }

    getData() {
        this.loading = true;
        this.rutasService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.data = data;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las Rutas' });
                this.loading = false;
                console.error('Error fetching rutas:', error);
            }
        });
    }

    eliminar(ruta: Ruta) {
        this.loading = true;
        this.rutasService.delete(ruta.id.toString()).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ruta eliminada correctamente' });
                this.getData();
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la ruta' });
                console.error('Error deleting ruta:', error);
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    confirmarEliminar(ruta: Ruta) {
        this.confirmationService.confirm({
            message: '¿Desea eliminar la ruta ' + ruta.id + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            key: 'eliminarRuta',
            accept: () => this.eliminar(ruta)
        });
    }

    onPageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    resolverAccion(event: { tipo: string; item: any }) {
        switch (event.tipo) {
            case 'eliminar':
                this.confirmarEliminar(event.item);
                break;
        }
    }
}
