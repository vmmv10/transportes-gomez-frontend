import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Page } from '../../uikit/models/page.model';
import { SaldoBodega } from '../models/saldo-bodega.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SaldoBodegaService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/saldo-bodega';
    }

    getSaldoBodega(filtro: any) {
        let link = this.url + '?size=' + filtro.size + '&page=' + filtro.page;
        if (filtro.nombre) {
            link += '&nombre=' + filtro.nombre;
        }
        if (filtro.bodega) {
            link += '&bodega=' + filtro.bodega.id;
        }
        if (filtro.marca) {
            link += '&marca=' + filtro.marca.id;
        }
        if (filtro.categoria) {
            link += '&categoria=' + filtro.categoria.id;
        }
        if (filtro.codigo) {
            link += '&codigo=' + filtro.codigo;
        }
        return this.authHttp.get<Page<SaldoBodega>>(link);
    }

    getByBodegaAndCodigo(bodegaId: number, itemId: number): Observable<SaldoBodega> {
        return this.authHttp.get<SaldoBodega>(`${this.url}/${itemId}/bodega/${bodegaId}`);
    }

    ajustarSaldo(saldoBodega: SaldoBodega, bodega: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/ajustar/${bodega}`, saldoBodega);
    }
}
