import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
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
import { ProveedorSelectComponent } from '../../../proveedor/components/proveedor-select/proveedor-select.component';
import { Proveedor } from '../../../proveedor/models/proveedor.model';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { TableMobileComponent } from '../../../uikit/components/table-mobile/table-mobile.component';
import { Page } from '../../../uikit/models/page.model';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { ESTADOS_VEHICULO, PROPIEDADES_VEHICULO, TIPOS_VEHICULO, Vehiculo, VehiculoFiltro, tipoVehiculoIcono, tipoVehiculoTexto } from '../../models/vehiculo.model';
import { VehiculosService } from '../../services/vehiculos.service';

/** Mantenedor de la flota: vehículos propios y lanchas arrendadas. */
@Component({
    standalone: true,
    selector: 'app-vehiculo-list',
    imports: [
        BreadcrumbModule,
        CommonModule,
        FormsModule,
        TableModule,
        PaginatorModule,
        TagModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        TextareaModule,
        SelectModule,
        SelectButtonModule,
        DialogModule,
        ToastModule,
        TooltipModule,
        ConfirmDialogModule,
        ModalLoadingComponent,
        TableMobileComponent,
        ProveedorSelectComponent
    ],
    templateUrl: './vehiculo-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class VehiculoListComponent implements OnInit {
    loading: boolean = false;
    guardando: boolean = false;
    data: Page<Vehiculo> | undefined;
    filas: any[] = [];
    filtro: VehiculoFiltro = new VehiculoFiltro();
    breadcrumb: MenuItem[] = [
        { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
        { label: 'Vehículos', routerLink: '/vehiculos' }
    ];

    tipos = TIPOS_VEHICULO;
    propiedades = PROPIEDADES_VEHICULO;
    estadosVehiculo = ESTADOS_VEHICULO;
    activos = [
        { label: 'Activos', value: true },
        { label: 'Inactivos', value: false }
    ];

    dialogoVisible: boolean = false;
    intentoGuardar: boolean = false;
    vehiculo: Vehiculo = new Vehiculo();
    arrendador: Proveedor | undefined;

    campos: any[] = [
        { etiqueta: 'Vehículo', propiedad: 'descripcion', tipo: 'texto' },
        { etiqueta: 'Tipo', propiedad: 'tipoTexto', tipo: 'texto' },
        { etiqueta: 'Propiedad', propiedad: 'propiedadTexto', tipo: 'texto' },
        { etiqueta: 'Estado', propiedad: 'estadoTexto', tipo: 'texto' }
    ];

    acciones = [
        { tooltip: 'Editar', icono: 'pi pi-pencil', color: 'success', tipo: 'accion', accion: 'editar', label: 'Editar', outlined: true, mostrar: true },
        { tooltip: 'Activar / desactivar', icono: 'pi pi-power-off', color: 'danger', tipo: 'accion', accion: 'activo', label: 'Activar / desactivar', outlined: true, mostrar: true },
        { tooltip: 'Eliminar', icono: 'pi pi-trash', color: 'danger', tipo: 'accion', accion: 'eliminar', label: 'Eliminar', outlined: true, mostrar: true }
    ];

    constructor(
        private vehiculosService: VehiculosService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.getData();
    }

    tipoTexto(v: Vehiculo): string {
        return tipoVehiculoTexto(v.tipo);
    }

    icono(v: Vehiculo): string {
        return tipoVehiculoIcono(v.tipo);
    }

    estado(v: Vehiculo) {
        return ESTADOS_VEHICULO.find((e) => e.value === v.estado) ?? ESTADOS_VEHICULO[0];
    }

    capacidad(v: Vehiculo): string {
        const partes: string[] = [];
        if (v.capacidadKg) {
            partes.push(`${v.capacidadKg.toLocaleString('es-CL')} kg`);
        }
        if (v.capacidadM3) {
            partes.push(`${v.capacidadM3.toLocaleString('es-CL')} m³`);
        }
        if (v.capacidadPasajeros) {
            partes.push(`${v.capacidadPasajeros} pasajeros`);
        }
        return partes.join(' · ');
    }

    buscar() {
        this.filtro.page = 0;
        this.getData();
    }

    limpiarFiltros() {
        const activo = this.filtro.activo;
        this.filtro = new VehiculoFiltro();
        this.filtro.activo = activo;
        this.getData();
    }

    getData() {
        this.loading = true;
        this.vehiculosService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.data = data;
                this.filas = (data?.content ?? []).map((v) => ({
                    ...v,
                    tipoTexto: tipoVehiculoTexto(v.tipo),
                    propiedadTexto: v.propiedad === 'ARRENDADO' ? `Arrendado${v.proveedorNombre ? ' a ' + v.proveedorNombre : ''}` : 'Propio',
                    estadoTexto: this.estado(v).label + (v.activo === false ? ' (inactivo)' : '')
                }));
                this.loading = false;
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'Error al obtener vehículos') });
                this.loading = false;
            }
        });
    }

    pageChange(event: any) {
        this.filtro.page = event.page;
        this.filtro.size = event.rows;
        this.getData();
    }

    nuevo() {
        this.vehiculo = new Vehiculo();
        this.arrendador = undefined;
        this.intentoGuardar = false;
        this.dialogoVisible = true;
    }

    editar(v: Vehiculo) {
        this.vehiculo = { ...v };
        this.arrendador = v.proveedorId ? Object.assign(new Proveedor(), { id: v.proveedorId, nombre: v.proveedorNombre ?? '' }) : undefined;
        this.intentoGuardar = false;
        this.dialogoVisible = true;
    }

    onTipoChange() {
        // Las lanchas son de terceros
        if (this.vehiculo.tipo === 'LANCHA' && !this.vehiculo.id) {
            this.vehiculo.propiedad = 'ARRENDADO';
        }
    }

    get faltaArrendador(): boolean {
        return this.vehiculo.propiedad === 'ARRENDADO' && !this.arrendador?.id;
    }

    guardar() {
        this.intentoGuardar = true;
        if (!this.vehiculo.tipo || !this.vehiculo.nombre?.trim() || this.faltaArrendador) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: this.faltaArrendador ? 'Indica a quién se le arrienda' : 'Completa el tipo y el nombre del vehículo' });
            return;
        }
        this.vehiculo.proveedorId = this.vehiculo.propiedad === 'ARRENDADO' ? this.arrendador?.id : undefined;
        this.guardando = true;
        const peticion = this.vehiculo.id ? this.vehiculosService.update(this.vehiculo) : this.vehiculosService.create(this.vehiculo);
        peticion.subscribe({
            next: (v) => {
                this.guardando = false;
                this.dialogoVisible = false;
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: `${v.descripcion} guardado` });
                this.getData();
            },
            error: (error) => {
                this.guardando = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo guardar', detail: mensajeError(error, 'Error al guardar el vehículo'), life: 6000 });
            }
        });
    }

    confirmarCambioActivo(v: Vehiculo) {
        const desactivar = v.activo !== false;
        this.confirmationService.confirm({
            key: 'cVehiculo',
            header: desactivar ? 'Desactivar vehículo' : 'Activar vehículo',
            message: desactivar ? `¿Desactivar ${v.descripcion}? No se podrá asignar a nuevas rutas.` : `¿Activar nuevamente ${v.descripcion}?`,
            accept: () => this.cambiarActivo(v, !desactivar)
        });
    }

    private cambiarActivo(v: Vehiculo, activar: boolean) {
        if (!v.id) {
            return;
        }
        this.loading = true;
        (activar ? this.vehiculosService.activar(v.id) : this.vehiculosService.desactivar(v.id)).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: activar ? 'Vehículo activado' : 'Vehículo desactivado' });
                this.getData();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'No se pudo cambiar el estado') });
            }
        });
    }

    confirmarEliminar(v: Vehiculo) {
        this.confirmationService.confirm({
            key: 'cVehiculo',
            header: 'Eliminar vehículo',
            message: `¿Eliminar ${v.descripcion}? Solo se puede eliminar si no se ha usado en rutas ni costos.`,
            accept: () => this.eliminar(v)
        });
    }

    private eliminar(v: Vehiculo) {
        if (!v.id) {
            return;
        }
        this.loading = true;
        this.vehiculosService.eliminar(v.id).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: `${v.descripcion} eliminado` });
                this.getData();
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo eliminar', detail: mensajeError(error, 'Error al eliminar el vehículo'), life: 6000 });
            }
        });
    }

    resolverAccion(event: { tipo: string; item: any }) {
        if (event.tipo === 'editar') {
            this.editar(event.item);
        } else if (event.tipo === 'activo') {
            this.confirmarCambioActivo(event.item);
        } else if (event.tipo === 'eliminar') {
            this.confirmarEliminar(event.item);
        }
    }
}
