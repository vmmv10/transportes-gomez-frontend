import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Proveedor } from '../models/proveedor.model';
import { Observable } from 'rxjs';
import { ProveedorFiltro } from '../models/proveedor-filtro';
import { Page } from '../../uikit/models/page.model';

@Injectable({
    providedIn: 'root'
})
export class ProveedoresService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/proveedores';
    }

    getProveedoresList(): Observable<Proveedor[]> {
        return this.authHttp.get<Proveedor[]>(this.url + '/list');
    }

    getProveedor(id: string): Observable<Proveedor> {
        return this.authHttp.get<Proveedor>(`${this.url}/${id}`);
    }

    createProveedor(proveedor: Proveedor): Observable<Proveedor> {
        return this.authHttp.post<Proveedor>(this.url, proveedor);
    }

    updateProveedor(proveedor: Proveedor) {
        return this.authHttp.put(`${this.url}/${proveedor.id}`, proveedor);
    }

    desactivateProveedor(id: number) {
        return this.authHttp.put(`${this.url}/${id}/desactivar`, {});
    }

    getAll(filtro: ProveedorFiltro): Observable<Page<Proveedor>> {
        let link = `${this.url}?size=${filtro.size}&page=${filtro.page}&sort=${filtro.sort}`;

        if (filtro.nombre) {
            link += `&nombre=${filtro.nombre}`;
        }

        if (filtro.rut) {
            link += `&rut=${filtro.rut}`;
        }

        if (filtro.activo !== undefined) {
            link += `&activo=${filtro.activo}`;
        }

        return this.authHttp.get<Page<Proveedor>>(link);
    }
}
