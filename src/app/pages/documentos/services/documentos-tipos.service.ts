import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { DocumentoTipo } from '../models/documento-tipo.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DocumentosTiposService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/documentos-tipos';
    }

    getTiposDocumentos(): Observable<DocumentoTipo[]> {
        return this.authHttp.get<DocumentoTipo[]>(this.url);
    }
}
