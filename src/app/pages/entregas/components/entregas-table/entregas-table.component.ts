import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { Page } from '../../../uikit/models/page.model';
import { TagModule } from 'primeng/tag';
import { Entrega } from '../../models/entrega.models';
import { EntregaFiltro } from '../../models/entrega-filtro.models';
import { EntregasService } from '../../services/entregas.service';
import { SelectBooleanComponent } from '../../../uikit/components/select-boolean/select-boolean.component';
import { PaginatorModule } from 'primeng/paginator';
import { ProveedorSelectComponent } from '../../../proveedor/components/proveedor-select/proveedor-select.component';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import e from 'cors';

@Component({
    standalone: true,
    selector: 'app-entregas-table',
    imports: [CommonModule, ButtonModule, TableMobileComponent, ProveedorSelectComponent, PaginatorModule, SelectBooleanComponent, TableModule, TagModule, ButtonModule, FormsModule, InputTextModule, RouterModule, ToastModule, TooltipModule, ModalLoadingComponent],
    templateUrl: './entregas-table.component.html',
    styleUrl: './entregas-table.component.scss',
    providers: [MessageService]
})
export class EntregasTableComponent {
    @Input() filtro: EntregaFiltro = new EntregaFiltro();
    @Input() filtros: boolean = false;
    @Input() ruta: boolean = false;
    @Input() proveedor: boolean = false;
    @Input() documento: boolean = false;
    @Input() escuela: boolean = false;
    entregas!: Page<Entrega>;
    entrega: Entrega | undefined;
    tok: string = '';
    loading: boolean = false;

    campos: any[] = [
        { etiqueta: 'Orden de Servicio', propiedad: 'ordenServicio.id', tipo: 'objeto' },
        { etiqueta: 'Documento', propiedad: 'ordenServicio.documento.numero', tipo: 'objeto' },
        { etiqueta: 'Proveedor', propiedad: 'ordenServicio.documento.proveedor.nombre', tipo: 'objeto' },
        { etiqueta: 'Escuela', propiedad: 'ordenServicio.escuela.nombre', tipo: 'objeto' },
        { etiqueta: 'Comuna', propiedad: 'ordenServicio.escuela.comuna', tipo: 'objeto' },
        { etiqueta: 'Estado', propiedad: 'entregado', tipo: 'tag' },
    ];

    acciones = [
        {
            tooltip: 'Ver Ruta',
            icono: 'pi pi-eye',
            color: 'success',
            tipo: 'link',
            ruta: '/rutas/formulario/',
            rutaConId: true,
            label: 'Ver Ruta',
            outlined: true
        },
    ];

    constructor(
        private entregasService: EntregasService,
        private MessageService: MessageService
    ) {}

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

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }
}
