import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca.model';
import { MarcaFiltro } from '../models/marca-filtro.model';
import { Page } from '../../uikit/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  url: string;
  
  constructor(private authHttp: AuthHttpService) {
      this.url = 'api/marcas';
  }

  getAllList(): Observable<Marca[]> {
      return this.authHttp.get<Marca[]>(this.url + '/list');
  }

  getAll(filtro: MarcaFiltro): Observable<Page<Marca>> {
    let link = this.url + '?size=' + filtro.size + '&page=' + filtro.page + '&sort=' + filtro.key + ',' + filtro.sort;
    if (filtro.nombre) {
      link += '&nombre=' + filtro.nombre;
    }
    if (filtro.activo !== undefined) {
      link += '&activo=' + filtro.activo;
    }
    return this.authHttp.get<Page<Marca>>(link);
  }

  getById(id: number): Observable<Marca> {
    return this.authHttp.get<Marca>(this.url + '/' + id);
  }

  create(marca: Marca): Observable<Marca> {
    return this.authHttp.post<Marca>(this.url, marca);
  }

  update(marca: Marca): Observable<Marca> {
    return this.authHttp.put<Marca>(this.url + '/' + marca.id, marca);
  }

  desactivate(id: number): Observable<void> {
    return this.authHttp.put<void>(this.url + '/' + id + '/desactive', null);
  }
}
