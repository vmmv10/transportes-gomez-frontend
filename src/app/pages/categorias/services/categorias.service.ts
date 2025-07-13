import { Injectable } from '@angular/core';
import { environment } from '../../../../environments';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { AuthHttpService } from '../../service/auth-http.service';
import { Page } from '../../uikit/models/page.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  url: string;

  constructor(private authHttp: AuthHttpService) {
    this.url = 'api/categorias';
  }

  getAllList(): Observable<Categoria[]> {
    return this.authHttp.get<Categoria[]>(this.url + '/list');
  }

  getAll(): Observable<Page<Categoria>> {
    return this.authHttp.get<Page<Categoria>>(this.url);
  }

  getById(id: number): Observable<Categoria> {
    return this.authHttp.get<Categoria>(this.url + '/' + id);
  }

  create(categoria: Categoria): Observable<Categoria> {
    return this.authHttp.post<Categoria>(this.url, categoria);
  }

  update(categoria: Categoria): Observable<Categoria> {
    return this.authHttp.put<Categoria>(this.url + '/' + categoria.id, categoria);
  }

  desactivate(id: number): Observable<void> {
    return this.authHttp.put<void>(this.url + '/' + id + '/desactivate', null);
  }
}
