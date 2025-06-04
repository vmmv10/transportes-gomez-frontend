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

  url: string

  constructor(
    private authHttp: AuthHttpService
  ) {
    this.url = 'api/documentos';
  }

  getAll(filtro: DocumentoFiltro): Observable<Page<Documento>> {
    return this.authHttp.get<Page<Documento>>(this.url);
  }

  get(id: string): Observable<Documento> {
    return this.authHttp.get<Documento>(`${this.url}/${id}`);
  }

  create(documento: Documento): Observable<Documento> {
    return this.authHttp.post<Documento>(this.url, documento);
  }

  update(documento: Documento): Observable<Documento> {
    return this.authHttp.put<Documento>(`${this.url}/${documento.id}`, documento);
  }

  delete(id: string): Observable<void> {
    return this.authHttp.delete<void>(`${this.url}/${id}`);
  }
}
