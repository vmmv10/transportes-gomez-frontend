import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsuariosService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/usuarios';
    }

    getAll(filtro: Usuario): Observable<Usuario[]> {
        let link = this.url + '?';
        if (filtro.id != '') {
            link += `id=${filtro.id}&`;
        }
        if (filtro.nombre != '') {
            link += `nombre=${filtro.nombre}&`;
        }
        if (filtro.rol != '') {
            link += `rol=${filtro.rol}&`;
        }
        if (filtro.email != '') {
            link += `email=${filtro.email}&`;
        }
        return this.authHttp.get<Usuario[]>(link);
    }

    get(id: string): Observable<Usuario> {
        return this.authHttp.get<Usuario>(`${this.url}/${id}`);
    }

    getUsuario(): Observable<Usuario> {
        return this.authHttp.get<Usuario>(`${this.url}/autenticado`);
    }

    update(usuario: Usuario): Observable<Usuario> {
        return this.authHttp.put<Usuario>(`${this.url}/${usuario.id}`, usuario);
    }
}
