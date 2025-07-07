import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Devolucion } from '../models/devolucion.model';
import { Page } from '../../uikit/models/page.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DevolucionesService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/documentos';
    }

    getAll(filtro: any): Observable<Page<Devolucion>> {
        let link = this.url + '?';
        return this.authHttp.get<Page<Devolucion>>(link);
    }
}
