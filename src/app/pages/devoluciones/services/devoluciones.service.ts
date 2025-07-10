import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Devolucion } from '../models/devolucion.model';
import { Page } from '../../uikit/models/page.model';
import { Observable } from 'rxjs';
import { DevolucionFiltro } from '../models/devolucion-filtro.model';
import { DevolucionDetalle } from '../models/devolucion-detalle.model';

@Injectable({
    providedIn: 'root'
})
export class DevolucionesService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/devoluciones';
    }

    getAll(filtro: DevolucionFiltro): Observable<Page<Devolucion>> {
        let link = this.url + '?size=' + filtro.size + '&page=' + filtro.page + '&sort=' + filtro.sort;
        if (filtro.escuela) {
            link += `&escuela=${filtro.escuela.id}`;
        }
        if (filtro.orden) {
            link += `&orden=${filtro.orden.id}`;
        }
        if (filtro.id) {
            link += `&id=${filtro.id}`;
        }
        return this.authHttp.get<Page<Devolucion>>(link);
    }

    delete(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }

    crear(devolucion: Devolucion): Observable<Devolucion> {
        return this.authHttp.post<Devolucion>(this.url, devolucion);
    }

    agregarDetalle(id: string, item: string): Observable<DevolucionDetalle> {
        return this.authHttp.get<DevolucionDetalle>(`${this.url}/${id}/detalle/${item}`);
    }

    getById(id: string): Observable<Devolucion> {
        return this.authHttp.get<Devolucion>(`${this.url}/${id}`);
    }

    sumarCantidadDetalle(id: string, detalle: { cantidad: number }): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/detalles/${id}/add`, detalle);
    }
}
