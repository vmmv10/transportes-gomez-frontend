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
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ComunaSelectComponent } from '../../../catalogos/components/comuna-select/comuna-select.component';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { normalizarRut, rutValido } from '../../../uikit/utils/rut';
import { Cliente } from '../../models/cliente.model';
import { ClientesService } from '../../services/clientes.service';

@Component({
    standalone: true,
    selector: 'app-cliente-form',
    imports: [CommonModule, FormsModule, RouterModule, BreadcrumbModule, ButtonModule, InputTextModule, IconFieldModule, InputIconModule, SelectButtonModule, TagModule, ToastModule, ModalLoadingComponent, ComunaSelectComponent],
    templateUrl: './cliente-form.component.html',
    providers: [MessageService]
})
export class ClienteFormComponent implements OnInit {
    cliente: Cliente = new Cliente();
    breadcrumb: MenuItem[] = [{ label: 'Home', icon: 'pi pi-home', routerLink: '/' }, { label: 'Clientes', routerLink: '/clientes' }, { label: 'Nuevo' }];
    loading: boolean = false;
    intentoGuardar: boolean = false;

    sectores = [
        { label: 'Privado', value: 'PRIVADO' },
        { label: 'Público', value: 'PUBLICO' }
    ];
    tiposPersona = [
        { label: 'Empresa', value: 'JURIDICA' },
        { label: 'Persona natural', value: 'NATURAL' }
    ];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private clientesService: ClientesService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.breadcrumb = [...this.breadcrumb.slice(0, 2), { label: 'Editar' }];
            this.getCliente(id);
        }
    }

    get esNuevo(): boolean {
        return !this.cliente.id;
    }

    get rutOk(): boolean {
        return rutValido(this.cliente.rut);
    }

    get emailOk(): boolean {
        return !this.cliente.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.cliente.email.trim());
    }

    normalizarRut() {
        if (this.cliente.rut) {
            this.cliente.rut = normalizarRut(this.cliente.rut);
        }
    }

    getCliente(id: string) {
        this.loading = true;
        this.clientesService.get(id).subscribe({
            next: (cliente) => {
                this.cliente = Object.assign(new Cliente(), cliente);
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'Error al obtener el cliente') });
            }
        });
    }

    guardar() {
        this.intentoGuardar = true;
        this.normalizarRut();
        if (!this.cliente.razonSocial?.trim() || !this.rutOk || !this.emailOk) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Revisa los campos marcados en rojo.' });
            return;
        }
        this.loading = true;
        const peticion = this.cliente.id ? this.clientesService.update(this.cliente) : this.clientesService.create(this.cliente);
        peticion.subscribe({
            next: (guardado) => {
                this.loading = false;
                this.intentoGuardar = false;
                const eraNuevo = this.esNuevo;
                this.messageService.add({ severity: 'success', summary: 'Guardado', detail: eraNuevo ? 'Cliente creado' : 'Cliente actualizado' });
                if (guardado) {
                    this.cliente = Object.assign(new Cliente(), guardado);
                    if (eraNuevo && guardado.id) {
                        // Pasa a modo edición para no crearlo dos veces
                        this.router.navigate(['/clientes/formulario/' + guardado.id], { replaceUrl: true });
                        this.breadcrumb = [...this.breadcrumb.slice(0, 2), { label: 'Editar' }];
                    }
                }
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo guardar', detail: mensajeError(error, 'Error al guardar el cliente') });
            }
        });
    }
}
