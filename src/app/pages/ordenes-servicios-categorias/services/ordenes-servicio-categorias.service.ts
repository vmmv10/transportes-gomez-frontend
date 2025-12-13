import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Page } from '../../uikit/models/page.model';
import { OrdenServicioCategoria } from '../model/orden-servicio-categoria.model';
import { Observable } from 'rxjs';
import { OrdenServicioCategoriaFiltro } from '../model/orden-servicio-categoria-filtro.model';

@Injectable({
    providedIn: 'root'
})
export class OrdenesServicioCategoriasService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/ordenes-servicio-categorias';
    }

    getAll(filtro: OrdenServicioCategoriaFiltro): Observable<Page<OrdenServicioCategoria>> {
        let link = `${this.url}?page=${filtro.page}&size=${filtro.size}`;
        if (filtro.nombre) {
            link += `&nombre=${filtro.nombre}`;
        }
        if (filtro.activo !== undefined) {
            link += `&activo=${filtro.activo}`;
        }
        return this.authHttp.get<Page<OrdenServicioCategoria>>(link);
    }

    getById(id: number): Observable<OrdenServicioCategoria> {
        return this.authHttp.get<OrdenServicioCategoria>(`${this.url}/${id}`);
    }

    create(data: OrdenServicioCategoria): Observable<OrdenServicioCategoria> {
        return this.authHttp.post<OrdenServicioCategoria>(this.url, data);
    }

    update(id: number, data: OrdenServicioCategoria): Observable<OrdenServicioCategoria> {
        return this.authHttp.put<OrdenServicioCategoria>(`${this.url}/${id}`, data);
    }

    desactivate(id: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/desactivate`, {});
    }

    activate(id: number): Observable<void> {
        return this.authHttp.post<void>(`${this.url}/${id}/activate`, {});
    }

    getAllList(): Observable<OrdenServicioCategoria[]> {
        let link = `${this.url}/list`;
        return this.authHttp.get<OrdenServicioCategoria[]>(link);
    }
}
