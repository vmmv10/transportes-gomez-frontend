import { Component, Input } from '@angular/core';
import { OrdenesServiciosService } from '../../services/ordenes-servicios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { OrdenServicioFiltro } from '../../models/orden-servicio-filtro.model';
import { OrdenServicio } from '../../models/orden-servicio.model';
import { Page } from '../../../uikit/models/page.model';
import { PaginatorModule } from 'primeng/paginator';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { EscuelasSelectComponent } from '../../../escuelas/components/escuelas-select/escuelas-select.component';
import { OrdenServicioDetalle } from '../../models/orden-servicio-detalle.model';
import { ItemsAutocompleteComponent } from '../../../items/components/items-autocomplete/items-autocomplete.component';
import { SelectBooleanComponent } from '../../../uikit/components/select-boolean/select-boolean.component';

@Component({
  selector: 'app-ordenes-servicios-items',
  imports: [
    CommonModule,
        TableModule,
        ButtonModule,
        FormsModule,
        InputTextModule,
        RouterModule,
        ToastModule,
        TooltipModule,
        ModalLoadingComponent,
        TagModule,
        ConfirmDialogModule,
        PaginatorModule,
        TableMobileComponent,
        EscuelasSelectComponent,
        ItemsAutocompleteComponent,
        SelectBooleanComponent
  ],
  templateUrl: './ordenes-servicios-items.component.html',
  styleUrl: './ordenes-servicios-items.component.scss',
  providers: [MessageService, ConfirmationService],
  standalone: true
})
export class OrdenesServiciosItemsComponent {
    @Input() filtro: OrdenServicioFiltro = new OrdenServicioFiltro();
    @Input() filtros: boolean = true;
    ordenes!: Page<OrdenServicioDetalle>;
    orden: OrdenServicio | undefined;
    loading: boolean = false;
   
    campos: any[] = [
        { etiqueta: 'Establecimiento', propiedad: 'escuela', tipo: 'texto' },
        { etiqueta: 'Artículo', propiedad: 'nombre', tipo: 'texto' },
        { etiqueta: 'Cantidad', propiedad: 'cantidad', tipo: 'numero' },
    ];

    opcionesSelectBoolean: { label: string; value: boolean }[] = [
        { label: 'Entregado', value: true },
        { label: 'No Entregado', value: false }
    ];

    constructor(
        private ordenesServiciosService: OrdenesServiciosService,
        private MessageService: MessageService,
    ) {}

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.loading = true;
        this.ordenesServiciosService.getItems(this.filtro).subscribe({
            next: (data) => {
                this.ordenes = data;
                this.loading = false;
            },
            error: (error) => {
                this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener Items' });
                this.loading = false;
                console.error('Error fetching ordenes:', error);
            }
        });
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    selectedItem(item: any) {
        this.filtro.item = item;
        this.getData();
    }
}
