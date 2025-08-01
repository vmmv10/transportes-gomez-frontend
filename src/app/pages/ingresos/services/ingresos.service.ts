import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { IngresoFiltro } from '../models/ingreso-filtro.model';
import { Observable } from 'rxjs';
import { Page } from '../../uikit/models/page.model';
import { Ingreso } from '../models/ingreso.model';
import { IngresoDetalle } from '../models/ingreso-detalle.model';

@Injectable({
    providedIn: 'root'
})
export class IngresosService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/ingresos';
    }

    getAll(filtro: IngresoFiltro): Observable<Page<Ingreso>> {
        let link = this.url + '?size=' + filtro.size + '&page=' + filtro.page;
        if (filtro.documento) {
            link += '&documento=' + filtro.documento.id;
        }
        if (filtro.estado !== undefined) {
            link += '&estado=' + filtro.estado;
        }
        if (filtro.id) {
            link += '&id=' + filtro.id;
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

    modificarDetalle(id: string, detalle: IngresoDetalle): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/detalles/${id}/editar-cantidad`, detalle);
    }

    eliminarDetalle(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/detalles/${id}`);
    }

    getTemporal(): Observable<Ingreso> {
        return this.authHttp.get<Ingreso>(`${this.url}/temporal`);
    }
}
