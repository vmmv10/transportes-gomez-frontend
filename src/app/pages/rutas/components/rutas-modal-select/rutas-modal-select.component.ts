import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Escuela } from '../../../escuelas/models/escuela.models';
import { Page } from '../../../uikit/models/page.model';
import { UsuariosSelectComponent } from '../../../usuarios/components/usuarios-select/usuarios-select.component';
import { Usuario } from '../../../usuarios/models/usuario.model';
import { RutaFiltro } from '../../models/ruta-filtro.model';
import { Ruta } from '../../models/ruta.model';
import { RutasService } from '../../services/rutas.service';

export type RangoRuta = 'desdeHoy' | 'hoy' | 'manana' | 'semana' | 'todas';

/**
 * Selector de UNA ruta pendiente en un modal con tabla paginada en el servidor.
 * Uso: <app-rutas-modal-select [(ruta)]="rutaSeleccionada" [escuela]="orden.escuela" [validar]="validar" />
 */
@Component({
    standalone: true,
    selector: 'app-rutas-modal-select',
    imports: [CommonModule, FormsModule, DialogModule, ButtonModule, TableModule, TagModule, ToastModule, TooltipModule, InputNumberModule, SelectButtonModule, UsuariosSelectComponent],
    templateUrl: './rutas-modal-select.component.html',
    styleUrl: './rutas-modal-select.component.scss',
    providers: [MessageService]
})
export class RutasModalSelectComponent {
    /** Ruta elegida (two-way). */
    @Input() ruta: Ruta | undefined;
    @Output() rutaChange = new EventEmitter<Ruta | undefined>();
    /** Escuela de la OS: se usa para destacar las rutas que ya pasan por su comuna. */
    @Input() escuela: Escuela | undefined;
    @Input() validar: boolean = false;
    @Input() disabled: boolean = false;

    visible: boolean = false;
    loading: boolean = false;
    data: Page<Ruta> | undefined;
    filtro: RutaFiltro = new RutaFiltro();
    numeroRuta: number | null = null;
    chofer: Usuario | undefined;
    /** Selección temporal dentro del modal; se confirma con "Seleccionar". */
    seleccion: Ruta | undefined;

    rango: RangoRuta = 'desdeHoy';
    rangos: { label: string; value: RangoRuta }[] = [
        { label: 'Desde hoy', value: 'desdeHoy' },
        { label: 'Hoy', value: 'hoy' },
        { label: 'Mañana', value: 'manana' },
        { label: 'Esta semana', value: 'semana' },
        { label: 'Todas', value: 'todas' }
    ];

    constructor(
        private rutasService: RutasService,
        private messageService: MessageService
    ) {
        this.filtro.estado = false; // solo PENDIENTE
        this.filtro.size = 10;
        this.filtro.page = 0;
        this.filtro.key = 'fecha';
    }

    // ---------- Apertura / cierre ----------

    abrir() {
        if (this.disabled) {
            return;
        }
        this.seleccion = this.ruta;
        this.visible = true;
        // La primera carga la dispara onLazyLoad de la tabla al mostrarse.
    }

    cerrar() {
        this.visible = false;
    }

    confirmar() {
        if (!this.seleccion) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Seleccione una ruta' });
            return;
        }
        this.ruta = this.seleccion;
        this.rutaChange.emit(this.ruta);
        this.visible = false;
    }

    quitar(event?: Event) {
        event?.stopPropagation();
        this.ruta = undefined;
        this.seleccion = undefined;
        this.rutaChange.emit(undefined);
    }

    /** Doble clic en una fila = seleccionar y cerrar. */
    seleccionarDirecto(ruta: Ruta) {
        this.seleccion = ruta;
        this.confirmar();
    }

    // ---------- Búsqueda ----------

    onLazyLoad(event: TableLazyLoadEvent) {
        const rows = event.rows ?? this.filtro.size;
        this.filtro.size = rows;
        this.filtro.page = Math.floor((event.first ?? 0) / rows);
        this.getData();
    }

    buscar() {
        this.filtro.page = 0;
        this.getData();
    }

    onRangoChange() {
        this.buscar();
    }

    onChoferChange(chofer: Usuario | undefined) {
        this.chofer = chofer;
        this.buscar();
    }

    limpiar() {
        this.numeroRuta = null;
        this.chofer = undefined;
        this.rango = 'desdeHoy';
        this.buscar();
    }

    getData() {
        this.aplicarFiltros();
        this.loading = true;
        this.rutasService.getAll(this.filtro).subscribe({
            next: (data) => {
                this.data = data;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching rutas:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las rutas' });
                this.loading = false;
            }
        });
    }

    private aplicarFiltros() {
        this.filtro.id = this.numeroRuta ? Number(this.numeroRuta) : null;
        this.filtro.chofer = this.chofer;

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const dias = (n: number) => new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + n);

        switch (this.rango) {
            case 'hoy':
                this.filtro.fechaDesde = hoy;
                this.filtro.fechaHasta = hoy;
                break;
            case 'manana':
                this.filtro.fechaDesde = dias(1);
                this.filtro.fechaHasta = dias(1);
                break;
            case 'semana': {
                // lunes a domingo de la semana actual
                const diaSemana = (hoy.getDay() + 6) % 7; // 0 = lunes
                this.filtro.fechaDesde = dias(-diaSemana);
                this.filtro.fechaHasta = dias(6 - diaSemana);
                break;
            }
            case 'todas':
                this.filtro.fechaDesde = null;
                this.filtro.fechaHasta = null;
                break;
            default: // desdeHoy
                this.filtro.fechaDesde = hoy;
                this.filtro.fechaHasta = null;
        }
        // Con un rango hacia adelante conviene ver primero lo más próximo; en "Todas", lo más reciente.
        this.filtro.sort = this.rango === 'todas' ? 'desc' : 'asc';
    }

    // ---------- Helpers de presentación ----------

    get rutas(): Ruta[] {
        return this.data?.content ?? [];
    }

    fechaCorta(fecha: string | undefined): string {
        if (!fecha) {
            return '';
        }
        const [anio, mes, dia] = fecha.substring(0, 10).split('-');
        return `${dia}/${mes}/${anio}`;
    }

    /** Hoy / Mañana / Ayer para fechas cercanas, útil para leer rápido la tabla. */
    fechaRelativa(fecha: string | undefined): string {
        if (!fecha) {
            return '';
        }
        const [anio, mes, dia] = fecha.substring(0, 10).split('-').map(Number);
        const f = new Date(anio, mes - 1, dia);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const diff = Math.round((f.getTime() - hoy.getTime()) / 86400000);
        if (diff === 0) return 'Hoy';
        if (diff === 1) return 'Mañana';
        if (diff === -1) return 'Ayer';
        if (diff < 0) return `Hace ${-diff} días`;
        return f.toLocaleDateString('es-CL', { weekday: 'long' });
    }

    nombreChofer(ruta: Ruta | undefined): string {
        if (!ruta?.chofer) {
            return 'Sin chofer';
        }
        return `${ruta.chofer.nombre ?? ''} ${ruta.chofer.apellidos ?? ''}`.trim();
    }

    comunas(ruta: Ruta): string[] {
        const set = new Set<string>();
        (ruta.ordenes ?? []).forEach((o) => {
            if (o.escuela?.comuna) {
                set.add(o.escuela.comuna);
            }
        });
        return [...set];
    }

    /** true si la ruta ya visita la misma escuela o comuna que la OS. */
    coincidencia(ruta: Ruta): 'escuela' | 'comuna' | null {
        if (!this.escuela) {
            return null;
        }
        const ordenes = ruta.ordenes ?? [];
        if (ordenes.some((o) => o.escuela?.id === this.escuela?.id)) {
            return 'escuela';
        }
        const comuna = this.escuela.comuna?.trim().toLowerCase();
        if (comuna && ordenes.some((o) => o.escuela?.comuna?.trim().toLowerCase() === comuna)) {
            return 'comuna';
        }
        return null;
    }
}
