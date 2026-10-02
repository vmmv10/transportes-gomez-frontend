import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Page } from '../../../uikit/models/page.model';
import { Ruta } from '../../models/ruta.model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PanelModule } from 'primeng/panel';
import { Usuario } from '../../../usuarios/models/usuario.model';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TagModule } from 'primeng/tag';
import { RutasService } from '../../services/rutas.service';
import { RutaFiltro } from '../../models/ruta-filtro.model';
import { PaginatorModule } from 'primeng/paginator';
import { FechaPipe } from '../../../uikit/pipe/fecha';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { InputTextModule } from 'primeng/inputtext';
import { UsuariosSelectComponent } from '../../../usuarios/components/usuarios-select/usuarios-select.component';
import { Observable } from 'rxjs';
import { RolService } from '../../../uikit/services/rol.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectBooleanComponent } from '../../../uikit/components/select-boolean/select-boolean.component';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { VehiculoSelectComponent } from '../../../vehiculos/components/vehiculo-select/vehiculo-select.component';

@Component({
    standalone: true,
    selector: 'app-rutas',
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        BreadcrumbModule,
        RouterModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
        TooltipModule,
        ModalLoadingComponent,
        TagModule,
        ConfirmDialogModule,
        PaginatorModule,
        FechaPipe,
        TableMobileComponent,
        InputTextModule,
        UsuariosSelectComponent,
        InputNumberModule,
        SelectBooleanComponent,
        VehiculoSelectComponent,
        PanelModule
    ],
    templateUrl: './rutas.component.html',
    styleUrl: './rutas.component.scss',
    providers: [ConfirmationService, MessageService]
})
export class RutasComponent {
    breadcrumb: MenuItem[] = [];
    loading: boolean = false;
    data!: Page<Ruta>;
    filtro: RutaFiltro = new RutaFiltro();
    esAdmin$!: Observable<boolean>;
    esConductor$!: Observable<boolean>;
    esConductor: boolean = false;
    ruta: Ruta = new Ruta();
    displayAsignarKilometros: boolean = false;
    /** Datos del diálogo de kilómetros (copia, para no cambiar la fila si se cancela) */
    km: { id: number; kilometros: number | null; kmSalida: number | null; kmLlegada: number | null } = { id: 0, kilometros: null, kmSalida: null, kmLlegada: null };
    filtrosVisibles: boolean = false;
    /** Fechas del filtro como texto yyyy-MM-dd (input type="date"). */
    desde: string | undefined;
    hasta: string | undefined;

    campos: any[] = [
        { etiqueta: 'Número', propiedad: 'id', tipo: 'texto' },
        { etiqueta: 'Fecha', propiedad: 'fecha', tipo: 'fecha' },
        { etiqueta: 'Chofer', propiedad: 'chofer.nombre', tipo: 'objeto' },
        { etiqueta: 'Vehículo', propiedad: 'vehiculoTexto', tipo: 'texto' },
        { etiqueta: 'Costo', propiedad: 'costoTexto', tipo: 'texto' },
        { etiqueta: 'Estado', propiedad: 'estado', tipo: 'text' }
    ];
    acciones: any[] = [];

    opcionesSelectBoolean: { label: string; value: boolean }[] = [
        { label: 'Finalizada', value: true },
        { label: 'Pendiente', value: false }
    ];

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private rutasService: RutasService,
        private rolService: RolService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // Crear y editar rutas: Administrador y Operaciones
        this.esAdmin$ = this.rolService.tieneAlgunRol(['Administrador', 'Operaciones']);
        this.breadcrumb = [
            { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
            { label: 'Rutas', routerLink: '/rutas' }
        ];
        this.acciones = [
            {
                tooltip: 'Editar',
                icono: 'pi pi-pencil',
                color: 'info',
                tipo: 'link',
                ruta: '/rutas/formulario/',
                rutaConId: true,
                label: 'Editar',
                outlined: true,
                mostrar: this.esAdmin$
            },
            {
                tooltip: 'Eliminar',
                icono: 'pi pi-trash',
                color: 'warn',
                tipo: 'accion',
                accion: 'eliminar',
                deshabilitarSi: 'entregado',
                label: 'Eliminar',
                outlined: true,
                mostrar: this.esAdmin$
            },
            {
                tooltip: 'Asignar Kilómetros',
                icono: 'pi pi-truck',
                color: 'warn',
                tipo: 'accion',
                accion: 'asignarKilometros',
                deshabilitarSi: 'entregado',
                label: 'Asignar Kilómetros',
                outlined: true,
                mostrar: this.esAdmin$ || this.esConductor
            }
        ];
    }

    async ngOnInit() {
        this.leerQueryParams();
        this.filtrosVisibles = this.filtrosActivos > 0;
        this.getData();
    }

    /** Cantidad de filtros aplicados (se muestra como badge en el botón). */
    get filtrosActivos(): number {
        const f = this.filtro;
        return [f.id, f.chofer, f.vehiculo, f.estado, this.desde, this.hasta].filter((v) => v !== undefined && v !== null && v !== '').length;
    }

    buscar() {
        this.filtro.page = 0;
        this.getData();
    }

    limpiarFiltros() {
        this.filtro.id = null;
        this.filtro.chofer = undefined;
        this.filtro.vehiculo = undefined;
        this.filtro.estado = undefined;
        this.desde = undefined;
        this.hasta = undefined;
        this.buscar();
    }

    private aplicarFechas() {
        this.filtro.fechaDesde = this.desde ? new Date(this.desde + 'T00:00:00') : null;
        this.filtro.fechaHasta = this.hasta ? new Date(this.hasta + 'T23:59:59') : null;
    }

    private leerQueryParams() {
        const p = this.route.snapshot.queryParamMap;
        const numero = (clave: string) => {
            const v = p.get(clave);
            return v !== null && v !== '' && !isNaN(Number(v)) ? Number(v) : undefined;
        };
        const fecha = (clave: string) => {
            const v = p.get(clave);
            return v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined;
        };

        this.filtro.id = numero('numero') ?? null;
        const chofer = numero('chofer');
        this.filtro.chofer = chofer !== undefined ? ({ id: chofer } as unknown as Usuario) : undefined;
        this.filtro.vehiculo = numero('vehiculo');
        const estado = p.get('estado');
        this.filtro.estado = estado === 'finalizada' ? true : estado === 'pendiente' ? false : undefined;
        this.desde = fecha('desde');
        this.hasta = fecha('hasta');
        this.filtro.page = numero('page') ?? 0;
        this.filtro.size = numero('size') ?? 10;
    }

    private actualizarQueryParams() {
        const f = this.filtro;
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                numero: f.id ?? null,
                chofer: f.chofer?.id ?? null,
                vehiculo: f.vehiculo ?? null,
                estado: f.estado === true ? 'finalizada' : f.estado === false ? 'pendiente' : null,
                desde: this.desde || null,
                hasta: this.hasta || null,
                page: f.page > 0 ? f.page : null,
                size: f.size !== 10 ? f.size : null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    getData() {
        this.loading = true;
        this.aplicarFechas();
        this.actualizarQueryParams();
        this.rutasService.getAll(this.filtro).subscribe({
            next: (data) => {
                // Textos para la vista móvil
                data?.content?.forEach((r: any) => {
                    r.vehiculoTexto = r.vehiculo?.descripcion ?? 'Sin vehículo';
                    r.costoTexto = r.costoTotal ? '$ ' + Number(r.costoTotal).toLocaleString('es-CL') : '—';
                });
                this.data = data;
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las Rutas' });
                this.loading = false;
            }
        });
    }

    eliminar(ruta: Ruta) {
        this.loading = true;
        this.rutasService.delete(ruta.id.toString()).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ruta eliminada correctamente' });
                this.getData();
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la ruta' });
                console.error('Error deleting ruta:', error);
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    confirmarEliminar(ruta: Ruta) {
        this.confirmationService.confirm({
            message: '¿Desea eliminar la ruta ' + ruta.id + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            key: 'eliminarRuta',
            accept: () => this.eliminar(ruta)
        });
    }

    onPageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    resolverAccion(event: { tipo: string; item: any }) {
        switch (event.tipo) {
            case 'eliminar':
                this.confirmarEliminar(event.item);
                break;
            case 'asignarKilometros':
                this.openModalAsignarKilometros(event.item);
                break;
        }
    }

    openModalAsignarKilometros(item: Ruta) {
        this.ruta = item;
        this.km = { id: item.id, kilometros: item.kilometros || null, kmSalida: item.kmSalida ?? null, kmLlegada: item.kmLlegada ?? null };
        this.displayAsignarKilometros = true;
    }

    closeModalAsignarKilometros() {
        this.displayAsignarKilometros = false;
    }

    /** Con odómetro de salida y llegada, los kilómetros se calculan. */
    get kmCalculados(): number | null {
        const { kmSalida, kmLlegada } = this.km;
        return kmSalida != null && kmLlegada != null ? kmLlegada - kmSalida : null;
    }

    asignarKilometros() {
        const calculados = this.kmCalculados;
        if (calculados !== null && calculados < 0) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'El kilometraje de llegada no puede ser menor que el de salida' });
            return;
        }
        if (calculados === null && !(this.km.kilometros && this.km.kilometros > 0)) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Ingresa el odómetro de salida y llegada, o los kilómetros recorridos' });
            return;
        }
        this.loading = true;
        this.rutasService.asignarKilometros({ id: this.km.id, kilometros: this.km.kilometros ?? 0, kmSalida: this.km.kmSalida, kmLlegada: this.km.kmLlegada }).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Kilómetros asignados correctamente' });
                this.closeModalAsignarKilometros();
                this.getData();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'Error al asignar kilómetros') });
            },
            complete: () => {
                this.loading = false;
            }
        });
    }
}
