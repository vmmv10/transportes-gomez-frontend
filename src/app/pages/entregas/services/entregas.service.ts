import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Observable } from 'rxjs';
import { Page } from '../../uikit/models/page.model';
import { Entrega } from '../models/entrega.models';
import { EntregaFiltro } from '../models/entrega-filtro.models';
import { Reporte } from '../../uikit/models/reporte.model';

@Injectable({
    providedIn: 'root'
})
export class EntregasService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/entregas';
    }

    getAll(filtro: EntregaFiltro): Observable<Page<Entrega>> {
        let link = this.url + '?size=' + filtro.size + '&page=' + filtro.page;
        if (filtro.id) {
            link += `&id=${filtro.id}`;
        }
        if (filtro.ordenServicioId) {
            link += `&ordenServicio=${filtro.ordenServicioId}`;
        }
        if (filtro.escuela != undefined) {
            link += `&escuela=${filtro.escuela.id}`;
        }
        if (filtro.entregado != undefined) {
            link += `&entregado=${filtro.entregado}`;
        }
        return this.authHttp.get<Page<Entrega>>(link);
    }

    delete(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }

    getEntregasMes(filtro: EntregaFiltro): Observable<Reporte[]> {
        let link = `${this.url}/reporte/mes`;
        if (filtro.escuela) {
            link += `?escuela=${filtro.escuela}`;
        }
        return this.authHttp.get<Reporte[]>(link);
    }

    entregaRecepcionada(id: string, files: any[]): Observable<void> {
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append('files', file);
        });
        return this.authHttp.put<void>(`${this.url}/${id}/recepcionado`, formData);
    }

    getTopEscuelas(filtro: EntregaFiltro): Observable<Reporte[]> {
        let link = `${this.url}/reporte/top-escuelas` + `?size=${filtro.size}`;
        if (filtro.escuela) {
            link += `&escuela=${filtro.escuela.id}`;
        }
        return this.authHttp.get<Reporte[]>(link);
    }
}
