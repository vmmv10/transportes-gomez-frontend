import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Page } from '../../uikit/models/page.model';
import { Documento } from '../models/documento.model';
import { Observable } from 'rxjs';
import { DocumentoFiltro } from '../models/documento-filtro.model';

@Injectable({
    providedIn: 'root'
})
export class DocumentosService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/documentos';
    }

    getAll(filtro: DocumentoFiltro): Observable<Page<Documento>> {
        let link = this.url + '?';
        if (filtro.numero) {
            link += `id=${filtro.numero}&`;
        }
        if (filtro.tipo) {
            link += `tipo=${filtro.tipo.codigo}&`;
        }
        if (filtro.proveedor) {
            link += `proveedor=${filtro.proveedor.id}&`;
        }
        if (filtro.escuela) {
            link += `escuela=${filtro.escuela.id}&`;
        }
        if (filtro.asignado !== undefined) {
            link += `asignado=${filtro.asignado}&`;
        }
        return this.authHttp.get<Page<Documento>>(link);
    }

    get(id: string): Observable<Documento> {
        return this.authHttp.get<Documento>(`${this.url}/${id}`);
    }

    getByNumeroAndTipo(id: string, tipo: string): Observable<Documento> {
        return this.authHttp.get<Documento>(`${this.url}/${id}/${tipo}`);
    }

    create(documento: Documento, files: any[]): Observable<Documento> {
        const formData = new FormData();

        formData.append('documento', new Blob([JSON.stringify(documento)], { type: 'application/json' }));

        files.forEach((file, index) => {
            formData.append('files', file);
        });

        return this.authHttp.post<Documento>(this.url, formData);
    }

    update(documento: Documento, files: any[]): Observable<Documento> {
        const formData = new FormData();

        formData.append('documento', new Blob([JSON.stringify(documento)], { type: 'application/json' }));

        files.forEach((file, index) => {
            formData.append('files', file);
        });
        return this.authHttp.put<Documento>(`${this.url}/${documento.id}`, formData);
    }

    delete(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }
}
