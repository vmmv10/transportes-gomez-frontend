import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { EmergenciaIngresoFiltro } from '../models/emergencia-ingreso-filtro.model';
import { Page } from '../../uikit/models/page.model';
import { EmergenciaIngreso } from '../models/emergencia-ingreso.model';
import { Observable } from 'rxjs';
import { EmergenciaIngresosDetalle } from '../models/emergencia-ingresos-detalle.model';

@Injectable({
  providedIn: 'root'
})
export class EmergenciasIngresosService {
  url: string;

  constructor(private authHttp: AuthHttpService) {
      this.url = 'api/ingresos-emergencia';
  }

  getAll(filtro: EmergenciaIngresoFiltro): Observable<Page<EmergenciaIngreso>> {
      let link = this.url + '?size=' + filtro.size + '&page=' + filtro.page;
      if (filtro.documento) {
          link += '&documento=' + filtro.documento.id;
      }
      if (filtro.estado !== undefined) {
          link += '&estado=' + filtro.estado;
      }
      if (filtro.id) {
          link += '&id=' + filtro.id;
      }
     
      return this.authHttp.get<Page<EmergenciaIngreso>>(link);
  }

  delete(id: string): Observable<void> {
      return this.authHttp.delete<void>(`${this.url}/${id}`);
  }

  crear(devolucion: EmergenciaIngreso): Observable<EmergenciaIngreso> {
      return this.authHttp.post<EmergenciaIngreso>(this.url, devolucion);
  }

  agregarDetalle(id: string, item: string): Observable<EmergenciaIngresosDetalle> {
      return this.authHttp.get<EmergenciaIngresosDetalle>(`${this.url}/${id}/detalle/${item}`);
  }

  getById(id: string): Observable<EmergenciaIngreso> {
      return this.authHttp.get<EmergenciaIngreso>(`${this.url}/${id}`);
  }

  sumarCantidadDetalle(id: string, detalle: { cantidad: number }): Observable<void> {
      return this.authHttp.put<void>(`${this.url}/detalles/${id}/add`, detalle);
  }

  cerrar(id: string): Observable<void> {
      return this.authHttp.put<void>(`${this.url}/${id}/cerrar`, {});
  }

  abrir(id: string): Observable<void> {
      return this.authHttp.put<void>(`${this.url}/${id}/abrir`, {});
  }

  modificarDetalle(id: string, detalle: EmergenciaIngresosDetalle): Observable<void> {
      return this.authHttp.put<void>(`${this.url}/detalles/${id}/editar-cantidad`, detalle);
  }

  eliminarDetalle(id: string): Observable<void> {
      return this.authHttp.delete<void>(`${this.url}/detalles/${id}`);
  }
}
