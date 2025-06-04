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
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  standalone: true,
  selector: 'app-documentos',
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
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class DocumentosComponent {

  documentos!: Page<Documento>;
  documento: Documento | undefined;
  tok: string = '';
  filtro: DocumentoFiltro = new DocumentoFiltro();
  breadcrumb: MenuItem[] = [];
  loading: boolean = true;
  visible: boolean = false;

  constructor(
    private documentosService: DocumentosService,
    private MessageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.breadcrumb = [
      { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
      { label: 'Documentos', routerLink: '/documentos' },
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
      accept: () => this.eliminar(documento),
    });
  }

}
