import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ClienteSelectComponent } from '../../../clientes/components/cliente-select/cliente-select.component';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { Page } from '../../../uikit/models/page.model';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { fechaIsoATexto, fechaLocalAIso } from '../../../uikit/utils/fechas';
import { Contrato } from '../../models/contrato.model';
import { ContratoFiltro } from '../../models/contrato-filtro';
import { ContratosService } from '../../services/contratos.service';

export interface EstadoContrato {
    texto: string;
    severidad: 'success' | 'warn' | 'danger' | 'secondary' | 'info';
}

/** Vigente / Por iniciar / Vencido / Inactivo, según fechas y estado. */
export function estadoContrato(contrato: Contrato): EstadoContrato {
    if (contrato.activo === false) {
        return { texto: 'Inactivo', severidad: 'secondary' };
    }
    if (contrato.vigente) {
        return { texto: 'Vigente', severidad: 'success' };
    }
    const hoy = fechaLocalAIso(new Date())!;
    if (contrato.fechaInicio && contrato.fechaInicio > hoy) {
        return { texto: 'Por iniciar', severidad: 'info' };
    }
    return { texto: 'Vencido', severidad: 'warn' };
}

@Component({
    standalone: true,
    selector: 'app-contrato-list',
    imports: [
        BreadcrumbModule,
        CommonModule,
        FormsModule,
        RouterModule,
        TableModule,
        PaginatorModule,
        TagModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        SelectButtonModule,
        ToastModule,
        TooltipModule,
        ConfirmDialogModule,
        ModalLoadingComponent,
        TableMobileComponent,
        ClienteSelectComponent
    ],
    templateUrl: './contrato-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ContratoListComponent implements OnInit {
    loading: boolean = false;
    data: Page<Contrato> | undefined;
    filas: any[] = [];
    filtro: ContratoFiltro = new ContratoFiltro();
    cliente: Cliente | undefined;
    clienteListo: boolean = false;
    breadcrumb: MenuItem[] = [
        { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
        { label: 'Contratos', routerLink: '/contratos' }
    ];
    estados = [
        { label: 'Activos', value: true },
        { label: 'Inactivos', value: false }
    ];

    campos: any[] = [
        { etiqueta: 'Código', propiedad: 'codigo', tipo: 'texto' },
        { etiqueta: 'Contrato', propiedad: 'nombre', tipo: 'texto' },
        { etiqueta: 'Cliente', propiedad: 'clienteNombre', tipo: 'texto' },
        { etiqueta: 'Período', propiedad: 'periodo', tipo: 'texto' },
        { etiqueta: 'Estado', propiedad: 'estadoTexto', tipo: 'texto' }
    ];

    acciones = [
        { tooltip: 'Editar', icono: 'pi pi-pencil', color: 'success', tipo: 'link', ruta: '/contratos/formulario/', rutaConId: true, label: 'Editar', outlined: true, mostrar: true },
        { tooltip: 'Activar / desactivar', icono: 'pi pi-power-off', color: 'danger', tipo: 'accion', accion: 'estado', label: 'Activar / desactivar', outlined: true, mostrar: true },
        { tooltip: 'Eliminar', icono: 'pi pi-trash', color: 'danger', tipo: 'accion', accion: 'eliminar', label: 'Eliminar', outlined: true, mostrar: true }
    ];

    constructor(
        private route: ActivatedRoute,
        private contratosService: ContratosService,
        private clientesService: ClientesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        // /contratos?cliente=1 llega desde la ficha del cliente
        const clienteId = Number(this.route.snapshot.queryParamMap.get('cliente'));
        if (clienteId) {
            this.filtro.cliente = clienteId;
            this.clientesService.get(clienteId).subscribe({
                next: (cliente) => {
                    this.cliente = cliente;
                    this.clienteListo = true;
                },
                error: () => (this.clienteListo = true)
            });
        } else {
            this.clienteListo = true;
        }
        this.getData();
    }

    estado(contrato: Contrato): EstadoContrato {
        return estadoContrato(contrato);
    }

    periodo(contrato: Contrato): string {
        const inicio = fechaIsoATexto(contrato.fechaInicio) || '—';
        const fin = fechaIsoATexto(contrato.fechaFin) || 'sin término';
        return `${inicio} al ${fin}`;
    }

    onClienteChange(cliente: Cliente | undefined) {
        this.cliente = cliente;
        this.filtro.cliente = cliente?.id;
        this.buscar();
    }

    buscar() {
        this.filtro.page = 0;
        this.getData();
    }

    limpiarFiltros() {
        const activo = this.filtro.activo;
        this.filtro = new ContratoFiltro();
        this.filtro.activo = activo;
        this.cliente = undefined;
        this.getData();
    }

    getData() {
        this.loading = true;
        this.contratosService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.data = data;
                this.filas = (data?.content ?? []).map((c) => ({ ...c, periodo: this.periodo(c), estadoTexto: estadoContrato(c).texto }));
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'Error al obtener contratos') });
                console.error('Error al obtener contratos:', error);
                this.loading = false;
            }
        });
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    confirmarCambioEstado(contrato: Contrato) {
        const desactivar = contrato.activo !== false;
        this.confirmationService.confirm({
            key: 'cContrato',
            header: desactivar ? 'Desactivar contrato' : 'Activar contrato',
            message: desactivar ? `¿Desactivar el contrato ${contrato.codigo}? No se podrá asignar a nuevas órdenes.` : `¿Activar nuevamente el contrato ${contrato.codigo}?`,
            accept: () => this.cambiarEstado(contrato, !desactivar)
        });
    }

    private cambiarEstado(contrato: Contrato, activar: boolean) {
        if (!contrato.id) {
            return;
        }
        this.loading = true;
        const peticion = activar ? this.contratosService.activar(contrato.id) : this.contratosService.desactivar(contrato.id);
        peticion.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: activar ? 'Contrato activado' : 'Contrato desactivado' });
                this.getData();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'No se pudo cambiar el estado del contrato') });
            }
        });
    }

    confirmarEliminar(contrato: Contrato) {
        this.confirmationService.confirm({
            key: 'cContrato',
            header: 'Eliminar contrato',
            message: `¿Eliminar el contrato ${contrato.codigo}? Solo se puede eliminar si no tiene órdenes de servicio asociadas.`,
            accept: () => this.eliminar(contrato)
        });
    }

    private eliminar(contrato: Contrato) {
        if (!contrato.id) {
            return;
        }
        this.loading = true;
        this.contratosService.eliminar(contrato.id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: `Contrato ${contrato.codigo} eliminado` });
                this.getData();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo eliminar', detail: mensajeError(error, 'Error al eliminar el contrato'), life: 6000 });
            }
        });
    }

    resolverAccion(event: { tipo: string; item: any }) {
        if (event.tipo === 'estado') {
            this.confirmarCambioEstado(event.item);
        } else if (event.tipo === 'eliminar') {
            this.confirmarEliminar(event.item);
        }
    }
}
