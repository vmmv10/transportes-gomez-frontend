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
        FechaPipe
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

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private rutasService: RutasService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Rutas', routerLink: '/rutas' }
        ];
    }

    ngOnInit() {
        this.getData();
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
}
