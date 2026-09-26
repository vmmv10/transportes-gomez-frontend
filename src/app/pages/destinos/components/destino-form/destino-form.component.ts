import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ComunaSelectComponent } from '../../../catalogos/components/comuna-select/comuna-select.component';
import { ClienteSelectComponent } from '../../../clientes/components/cliente-select/cliente-select.component';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { Destino, DESTINO_TIPOS } from '../../models/destino.model';
import { DestinosService } from '../../services/destinos.service';

@Component({
    standalone: true,
    selector: 'app-destino-form',
    imports: [CommonModule, FormsModule, RouterModule, BreadcrumbModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, SelectModule, TagModule, ToastModule, ModalLoadingComponent, ComunaSelectComponent, ClienteSelectComponent],
    templateUrl: './destino-form.component.html',
    styleUrl: './destino-form.component.scss',
    providers: [MessageService]
})
export class DestinoFormComponent implements OnInit {
    destino: Destino = new Destino();
    cliente: Cliente | undefined;
    tipos = DESTINO_TIPOS.filter((t) => t.value !== 'ESCUELA' && t.value !== 'JARDIN');
    breadcrumb: MenuItem[] = [{ label: 'Home', icon: 'pi pi-home', routerLink: '/' }, { label: 'Destinos', routerLink: '/destinos' }, { label: 'Nuevo' }];
    loading: boolean = false;
    intentoGuardar: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private destinosService: DestinosService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.breadcrumb = [...this.breadcrumb.slice(0, 2), { label: 'Editar' }];
            this.getDestino(id);
        }
    }

    get esNuevo(): boolean {
        return !this.destino.id;
    }

    /** Los destinos que vienen de un establecimiento se editan en Establecimientos. */
    get desdeEscuela(): boolean {
        return !!this.destino.escuelaId;
    }

    get emailOk(): boolean {
        return !this.destino.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.destino.email.trim());
    }

    private cargar(destino: Destino) {
        this.destino = Object.assign(new Destino(), destino);
        this.cliente = destino.clienteId ? ({ id: destino.clienteId, razonSocial: destino.clienteNombre ?? '' } as Cliente) : undefined;
        if (this.desdeEscuela) {
            // Para mostrar el tipo real (Escuela / Jardín) en el select deshabilitado
            this.tipos = DESTINO_TIPOS;
        }
    }

    getDestino(id: string) {
        this.loading = true;
        this.destinosService.get(id).subscribe({
            next: (destino) => {
                this.cargar(destino);
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'Error al obtener el destino') });
            }
        });
    }

    onClienteChange(cliente: Cliente | undefined) {
        this.cliente = cliente;
        this.destino.clienteId = cliente?.id;
    }

    guardar() {
        this.intentoGuardar = true;
        if (!this.destino.nombre?.trim() || !this.destino.tipo || !this.emailOk) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Revisa los campos marcados en rojo.' });
            return;
        }
        this.loading = true;
        const eraNuevo = this.esNuevo;
        const peticion = eraNuevo ? this.destinosService.create(this.destino) : this.destinosService.update(this.destino);
        peticion.subscribe({
            next: (guardado) => {
                this.loading = false;
                this.intentoGuardar = false;
                this.messageService.add({ severity: 'success', summary: 'Guardado', detail: eraNuevo ? 'Destino creado' : 'Destino actualizado' });
                if (guardado) {
                    this.cargar(guardado);
                    if (eraNuevo && guardado.id) {
                        this.router.navigate(['/destinos/formulario/' + guardado.id], { replaceUrl: true });
                        this.breadcrumb = [...this.breadcrumb.slice(0, 2), { label: 'Editar' }];
                    }
                }
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo guardar', detail: mensajeError(error, 'Error al guardar el destino') });
            }
        });
    }
}
