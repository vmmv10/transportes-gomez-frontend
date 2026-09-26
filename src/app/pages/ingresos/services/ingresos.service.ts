import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { IngresoFiltro } from '../models/ingreso-filtro.model';
import { Observable } from 'rxjs';
import { Page } from '../../uikit/models/page.model';
import { Ingreso } from '../models/ingreso.model';
import { IngresoDetalle } from '../models/ingreso-detalle.model';
import { IngresoConversacion } from '../models/ingreso-conversacion.model';
import { IngresoMensaje } from '../models/ingreso-mensaje.model';

@Injectable({
    providedIn: 'root'
})
export class IngresosService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/ingresos';
    }

    getAll(filtro: IngresoFiltro): Observable<Page<Ingreso>> {
        let link = this.url + '?size=' + filtro.size + '&page=' + filtro.page + '&sort=' + filtro.key + ',' + filtro.sort;
        if (filtro.documento) {
            link += '&documento=' + filtro.documento;
        }
        if (filtro.estado) {
            link += '&estado=' + filtro.estado;
        }
        if (filtro.id) {
            link += '&id=' + filtro.id;
        }
        if (filtro.ordenCompra) {
            link += '&ordenCompra=' + filtro.ordenCompra;
        }
        return this.authHttp.get<Page<Ingreso>>(link);
    }

    delete(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }

    crear(devolucion: Ingreso): Observable<Ingreso> {
        return this.authHttp.post<Ingreso>(this.url, devolucion);
    }

    agregarDetalle(id: string, item: string): Observable<IngresoDetalle> {
        return this.authHttp.get<IngresoDetalle>(`${this.url}/${id}/detalle/${item}`);
    }

    getById(id: string): Observable<Ingreso> {
        return this.authHttp.get<Ingreso>(`${this.url}/${id}`);
    }

    sumarCantidadDetalle(id: string, detalle: { cantidad: number }): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/detalles/${id}/add`, detalle);
    }

    cerrar(id: string): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/cerrar`, {});
    }

    abrir(id: string): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/abrir`, {});
    }

    habilitar(id: string): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/habilitar`, {});
    }

    inhabilitar(id: string): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/inhabilitar`, {});
    }

    modificarDetalle(id: string, detalle: IngresoDetalle): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/detalles/${id}/editar-cantidad`, detalle);
    }

    eliminarDetalle(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/detalles/${id}`);
    }

    getTemporal(): Observable<Ingreso> {
        return this.authHttp.get<Ingreso>(`${this.url}/temporal`);
    }

    getConversacion(id: string): Observable<IngresoConversacion> {
        return this.authHttp.get<IngresoConversacion>(`${this.url}/${id}/conversacion`);
    }

    crearMensaje(id: string, mensaje: IngresoMensaje): Observable<IngresoMensaje> {
        return this.authHttp.post<IngresoMensaje>(`${this.url}/${id}/conversacion/mensaje`, mensaje);
    }
}