import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { MessageService, MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { Page } from '../../../uikit/models/page.model';
import { TagModule } from 'primeng/tag';
import { Entrega } from '../../models/entrega.models';
import { EntregaFiltro } from '../../models/entrega-filtro.models';
import { EntregasService } from '../../services/entregas.service';

@Component({
    standalone: true,
    selector: 'app-entregas-table',
    imports: [CommonModule, TableModule, TagModule, ButtonModule, FormsModule, InputTextModule, RouterModule, ToastModule, TooltipModule, ModalLoadingComponent],
    templateUrl: './entregas-table.component.html',
    styleUrl: './entregas-table.component.scss',
    providers: [MessageService]
})
export class EntregasTableComponent {
    @Input() filtro: EntregaFiltro = new EntregaFiltro();
    @Input() filtros: boolean = false;
    @Input() ruta: boolean = false;
    entregas!: Page<Entrega>;
    entrega: Entrega | undefined;
    tok: string = '';
    breadcrumb: MenuItem[] = [];
    loading: boolean = true;
    visible: boolean = false;

    constructor(
        private entregasService: EntregasService,
        private MessageService: MessageService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Entregas', routerLink: '/entregas' }
        ];
    }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.loading = true;
        this.entregasService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.entregas = data;
                this.loading = false;
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los Documentos' });
                this.loading = false;
                console.error('Error fetching entregas:', error);
            }
        });
    }
}
