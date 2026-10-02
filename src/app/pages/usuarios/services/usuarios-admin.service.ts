import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from '../../service/auth-http.service';
import { UsuarioAdmin } from '../models/usuario-admin.model';

@Injectable({
    providedIn: 'root'
})
export class UsuariosAdminService {
    url: string = 'api/admin/usuarios';

    constructor(private authHttp: AuthHttpService) {}

    listar(): Observable<UsuarioAdmin[]> {
        return this.authHttp.get<UsuarioAdmin[]>(this.url);
    }

    roles(): Observable<string[]> {
        return this.authHttp.get<string[]>(`${this.url}/roles`);
    }

    /** Crea el usuario en Auth0 y le envía el correo para definir su contraseña. */
    crear(usuario: UsuarioAdmin): Observable<UsuarioAdmin> {
        return this.authHttp.post<UsuarioAdmin>(this.url, usuario);
    }

    actualizar(usuario: UsuarioAdmin): Observable<UsuarioAdmin> {
        return this.authHttp.put<UsuarioAdmin>(`${this.url}/${usuario.id}`, usuario);
    }

    bloquear(id: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/bloquear`, {});
    }

    desbloquear(id: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/desbloquear`, {});
    }

    enviarCorreoClave(id: number): Observable<void> {
        return this.authHttp.post<void>(`${this.url}/${id}/correo-clave`, {});
    }
}
