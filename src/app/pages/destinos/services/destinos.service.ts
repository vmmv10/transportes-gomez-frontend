import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from '../../service/auth-http.service';
import { Page } from '../../uikit/models/page.model';
import { Destino } from '../models/destino.model';
import { DestinoFiltro } from '../models/destino-filtro';

@Injectable({
    providedIn: 'root'
})
export class DestinosService {
    url: string = 'api/destinos';

    constructor(private authHttp: AuthHttpService) {}

    getAll(filtro: DestinoFiltro): Observable<Page<Destino>> {
        const params = new URLSearchParams({ size: String(filtro.size), page: String(filtro.page), sort: filtro.sort });
        if (filtro.nombre?.trim()) {
            params.set('nombre', filtro.nombre.trim());
        }
        if (filtro.tipo) {
            params.set('tipo', filtro.tipo);
        }
        if (filtro.comuna) {
            params.set('comuna', String(filtro.comuna));
        }
        if (filtro.cliente) {
            params.set('cliente', String(filtro.cliente));
        }
        if (filtro.activo !== undefined && filtro.activo !== null) {
            params.set('activo', String(filtro.activo));
        }
        return this.authHttp.get<Page<Destino>>(`${this.url}?${params.toString()}`);
    }

    get(id: number | string): Observable<Destino> {
        return this.authHttp.get<Destino>(`${this.url}/${id}`);
    }

    create(destino: Destino): Observable<Destino> {
        return this.authHttp.post<Destino>(this.url, destino);
    }

    update(destino: Destino): Observable<Destino> {
        return this.authHttp.put<Destino>(`${this.url}/${destino.id}`, destino);
    }

    desactivar(id: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/desactivar`, {});
    }

    activar(id: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/activar`, {});
    }
}
