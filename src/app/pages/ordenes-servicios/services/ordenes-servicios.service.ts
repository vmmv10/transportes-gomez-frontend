import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { OrdenServicio } from '../models/orden-servicio.model';
import { Observable } from 'rxjs';
import { Page } from '../../uikit/models/page.model';
import { OrdenServicioFiltro } from '../models/orden-servicio-filtro.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenesServiciosService {

  url: string

  constructor(
    private authHttp: AuthHttpService
  ) {
    this.url = 'api/ordenes-servicios';
  }

  getAll(filtro: OrdenServicioFiltro): Observable<Page<OrdenServicio>> {
    let link = this.url + '?';
    if (filtro.id) {
      link += `id=${filtro.id}&`;
    }
    if (filtro.escuela) {
      link += `escuela=${filtro.escuela.id}&`;
    }
    if (filtro.fecha) {
      link += `fecha=${filtro.fecha.toISOString()}&`;
    }
    return this.authHttp.get<Page<OrdenServicio>>(link);
  }

  get(id: string): Observable<OrdenServicio> {
    return this.authHttp.get<OrdenServicio>(`${this.url}/${id}`);
  }

  create(orden: OrdenServicio): Observable<OrdenServicio> {
    return this.authHttp.post<OrdenServicio>(this.url, orden);
  }

  update(orden: OrdenServicio): Observable<OrdenServicio> {
    return this.authHttp.put<OrdenServicio>(`${this.url}/${orden.id}`, orden);
  }

  delete(id: string): Observable<void> {
    return this.authHttp.delete<void>(`${this.url}/${id}`);
  }
}
