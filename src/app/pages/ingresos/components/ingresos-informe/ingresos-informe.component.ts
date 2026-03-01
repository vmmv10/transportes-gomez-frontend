import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { IngresoConversacion } from '../../models/ingreso-conversacion.model';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { IngresosService } from '../../services/ingresos.service';
import { ActivatedRoute } from '@angular/router';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { InputTextModule } from 'primeng/inputtext';
import { IngresoMensaje } from '../../models/ingreso-mensaje.model';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../../uikit/services/rol.service';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-ingresos-informe',
    imports: [MessageModule, CommonModule, FormsModule, BreadcrumbModule, InputTextModule, ButtonModule, ModalLoadingComponent],
    templateUrl: './ingresos-informe.component.html',
    styleUrl: './ingresos-informe.component.scss',
    providers: [MessageService, ConfirmationService],
    standalone: true
})
export class IngresosInformeComponent {
    conversacion: IngresoConversacion = new IngresoConversacion();
    breadcrumb: MenuItem[] = [];
    loading: boolean = false;
    validar: boolean = false;
    mensaje: IngresoMensaje = new IngresoMensaje();
    usuarioActualId!: string;
    enviando = false;

    @ViewChild('chatContainer') chatContainer!: ElementRef;

    constructor(
        private ingresosService: IngresosService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute,
        private usuarioService: UsuariosService
    ) {
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Ingresos', routerLink: '/ingresos' }
        ];
    }

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.breadcrumb.push({ label: 'Folio ' + id, routerLink: `/ingresos/formulario/${id}` });
            this.breadcrumb.push({ label: 'Chat', routerLink: `/ingresos/formulario/${id}/informe` });
            this.loading = true;
            await this.getUsuario();
            await this.getConversacion();
            this.loading = false;
        }
    }

    async getUsuario() {
      try {
        const data = await firstValueFrom(this.usuarioService.getUsuario());
        this.usuarioActualId = data.id;
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    }

    async getConversacion() {
      try {
        const data = await firstValueFrom(this.ingresosService.getConversacion(this.route.snapshot.paramMap.get('id') || ''));
        this.conversacion = data;
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la conversación' });
      }
    }

    crearMensaje() {
        if (!this.mensaje.mensaje?.trim()) {
            this.validar = true;
            return;
        }

        this.validar = false;
        this.enviando = true;

        this.ingresosService.crearMensaje(this.route.snapshot.paramMap.get('id') || '', this.mensaje).subscribe({
            next: (mensaje) => {
                this.conversacion.mensajes.push(mensaje);
                this.mensaje = new IngresoMensaje();
                this.enviando = false;
                this.scrollToBottom();
            },
            error: () => {
                this.enviando = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo enviar el mensaje'
                });
            }
        });
    }

    scrollToBottom() {
        setTimeout(() => {
            if (this.chatContainer) this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        });
    }
}
