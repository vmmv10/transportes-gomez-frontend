import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Observable } from 'rxjs';
import { Bodega } from '../models/Bodega.model';

@Injectable({
    providedIn: 'root'
})
export class BodegasService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/bodegas';
    }

    getBodegas(): Observable<Bodega[]> {
        return this.authHttp.get<Bodega[]>(this.url);
    }

    getBodega(id: number): Observable<Bodega> {
        return this.authHttp.get<Bodega>(`${this.url}/${id}`);
    }

    addBodega(bodega: Bodega): Observable<Bodega> {
        return this.authHttp.post<Bodega>(this.url, bodega);
    }

    updateBodega(bodega: Bodega): Observable<Bodega> {
        return this.authHttp.put<Bodega>(`${this.url}/${bodega.id}`, bodega);
    }

    desactive(id: number): Observable<Bodega> {
        return this.authHttp.delete<Bodega>(`${this.url}/${id}/desactivate`);
    }
}
