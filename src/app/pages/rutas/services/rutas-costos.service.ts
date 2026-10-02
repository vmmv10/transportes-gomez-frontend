import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from '../../service/auth-http.service';
import { fechaLocalAIso } from '../../uikit/utils/fechas';
import { RutaCosto, RutaCostoFiltro, RutaCostoResumen } from '../models/ruta-costo.model';

@Injectable({
    providedIn: 'root'
})
export class RutasCostosService {
    constructor(private authHttp: AuthHttpService) {}

    listar(rutaId: number): Observable<RutaCosto[]> {
        return this.authHttp.get<RutaCosto[]>(`api/rutas/${rutaId}/costos`);
    }

    crear(rutaId: number, costo: RutaCosto): Observable<RutaCosto> {
        return this.authHttp.post<RutaCosto>(`api/rutas/${rutaId}/costos`, costo);
    }

    actualizar(rutaId: number, costo: RutaCosto): Observable<RutaCosto> {
        return this.authHttp.put<RutaCosto>(`api/rutas/${rutaId}/costos/${costo.id}`, costo);
    }

    eliminar(rutaId: number, costoId: number): Observable<void> {
        return this.authHttp.delete<void>(`api/rutas/${rutaId}/costos/${costoId}`);
    }

    /** Costo real por ruta en un rango de fechas. */
    resumen(filtro: RutaCostoFiltro): Observable<RutaCostoResumen[]> {
        const params = new URLSearchParams();
        const desde = fechaLocalAIso(filtro.desde);
        const hasta = fechaLocalAIso(filtro.hasta);
        if (desde) {
            params.set('desde', desde);
        }
        if (hasta) {
            params.set('hasta', hasta);
        }
        if (filtro.vehiculo) {
            params.set('vehiculo', String(filtro.vehiculo));
        }
        if (filtro.chofer) {
            params.set('chofer', String(filtro.chofer));
        }
        if (filtro.conCostos) {
            params.set('conCostos', 'true');
        }
        return this.authHttp.get<RutaCostoResumen[]>(`api/costos-rutas/resumen?${params.toString()}`);
    }
}
