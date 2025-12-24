import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Observable } from 'rxjs';
import { Page } from '../../uikit/models/page.model';
import { Entrega } from '../models/entrega.models';
import { EntregaFiltro } from '../models/entrega-filtro.models';
import { Reporte } from '../../uikit/models/reporte.model';
import { Kpi } from '../../uikit/models/Kpi.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class EntregasService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/entregas';
    }

    getAll(filtro: EntregaFiltro): Observable<Page<Entrega>> {
        let link = this.url + '?size=' + filtro.size + '&page=' + filtro.page + '&sort=' + filtro.key + ',' + filtro.sort;
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
        if (filtro.fecha) {
            link += `&fecha=${filtro.fecha}`;
        }
        if (filtro.conductor) {
            link += `&conductor=${filtro.conductor}`;
        }
        if (filtro.oc && filtro.oc.trim() !== '') {
            link += `&oc=${filtro.oc}`;
        }
        if (filtro.categoria != undefined) {
            link += `&categoria=${filtro.categoria.id}`;
        }
        return this.authHttp.get<Page<Entrega>>(link);
    }

    delete(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }

    getEntregasMes(filtro: EntregaFiltro): Observable<Reporte[]> {
        let link = `${this.url}/reporte/mes`;
        if (filtro.escuela) {
            link += `?escuela=${filtro.escuela.id}`;
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

    countEntregasParaHoyPorEscuela(): Observable<number> {
        return this.authHttp.get<number>(`${this.url}/reporte/entregas-por-dia/count`);
    }

    getDashboardData(filtro: EntregaFiltro): Observable<any> {
        let link = `${this.url}/reporte/stats`;
        if (filtro.escuela) {
            link += `?escuela=${filtro.escuela.id}`;
        }
        if (filtro.fecha) {
            link += filtro.escuela ? `&fecha=${filtro.fecha}` : `?fecha=${filtro.fecha}`;
        }
        if (filtro.categoria != undefined) {
            link += filtro.escuela || filtro.fecha ? `&categoria=${filtro.categoria.id}` : `?categoria=${filtro.categoria.id}`;
        }
        if (filtro.oc && filtro.oc.trim() !== '') {
            link += filtro.escuela || filtro.fecha || filtro.categoria ? `&oc=${filtro.oc}` : `?oc=${filtro.oc}`;
        }
        return this.authHttp.get<any>(link);
    }

    getKpis(filtro: EntregaFiltro): Observable<Kpi[]> {
        let link = `${this.url}/reporte/kpis`;
        if (filtro.escuela) {
            link += `?escuela=${filtro.escuela.id}`;
        }
        if (filtro.fecha) {
            link += filtro.escuela ? `&fecha=${filtro.fecha}` : `?fecha=${filtro.fecha}`;
        }
        if (filtro.categoria != undefined) {
            link += filtro.escuela || filtro.fecha ? `&categoria=${filtro.categoria.id}` : `?categoria=${filtro.categoria.id}`;
        }
        return this.authHttp.get<Kpi[]>(link);
    }

    descargarExcel(filtro: EntregaFiltro): Observable<Blob> {
        let params = new HttpParams().set('size', filtro.size).set('page', filtro.page).set('sort', `${filtro.key},${filtro.sort}`);

        if (filtro.id) params = params.set('id', filtro.id);
        if (filtro.ordenServicioId) params = params.set('ordenServicio', filtro.ordenServicioId);
        if (filtro.escuela) params = params.set('escuela', filtro.escuela.id);
        if (filtro.entregado !== undefined) params = params.set('entregado', filtro.entregado);
        if (filtro.fecha) params = params.set('fecha', filtro.fecha);
        if (filtro.conductor) params = params.set('conductor', filtro.conductor);

        return this.authHttp.postBlob(this.url + '/excel', { params, responseType: 'blob' as 'json' });
    }
}
