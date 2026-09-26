import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from '../../service/auth-http.service';
import { Page } from '../../uikit/models/page.model';
import { Cliente } from '../models/cliente.model';
import { ClienteFiltro } from '../models/cliente-filtro';

@Injectable({
    providedIn: 'root'
})
export class ClientesService {
    url: string = 'api/clientes';

    constructor(private authHttp: AuthHttpService) {}

    getAll(filtro: ClienteFiltro): Observable<Page<Cliente>> {
        const params = new URLSearchParams({ size: String(filtro.size), page: String(filtro.page), sort: filtro.sort });
        if (filtro.nombre?.trim()) {
            params.set('nombre', filtro.nombre.trim());
        }
        if (filtro.rut?.trim()) {
            params.set('rut', filtro.rut.trim());
        }
        if (filtro.sector) {
            params.set('sector', filtro.sector);
        }
        if (filtro.activo !== undefined && filtro.activo !== null) {
            params.set('activo', String(filtro.activo));
        }
        return this.authHttp.get<Page<Cliente>>(`${this.url}?${params.toString()}`);
    }

    /** Clientes activos, ordenados por razón social (para selects). */
    getList(): Observable<Cliente[]> {
        return this.authHttp.get<Cliente[]>(`${this.url}/list`);
    }

    get(id: number | string): Observable<Cliente> {
        return this.authHttp.get<Cliente>(`${this.url}/${id}`);
    }

    create(cliente: Cliente): Observable<Cliente> {
        return this.authHttp.post<Cliente>(this.url, cliente);
    }

    update(cliente: Cliente): Observable<Cliente> {
        return this.authHttp.put<Cliente>(`${this.url}/${cliente.id}`, cliente);
    }

    desactivar(id: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/desactivar`, {});
    }

    activar(id: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/activar`, {});
    }
}
