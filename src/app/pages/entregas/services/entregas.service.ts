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
        let link = this.url + '?';
        if (filtro.id) {
            link += `id=${filtro.id}&`;
        }
        if (filtro.ordenServicioId) {
            link += `ordenServicio=${filtro.ordenServicioId}&`;
        }
        if (filtro.escuela != undefined) {
            link += `escuela=${filtro.escuela}&`;
        }
        if (filtro.entregado != undefined) {
            link += `entregado=${filtro.entregado}&`;
        }
        return this.authHttp.get<Page<Entrega>>(link);
    }

    delete(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }

    getEntregasMes(): Observable<ReporteMes[]> {
        return this.authHttp.get<ReporteMes[]>(`${this.url}/reporte/mes`);
    }
}
