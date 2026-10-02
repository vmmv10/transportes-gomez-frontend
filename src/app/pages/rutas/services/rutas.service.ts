import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Observable } from 'rxjs';
import { RutaFiltro } from '../models/ruta-filtro.model';
import { Ruta } from '../models/ruta.model';
import { Page } from '../../uikit/models/page.model';

@Injectable({
    providedIn: 'root'
})
export class RutasService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/rutas';
    }

    getAll(filtro: RutaFiltro): Observable<Page<Ruta>> {
        let link = this.url + '?' + `page=${filtro.page}&size=${filtro.size}&sort=${filtro.key},${filtro.sort}`;
        if (filtro.id) {
            link += `&id=${filtro.id}`;
        }
        if (filtro.fechaDesde) {
            link += `&fechaDesde=${this.fechaLocal(filtro.fechaDesde)}`;
        }
        if (filtro.fechaHasta) {
            link += `&fechaHasta=${this.fechaLocal(filtro.fechaHasta)}`;
        }
        if (filtro.chofer) {
            link += `&chofer=${filtro.chofer.id}`;
        }
        if (filtro.vehiculo) {
            link += `&vehiculo=${filtro.vehiculo}`;
        }
        if (filtro.estado !== undefined) {
            if (filtro.estado === true) {
                link += `&estado=FINALIZADA`;
            } else {
                link += `&estado=PENDIENTE`;
            }
        }
        return this.authHttp.get<Page<Ruta>>(link);
    }

    /** yyyy-MM-dd en hora local (toISOString adelanta un día en la noche en Chile). */
    private fechaLocal(fecha: Date): string {
        const y = fecha.getFullYear();
        const m = String(fecha.getMonth() + 1).padStart(2, '0');
        const d = String(fecha.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    get(id: string): Observable<Ruta> {
        return this.authHttp.get<Ruta>(`${this.url}/${id}`);
    }

    create(ruta: Ruta): Observable<Ruta> {
        return this.authHttp.post<Ruta>(this.url, ruta);
    }

    update(ruta: Ruta): Observable<Ruta> {
        return this.authHttp.put<Ruta>(`${this.url}/${ruta.id}`, ruta);
    }

    delete(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }

    deleteEntrega(id: string, orden: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}/ordenes-servicios/${orden}`);
    }

    getRutaHoy(): Observable<Ruta> {
        return this.authHttp.get<Ruta>(`${this.url}/fecha-hoy`);
    }

    /** El odómetro de salida es obligatorio para comenzar. */
    comenzarRuta(ruta: number, kmSalida: number): Observable<Ruta> {
        return this.authHttp.put<Ruta>(`${this.url}/${ruta}/comenzar`, { kmSalida });
    }

    /** Kilómetros recorridos, u odómetro de salida y llegada (el backend calcula los kilómetros). */
    asignarKilometros(ruta: Pick<Ruta, 'id' | 'kilometros' | 'kmSalida' | 'kmLlegada'>): Observable<Ruta> {
        return this.authHttp.put<Ruta>(`${this.url}/${ruta.id}/kilometros`, { kilometros: ruta.kilometros, kmSalida: ruta.kmSalida, kmLlegada: ruta.kmLlegada });
    }
}
