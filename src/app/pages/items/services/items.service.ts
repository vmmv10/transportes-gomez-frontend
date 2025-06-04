import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Page } from '../../uikit/models/page.model';
import { Item } from '../models/item.model';
import { Observable } from 'rxjs';
import { ItemFiltro } from '../models/item-filtro.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  url: string

  constructor(
    private authHttp: AuthHttpService
  ) {
    this.url = 'api/items';
  }

  getAll(filtro: ItemFiltro): Observable<Page<Item>> {
    let link = this.url + '?';
    if (filtro.nombre) {
      link += `nombre=${filtro.nombre}&`;
    }
    if (filtro.activo) {
      link += `activo=${filtro.activo}&`;
    }
    return this.authHttp.get<Page<Item>>(link);
  }

  get(id: string): Observable<Item> {
    return this.authHttp.get<Item>(`${this.url}/${id}`);
  }

  create(item: Item): Observable<Item> {
    return this.authHttp.post<Item>(this.url, item);
  }

  update(item: Item): Observable<Item> {
    return this.authHttp.put<Item>(`${this.url}/${item.id}`, item);
  }

  delete(id: string): Observable<void> {
    return this.authHttp.delete<void>(`${this.url}/${id}`);
  }

  desactivar(id: string): Observable<void> {
    return this.authHttp.put<void>(`${this.url}/${id}/desactivate`, {});
  }
}
