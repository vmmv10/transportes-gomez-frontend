import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Page } from '../../../uikit/models/page.model';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { MensajeContacto, MOTIVOS_MENSAJE, motivoMensaje } from '../../models/comercial.models';
import { ComercialService } from '../../services/comercial.service';

/** Mensajes del formulario de contacto de la página web. */
@Component({
    standalone: true,
    selector: 'app-mensaje-list',
    imports: [CommonModule, FormsModule, RouterModule, BreadcrumbModule, ButtonModule, PaginatorModule, SelectModule, SelectButtonModule, SkeletonModule, TagModule, ToastModule, TooltipModule],
    templateUrl: './mensaje-list.component.html',
    styleUrls: ['../../comercial.scss', './mensaje-list.component.scss'],
    providers: [MessageService]
})
export class MensajeListComponent implements OnInit {
    breadcrumb: MenuItem[] = [{ label: 'Home', icon: 'pi pi-home', routerLink: '/' }, { label: 'Comercial' }, { label: 'Mensajes web', routerLink: '/comercial/mensajes' }];
    loading = false;
    data: Page<MensajeContacto> | undefined;
    atendido: boolean | undefined = false;
    motivo: string | null = null;
    motivos = MOTIVOS_MENSAJE;
    motivoDe = motivoMensaje;
    page = 0;
    size = 20;
    opciones = [
        { label: 'Por atender', value: false },
        { label: 'Atendidos', value: true },
        { label: 'Todos', value: undefined }
    ];

    constructor(
        private comercialService: ComercialService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.getData();
    }

    getData() {
        this.loading = true;
        this.comercialService.getMensajes(this.atendido, this.page, this.size, this.motivo).subscribe({
            next: (d) => {
                this.data = d;
                this.loading = false;
            },
            error: (e) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(e, 'Error al obtener mensajes') });
            }
        });
    }

    filtrar() {
        this.page = 0;
        this.getData();
    }

    pageChange(e: any) {
        this.page = e.page;
        this.size = e.rows;
        this.getData();
    }

    marcar(m: MensajeContacto) {
        this.comercialService.marcarAtendido(m.id, !m.atendido).subscribe({
            next: () => this.getData(),
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(e, 'No se pudo actualizar') })
        });
    }

    iniciales(nombre: string | undefined): string {
        const partes = (nombre ?? '').trim().split(/\s+/).filter(Boolean);
        return ((partes[0]?.[0] ?? '?') + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase();
    }

    /** "hace 5 min", "hace 3 h", "ayer", o la fecha. */
    hace(fecha: string | undefined): string {
        if (!fecha) return '';
        const d = new Date(fecha);
        const min = Math.floor((Date.now() - d.getTime()) / 60000);
        if (min < 1) return 'recién';
        if (min < 60) return `hace ${min} min`;
        const h = Math.floor(min / 60);
        if (h < 24) return `hace ${h} h`;
        if (h < 48) return 'ayer';
        const dias = Math.floor(h / 24);
        if (dias < 7) return `hace ${dias} días`;
        return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    /** Enlace a WhatsApp si el teléfono parece un celular chileno. */
    whatsapp(m: MensajeContacto): string | null {
        let n = (m.telefono ?? '').replace(/\D/g, '');
        if (n.length === 9 && n.startsWith('9')) n = '56' + n;
        if (!/^569\d{8}$/.test(n)) return null;
        const texto = `Hola ${m.nombre}, le escribimos de Transportes Gómez Velásquez por su mensaje en nuestra página web.`;
        return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
    }

    mailto(m: MensajeContacto): string {
        return `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent('Respuesta a su consulta - Transportes Gomez Velásquez')}&body=${encodeURIComponent('Estimado/a ' + m.nombre + ':\n\n')}`;
    }
}
