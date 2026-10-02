import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { fechaIsoATexto, fechaLocalAIso } from '../../../uikit/utils/fechas';
import { UsuariosSelectComponent } from '../../../usuarios/components/usuarios-select/usuarios-select.component';
import { Usuario } from '../../../usuarios/models/usuario.model';
import { VehiculoSelectComponent } from '../../../vehiculos/components/vehiculo-select/vehiculo-select.component';
import { RutaCostoFiltro, RutaCostoResumen, TIPOS_COSTO } from '../../models/ruta-costo.model';
import { RutasCostosService } from '../../services/rutas-costos.service';

/** Columnas del reporte: los tipos de costo se agrupan para que la tabla quepa en pantalla. */
const COLUMNAS: { titulo: string; tipos: string[] }[] = [
    { titulo: 'Combustible', tipos: ['COMBUSTIBLE'] },
    { titulo: 'Peajes', tipos: ['PEAJE'] },
    { titulo: 'Cruces', tipos: ['TRANSBORDADOR', 'BARCAZA'] },
    { titulo: 'Lancha', tipos: ['ARRIENDO_LANCHA'] },
    { titulo: 'Viáticos y otros', tipos: ['VIATICO', 'OTRO'] }
];

/** Costo real por ruta: total, por tipo, por kilómetro y por entrega. */
@Component({
    standalone: true,
    selector: 'app-costos-rutas',
    imports: [CommonModule, FormsModule, RouterModule, BreadcrumbModule, ButtonModule, CheckboxModule, DatePickerModule, TableModule, TagModule, ToastModule, TooltipModule, ModalLoadingComponent, UsuariosSelectComponent, VehiculoSelectComponent],
    templateUrl: './costos-rutas.component.html',
    providers: [MessageService]
})
export class CostosRutasComponent implements OnInit {
    breadcrumb: MenuItem[] = [
        { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
        { label: 'Costos de ruta', routerLink: '/costos-rutas' }
    ];
    loading: boolean = false;
    filtro: RutaCostoFiltro = new RutaCostoFiltro();
    chofer: Usuario | undefined;
    rutas: RutaCostoResumen[] = [];
    columnas = COLUMNAS;

    // Totales del período
    total = 0;
    kilometros = 0;
    entregas = 0;
    litros = 0;
    rutasConCosto = 0;
    rutasSinVehiculo = 0;
    totalesColumna: number[] = [];
    /** Arriendo de lancha + barcazas */
    islas = 0;
    /** Costo por km considerando solo las rutas que tienen kilómetros y costos */
    costoPorKm: number | undefined;
    costoPorEntrega: number | undefined;

    constructor(
        private rutasCostosService: RutasCostosService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        const hoy = new Date();
        this.filtro.desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        this.filtro.hasta = hoy;
        this.buscar();
    }

    fechaTexto(fecha: string): string {
        return fechaIsoATexto(fecha);
    }

    monto(r: RutaCostoResumen, i: number): number {
        return COLUMNAS[i].tipos.reduce((s, t) => s + Number(r.porTipo?.[t] ?? 0), 0);
    }

    buscar() {
        this.filtro.chofer = this.chofer?.id ? Number(this.chofer.id) : undefined;
        this.loading = true;
        this.rutasCostosService.resumen(this.filtro).subscribe({
            next: (rutas) => {
                this.rutas = rutas;
                this.calcularTotales();
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(error, 'Error al obtener los costos de ruta'), life: 6000 });
            }
        });
    }

    private calcularTotales() {
        const r = this.rutas;
        this.total = r.reduce((s, x) => s + Number(x.total), 0);
        this.kilometros = r.reduce((s, x) => s + (x.kilometros ?? 0), 0);
        this.entregas = r.reduce((s, x) => s + x.entregas, 0);
        this.litros = r.reduce((s, x) => s + Number(x.litros ?? 0), 0);
        this.rutasConCosto = r.filter((x) => Number(x.total) > 0).length;
        this.rutasSinVehiculo = r.filter((x) => !x.vehiculoId).length;
        this.islas = r.reduce((s, x) => s + Number(x.porTipo?.['ARRIENDO_LANCHA'] ?? 0) + Number(x.porTipo?.['BARCAZA'] ?? 0), 0);
        this.totalesColumna = COLUMNAS.map((_, i) => r.reduce((s, x) => s + this.monto(x, i), 0));

        const conKm = r.filter((x) => (x.kilometros ?? 0) > 0 && Number(x.total) > 0);
        const kmConCosto = conKm.reduce((s, x) => s + (x.kilometros ?? 0), 0);
        this.costoPorKm = kmConCosto > 0 ? Math.round(conKm.reduce((s, x) => s + Number(x.total), 0) / kmConCosto) : undefined;
        const conEntregas = r.filter((x) => x.entregas > 0 && Number(x.total) > 0);
        const entregasConCosto = conEntregas.reduce((s, x) => s + x.entregas, 0);
        this.costoPorEntrega = entregasConCosto > 0 ? Math.round(conEntregas.reduce((s, x) => s + Number(x.total), 0) / entregasConCosto) : undefined;
    }

    limpiar() {
        this.filtro = new RutaCostoFiltro();
        this.chofer = undefined;
        this.ngOnInit();
    }

    /** CSV con separador ";" para que Excel en español lo abra en columnas. */
    exportar() {
        const encabezado = ['Ruta', 'Fecha', 'Estado', 'Chofer', 'Vehículo', 'Km', 'Entregas', ...TIPOS_COSTO.map((t) => t.label), 'Litros', 'Total', 'Costo por km', 'Costo por entrega'];
        const filas = this.rutas.map((r) => [
            r.rutaId,
            this.fechaTexto(r.fecha),
            r.estado,
            r.chofer,
            r.vehiculo,
            r.kilometros ?? '',
            r.entregas,
            ...TIPOS_COSTO.map((t) => r.porTipo?.[t.value] ?? 0),
            r.litros ?? '',
            r.total,
            r.costoPorKm ?? '',
            r.costoPorEntrega ?? ''
        ]);
        const celda = (v: unknown) => {
            const s = String(v ?? '');
            return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };
        const csv = [encabezado, ...filas].map((f) => f.map(celda).join(';')).join('\r\n');
        const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `costos-rutas_${fechaLocalAIso(this.filtro.desde) ?? ''}_${fechaLocalAIso(this.filtro.hasta) ?? ''}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
}
