import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Observable } from 'rxjs';
import { Page } from '../../uikit/models/page.model';
import { Entrega } from '../models/entrega.models';
import { EntregaFiltro } from '../models/entrega-filtro.models';
import { ReporteMes } from '../../uikit/models/reporte-mes.model';

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
            link += `&escuela=${filtro.escuela}`;
        }
        if (filtro.entregado != undefined) {
            link += `&entregado=${filtro.entregado}`;
        }
        return this.authHttp.get<Page<Entrega>>(link);
    }

    delete(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }

    getEntregasMes(filtro: EntregaFiltro): Observable<ReporteMes[]> {
        let link = `${this.url}/reporte/mes`;
        if (filtro.escuela) {
            link += `?escuela=${filtro.escuela}`;
        }
        return this.authHttp.get<ReporteMes[]>(link);
    }

    entregaRecepcionada(id: string): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/recepcionado`, {});
    }
}
