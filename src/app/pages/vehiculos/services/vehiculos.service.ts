import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from '../../service/auth-http.service';
import { Page } from '../../uikit/models/page.model';
import { Vehiculo, VehiculoFiltro, VehiculoTipo } from '../models/vehiculo.model';

@Injectable({
    providedIn: 'root'
})
export class VehiculosService {
    url: string = 'api/vehiculos';

    constructor(private authHttp: AuthHttpService) {}

    getAll(filtro: VehiculoFiltro): Observable<Page<Vehiculo>> {
        const params = new URLSearchParams({ size: String(filtro.size), page: String(filtro.page), sort: filtro.sort });
        if (filtro.texto?.trim()) {
            params.set('texto', filtro.texto.trim());
        }
        if (filtro.tipo) {
            params.set('tipo', filtro.tipo);
        }
        if (filtro.propiedad) {
            params.set('propiedad', filtro.propiedad);
        }
        if (filtro.estado) {
            params.set('estado', filtro.estado);
        }
        if (filtro.activo !== undefined && filtro.activo !== null) {
            params.set('activo', String(filtro.activo));
        }
        return this.authHttp.get<Page<Vehiculo>>(`${this.url}?${params.toString()}`);
    }

    /** Vehículos activos para selectores, opcionalmente de un tipo. */
    getActivos(tipo?: VehiculoTipo): Observable<Vehiculo[]> {
        return this.authHttp.get<Vehiculo[]>(tipo ? `${this.url}/activos?tipo=${tipo}` : `${this.url}/activos`);
    }

    get(id: number): Observable<Vehiculo> {
        return this.authHttp.get<Vehiculo>(`${this.url}/${id}`);
    }

    create(vehiculo: Vehiculo): Observable<Vehiculo> {
        return this.authHttp.post<Vehiculo>(this.url, vehiculo);
    }

    update(vehiculo: Vehiculo): Observable<Vehiculo> {
        return this.authHttp.put<Vehiculo>(`${this.url}/${vehiculo.id}`, vehiculo);
    }

    activar(id: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/activar`, {});
    }

    desactivar(id: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/desactivar`, {});
    }

    /** Solo se puede eliminar si no se ha usado en rutas ni costos (lo valida el backend). */
    eliminar(id: number): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }
}
