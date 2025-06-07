import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Proveedor } from '../models/proveedor.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProveedoresService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/proveedores';
    }

    getProveedores(): Observable<Proveedor[]> {
        return this.authHttp.get<Proveedor[]>(this.url);
    }

    getProveedor(id: number): Observable<Proveedor> {
        return this.authHttp.get<Proveedor>(`${this.url}/${id}`);
    }

    createProveedor(proveedor: Proveedor): Observable<Proveedor> {
        return this.authHttp.post<Proveedor>(this.url, proveedor);
    }

    updateProveedor(id: number, proveedor: any) {
        return this.authHttp.put(`${this.url}/${id}`, proveedor);
    }

    desactivateProveedor(id: number) {
        return this.authHttp.put(`${this.url}/${id}/desactivar`, {});
    }
}
