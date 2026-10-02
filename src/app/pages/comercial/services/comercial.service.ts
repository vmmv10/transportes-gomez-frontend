import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from '../../service/auth-http.service';
import { Page } from '../../uikit/models/page.model';
import { Cotizacion, CotizacionEstado, CotizacionFiltro, MensajeContacto, Pendientes, Tarifa, TarifaFiltro, TarifaSugerida } from '../models/comercial.models';

@Injectable({
    providedIn: 'root'
})
export class ComercialService {
    constructor(private authHttp: AuthHttpService) {}

    // ---- Tarifas ----
    getTarifas(filtro: TarifaFiltro): Observable<Page<Tarifa>> {
        const p = new URLSearchParams({ size: String(filtro.size), page: String(filtro.page), sort: filtro.sort });
        if (filtro.cliente) p.set('cliente', String(filtro.cliente));
        if (filtro.servicio) p.set('servicio', String(filtro.servicio));
        if (filtro.comuna) p.set('comuna', String(filtro.comuna));
        if (filtro.activo !== undefined && filtro.activo !== null) p.set('activo', String(filtro.activo));
        if (filtro.vigente) p.set('vigente', 'true');
        return this.authHttp.get<Page<Tarifa>>(`api/tarifas?${p.toString()}`);
    }

    guardarTarifa(tarifa: Tarifa): Observable<Tarifa> {
        return tarifa.id ? this.authHttp.put<Tarifa>(`api/tarifas/${tarifa.id}`, tarifa) : this.authHttp.post<Tarifa>('api/tarifas', tarifa);
    }

    cambiarActivoTarifa(id: number, activar: boolean): Observable<void> {
        return this.authHttp.put<void>(`api/tarifas/${id}/${activar ? 'activar' : 'desactivar'}`, {});
    }

    eliminarTarifa(id: number): Observable<void> {
        return this.authHttp.delete<void>(`api/tarifas/${id}`);
    }

    // ---- Cotizaciones ----
    getCotizaciones(filtro: CotizacionFiltro): Observable<Page<Cotizacion>> {
        const p = new URLSearchParams({ size: String(filtro.size), page: String(filtro.page), sort: filtro.sort });
        if (filtro.estado) p.set('estado', filtro.estado);
        else if (filtro.pendientes) p.set('pendientes', 'true');
        if (filtro.texto?.trim()) p.set('texto', filtro.texto.trim());
        return this.authHttp.get<Page<Cotizacion>>(`api/cotizaciones?${p.toString()}`);
    }

    getPendientes(): Observable<Pendientes> {
        return this.authHttp.get<Pendientes>('api/cotizaciones/pendientes');
    }

    getCotizacion(id: number | string): Observable<Cotizacion> {
        return this.authHttp.get<Cotizacion>(`api/cotizaciones/${id}`);
    }

    guardarCotizacion(c: Cotizacion): Observable<Cotizacion> {
        return c.id ? this.authHttp.put<Cotizacion>(`api/cotizaciones/${c.id}`, c) : this.authHttp.post<Cotizacion>('api/cotizaciones', c);
    }

    cambiarEstado(id: number, estado: CotizacionEstado): Observable<Cotizacion> {
        return this.authHttp.put<Cotizacion>(`api/cotizaciones/${id}/estado?estado=${estado}`, {});
    }

    /** Si el servidor tiene configurado el envío de correos. */
    correoHabilitado(): Observable<{ habilitado: boolean }> {
        return this.authHttp.get<{ habilitado: boolean }>('api/cotizaciones/correo');
    }

    /** Envía la cotización por correo al solicitante y la deja como enviada. */
    enviarPorCorreo(id: number, mensaje: string | undefined): Observable<Cotizacion> {
        return this.authHttp.post<Cotizacion>(`api/cotizaciones/${id}/enviar-correo`, { mensaje: mensaje?.trim() || null });
    }

    sugerir(id: number): Observable<TarifaSugerida> {
        return this.authHttp.get<TarifaSugerida>(`api/cotizaciones/${id}/sugerir`);
    }

    // ---- Mensajes de contacto ----
    getMensajes(atendido: boolean | undefined, page: number, size: number, motivo?: string | null): Observable<Page<MensajeContacto>> {
        const p = new URLSearchParams({ size: String(size), page: String(page), sort: 'fechaCreacion,desc' });
        if (atendido !== undefined) p.set('atendido', String(atendido));
        if (motivo) p.set('motivo', motivo);
        return this.authHttp.get<Page<MensajeContacto>>(`api/mensajes-contacto?${p.toString()}`);
    }

    marcarAtendido(id: number, valor: boolean): Observable<void> {
        return this.authHttp.put<void>(`api/mensajes-contacto/${id}/atendido?valor=${valor}`, {});
    }
}
