import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Observable } from 'rxjs';
import { RutaFiltro } from '../models/ruta-filtro.model';
import { Ruta } from '../models/ruta.model';
import { Page } from '../../uikit/models/page.model';

@Injectable({
    providedIn: 'root'
})
export class RutasService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/rutas';
    }

    getAll(filtro: RutaFiltro): Observable<Page<Ruta>> {
        let link = this.url + '?' + `page=${filtro.page}&size=${filtro.size}&`;
        if (filtro.id) {
            link += `id=${filtro.id}&`;
        }
        if (filtro.fechaDesde) {
            link += `fechaDesde=${filtro.fechaDesde.toISOString()}&`;
        }
        if (filtro.fechaHasta) {
            link += `fechaHasta=${filtro.fechaHasta.toISOString()}&`;
        }
        if (filtro.chofer) {
            link += `choferId=${filtro.chofer.id}&`;
        }
        if (filtro.estado) {
            link += `estado=${filtro.estado}&`;
        }
        return this.authHttp.get<Page<Ruta>>(link);
    }

    get(id: string): Observable<Ruta> {
        return this.authHttp.get<Ruta>(`${this.url}/${id}`);
    }

    create(ruta: Ruta): Observable<Ruta> {
        return this.authHttp.post<Ruta>(this.url, ruta);
    }

    update(ruta: Ruta): Observable<Ruta> {
        return this.authHttp.put<Ruta>(`${this.url}/${ruta.id}`, ruta);
    }

    delete(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }

    deleteEntrega(id: string, orden: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}/ordenes-servicios/${orden}`);
    }
}
