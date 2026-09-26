import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ClienteSelectComponent } from '../../../clientes/components/cliente-select/cliente-select.component';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { fechaIsoALocal, fechaLocalAIso } from '../../../uikit/utils/fechas';
import { Contrato } from '../../models/contrato.model';
import { ContratosService } from '../../services/contratos.service';
import { estadoContrato, EstadoContrato } from '../contrato-list/contrato-list.component';

@Component({
    standalone: true,
    selector: 'app-contrato-form',
    imports: [CommonModule, FormsModule, RouterModule, BreadcrumbModule, ButtonModule, DatePickerModule, InputTextModule, TagModule, TextareaModule, ToastModule, ModalLoadingComponent, ClienteSelectComponent],
    templateUrl: './contrato-form.component.html',
    providers: [MessageService]
})
export class ContratoFormComponent implements OnInit {
    contrato: Contrato = new Contrato();
    cliente: Cliente | undefined;
    clienteListo: boolean = false;
    fechaInicio: Date | undefined;
    fechaFin: Date | undefined;
    breadcrumb: MenuItem[] = [{ label: 'Home', icon: 'pi pi-home', routerLink: '/' }, { label: 'Contratos', routerLink: '/contratos' }, { label: 'Nuevo' }];
    loading: boolean = false;
    intentoGuardar: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private contratosService: ContratosService,
        private clientesService: ClientesService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.breadcrumb = [...this.breadcrumb.slice(0, 2), { label: 'Editar' }];
            this.getContrato(id);
            return;
        }
        // Nuevo contrato desde /contratos?cliente=1: viene con el cliente elegido
        const clienteId = Number(this.route.snapshot.queryParamMap.get('cliente'));
        if (clienteId) {
            this.clientesService.get(clienteId).subscribe({
                next: (cliente) => {
                    this.onClienteChange(cliente);
                    this.clienteListo = true;
                },
                error: () => (this.clienteListo = true)
            });
        } else {
            this.clienteListo = true;
        }
    }

    get esNuevo(): boolean {
        return !this.contrato.id;
    }

    get estado(): EstadoContrato {
        return estadoContrato(this.contrato);
    }

    get fechasOk(): boolean {
        return !this.fechaInicio || !this.fechaFin || this.fechaFin >= this.fechaInicio;
    }

    private cargar(contrato: Contrato) {
        this.contrato = Object.assign(new Contrato(), contrato);
        this.cliente = contrato.clienteId ? ({ id: contrato.clienteId, razonSocial: contrato.clienteNombre ?? '' } as Cliente) : undefined;
        this.fechaInicio = fechaIsoALocal(contrato.fechaInicio);
        this.fechaFin = fechaIsoALocal(contrato.fechaFin);
    }

    getContrato(id: string) {
        this.loading = true;
        this.contratosService.get(id).subscribe({
            next: (contrato) => {
                this.cargar(contrato);
                this.clienteListo = true;
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                this.clienteListo = true;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'Error al obtener el contrato') });
            }
        });
    }

    onClienteChange(cliente: Cliente | undefined) {
        this.cliente = cliente;
        this.contrato.clienteId = cliente?.id;
        this.contrato.clienteNombre = cliente ? cliente.nombreCorto || cliente.razonSocial : undefined;
    }

    guardar() {
        this.intentoGuardar = true;
        if (!this.contrato.clienteId || !this.contrato.codigo?.trim() || !this.contrato.nombre?.trim() || !this.fechasOk) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Revisa los campos marcados en rojo.' });
            return;
        }
        this.contrato.fechaInicio = fechaLocalAIso(this.fechaInicio);
        this.contrato.fechaFin = fechaLocalAIso(this.fechaFin);
        this.loading = true;
        const eraNuevo = this.esNuevo;
        const peticion = eraNuevo ? this.contratosService.create(this.contrato) : this.contratosService.update(this.contrato);
        peticion.subscribe({
            next: (guardado) => {
                this.loading = false;
                this.intentoGuardar = false;
                this.messageService.add({ severity: 'success', summary: 'Guardado', detail: eraNuevo ? 'Contrato creado' : 'Contrato actualizado' });
                if (guardado) {
                    this.cargar(guardado);
                    if (eraNuevo && guardado.id) {
                        this.router.navigate(['/contratos/formulario/' + guardado.id], { replaceUrl: true });
                        this.breadcrumb = [...this.breadcrumb.slice(0, 2), { label: 'Editar' }];
                    }
                }
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo guardar', detail: mensajeError(error, 'Error al guardar el contrato') });
            }
        });
    }
}
