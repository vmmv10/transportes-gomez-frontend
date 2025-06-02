import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Escuela } from '../models/escuela.models';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments';
import { AuthHttpService } from '../../service/auth-http.service';

@Injectable({
  providedIn: 'root'
})
export class EscuelasService {

  url: string

  constructor(
    private authHttp: AuthHttpService
  ) {
    this.url = 'api/escuelas';
  }

  getEscuelas(): Observable<Escuela[]> {
    return this.authHttp.get<Escuela[]>(this.url);
  }

  getEscuela(id: string): Observable<Escuela> {
    return this.authHttp.get<Escuela>(`${this.url}/${id}`);
  }

  createEscuela(escuela: Escuela): Observable<Escuela> {
    return this.authHttp.post<Escuela>(this.url, escuela);
  }

  updateEscuela(escuela: Escuela): Observable<Escuela> {
    return this.authHttp.put<Escuela>(`${this.url}/${escuela.id}`, escuela);
  }

  deleteEscuela(id: string): Observable<void> {
    return this.authHttp.delete<void>(`${this.url}/${id}`);
  }
}
