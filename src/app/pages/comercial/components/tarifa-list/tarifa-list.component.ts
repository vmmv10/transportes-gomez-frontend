import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, forkJoin } from 'rxjs';
import { Comuna } from '../../../catalogos/models/comuna.model';
import { ServicioTipo } from '../../../catalogos/models/servicio-tipo.model';
import { CatalogosService } from '../../../catalogos/services/catalogos.service';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { Page } from '../../../uikit/models/page.model';
import { UnidadMedida } from '../../../uikit/models/unidad-medida.model';
import { RolService } from '../../../uikit/services/rol.service';
import { UnidadesMedidasService } from '../../../uikit/services/unidades-medidas.service';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { fechaIsoALocal, fechaIsoATexto, fechaLocalAIso } from '../../../uikit/utils/fechas';
import { PERIODOS, Tarifa, TarifaFiltro } from '../../models/comercial.models';
import { ComercialService } from '../../services/comercial.service';

/** Tarifas: precio por servicio, comunas, unidad y período. Las edita el Administrador. */
@Component({
    standalone: true,
    selector: 'app-tarifa-list',
    imports: [
        CommonModule,
        FormsModule,
        BreadcrumbModule,
        ButtonModule,
        CheckboxModule,
        ConfirmDialogModule,
        DatePickerModule,
        DialogModule,
        InputNumberModule,
        InputTextModule,
        PaginatorModule,
        SelectModule,
        SelectButtonModule,
        TableModule,
        TagModule,
        TextareaModule,
        ToastModule,
        TooltipModule,
        ModalLoadingComponent
    ],
    templateUrl: './tarifa-list.component.html',
    styleUrls: ['../../comercial.scss'],
    providers: [MessageService, ConfirmationService]
})
export class TarifaListComponent implements OnInit {
    breadcrumb: MenuItem[] = [{ label: 'Home', icon: 'pi pi-home', routerLink: '/' }, { label: 'Comercial' }, { label: 'Tarifas', routerLink: '/comercial/tarifas' }];
    loading = false;
    guardando = false;
    data: Page<Tarifa> | undefined;
    filtro = new TarifaFiltro();
    esAdmin$: Observable<boolean>;

    comunas: Comuna[] = [];
    servicios: ServicioTipo[] = [];
    unidades: UnidadMedida[] = [];
    clientes: { id: number | undefined; nombre: string }[] = [];
    periodos = PERIODOS;
    estados = [
        { label: 'Activas', value: true },
        { label: 'Inactivas', value: false }
    ];

    dialogoVisible = false;
    intentoGuardar = false;
    tarifa: Tarifa = new Tarifa();
    desde: Date | undefined;
    hasta: Date | undefined;

    constructor(
        private comercialService: ComercialService,
        private catalogosService: CatalogosService,
        private unidadesService: UnidadesMedidasService,
        private clientesService: ClientesService,
        private rolService: RolService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.esAdmin$ = this.rolService.tieneAlgunRol(['Administrador']);
    }

    ngOnInit(): void {
        forkJoin({
            comunas: this.catalogosService.getComunas(),
            servicios: this.catalogosService.getServiciosTipos(),
            unidades: this.unidadesService.getAll(),
            clientes: this.clientesService.getList()
        }).subscribe({
            next: (r) => {
                this.comunas = r.comunas;
                this.servicios = r.servicios;
                this.unidades = r.unidades;
                this.clientes = [{ id: -1, nombre: 'Solo tarifas generales' }, ...r.clientes.map((c: Cliente) => ({ id: c.id, nombre: c.nombreCorto || c.razonSocial }))];
            },
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(e, 'No se pudieron cargar los catálogos') })
        });
        this.getData();
    }

    get clientesDialogo() {
        return this.clientes.filter((c) => c.id !== -1);
    }

    fecha(v: string | undefined): string {
        return fechaIsoATexto(v);
    }

    periodoTexto(p: string): string {
        return PERIODOS.find((x) => x.value === p)?.label ?? p;
    }

    buscar() {
        this.filtro.page = 0;
        this.getData();
    }

    getData() {
        this.loading = true;
        this.comercialService.getTarifas(this.filtro).subscribe({
            next: (d) => {
                this.data = d;
                this.loading = false;
            },
            error: (e) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(e, 'Error al obtener tarifas') });
            }
        });
    }

    pageChange(e: any) {
        this.filtro.page = e.page;
        this.filtro.size = e.rows;
        this.getData();
    }

    nueva() {
        this.tarifa = new Tarifa();
        this.desde = new Date();
        this.hasta = undefined;
        this.intentoGuardar = false;
        this.dialogoVisible = true;
    }

    editar(t: Tarifa) {
        this.tarifa = { ...t };
        this.desde = fechaIsoALocal(t.vigenteDesde);
        this.hasta = fechaIsoALocal(t.vigenteHasta);
        this.intentoGuardar = false;
        this.dialogoVisible = true;
    }

    /** Copia para una nueva vigencia (ej. alza de precios): mismo servicio y ruta, desde hoy. */
    duplicar(t: Tarifa) {
        this.editar({ ...t, id: undefined, vigenteHasta: undefined });
        this.desde = new Date();
    }

    guardar() {
        this.intentoGuardar = true;
        if (!this.tarifa.servicioTipoId || !this.tarifa.unidadMedidaId || this.tarifa.precio == null) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Completa servicio, unidad y precio' });
            return;
        }
        this.tarifa.vigenteDesde = fechaLocalAIso(this.desde);
        this.tarifa.vigenteHasta = fechaLocalAIso(this.hasta);
        this.guardando = true;
        this.comercialService.guardarTarifa(this.tarifa).subscribe({
            next: () => {
                this.guardando = false;
                this.dialogoVisible = false;
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Tarifa guardada' });
                this.getData();
            },
            error: (e) => {
                this.guardando = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo guardar', detail: mensajeError(e, 'Error al guardar la tarifa'), life: 6000 });
            }
        });
    }

    cambiarActivo(t: Tarifa) {
        if (!t.id) return;
        this.comercialService.cambiarActivoTarifa(t.id, !t.activo).subscribe({
            next: () => this.getData(),
            error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(e, 'No se pudo cambiar el estado') })
        });
    }

    /** "por pallet", "por kg"... para la vista previa del precio. */
    get unidadTexto(): string {
        const u = this.unidades.find((x) => x.id === this.tarifa.unidadMedidaId);
        return u ? 'por ' + (u.nombre ?? '').toLowerCase() : 'por unidad';
    }

    confirmarEliminar(t: Tarifa) {
        this.confirmationService.confirm({
            key: 'cTarifa',
            header: 'Eliminar tarifa',
            message: 'Solo se puede eliminar si no se ha usado en cotizaciones. ¿Continuar?',
            accept: () =>
                this.comercialService.eliminarTarifa(t.id!).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Tarifa eliminada' });
                        this.getData();
                    },
                    error: (e) => this.messageService.add({ severity: 'error', summary: 'No se pudo eliminar', detail: mensajeError(e, 'Error al eliminar'), life: 6000 })
                })
        });
    }
}
