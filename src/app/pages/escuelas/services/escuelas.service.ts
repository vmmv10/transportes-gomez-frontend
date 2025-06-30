import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Escuela } from '../models/escuela.models';
import { Observable, retry } from 'rxjs';
import { environment } from '../../../../environments';
import { AuthHttpService } from '../../service/auth-http.service';
import { EscuelaFiltro } from '../models/escuela-filtro.model';
import { Page } from '../../uikit/models/page.model';

@Injectable({
    providedIn: 'root'
})
export class EscuelasService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/escuelas';
    }

    getEscuelas(filtro: EscuelaFiltro): Observable<Page<Escuela>> {
        let link = this.url + '?size=' + filtro.size + '&page=' + filtro.page;

        if (filtro.activo) {
            link += '&activo=' + filtro.activo;
        }

        if (filtro.comuna) {
            link += '&comuna=' + filtro.comuna;
        }

        if (filtro.nombre) {
            link += '&nombre=' + filtro.nombre;
        }

        return this.authHttp.get<Page<Escuela>>(link);
    }

    getEscuelasList(): Observable<Escuela[]> {
        return this.authHttp.get<Escuela[]>(this.url + '/list');
    }

    getEscuela(id: string): Observable<Escuela> {
        return this.authHttp.get<Escuela>(`${this.url}/${id}`);
    }

    createEscuela(escuela: Escuela): Observable<Escuela> {
        return this.authHttp.post<Escuela>(this.url, escuela);
    }

    updateEscuela(escuela: Escuela): Observable<Escuela> {
        return this.authHttp.put<Escuela>(`${this.url}/${escuela.id}`, escuela);
    }

    deleteEscuela(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }
}
