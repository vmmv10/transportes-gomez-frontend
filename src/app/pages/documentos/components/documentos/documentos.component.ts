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
import { DialogModule } from 'primeng/dialog';
import { DocumentosTableComponent } from '../documentos-table/documentos-table.component';

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
        DocumentosTableComponent,
    ],
    templateUrl: './documentos.component.html',
    styleUrl: './documentos.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class DocumentosComponent {
    filtro: DocumentoFiltro = new DocumentoFiltro();
    breadcrumb: MenuItem[] = [];

    constructor(
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Documentos', routerLink: '/documentos' }
        ];
    }

}
