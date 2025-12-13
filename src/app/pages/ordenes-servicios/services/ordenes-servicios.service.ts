import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { OrdenServicio } from '../models/orden-servicio.model';
import { Observable } from 'rxjs';
import { Page } from '../../uikit/models/page.model';
import { OrdenServicioFiltro } from '../models/orden-servicio-filtro.model';
import { Reporte } from '../../uikit/models/reporte.model';

@Injectable({
    providedIn: 'root'
})
export class OrdenesServiciosService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/ordenes-servicios';
    }

    getAll(filtro: OrdenServicioFiltro): Observable<Page<OrdenServicio>> {
        let link = `${this.url}?size=${filtro.size}&page=${filtro.page}&sort=${filtro.key},${filtro.sort}`;
        if (filtro.escuela) {
            link += '&escuelaId=' + filtro.escuela.id;
        }
        if (filtro.fechaDesde) {
            link += '&fechaDesde=' + filtro.fechaDesde.toISOString();
        }
        if (filtro.fechaHasta) {
            link += '&fechaHasta=' + filtro.fechaHasta.toISOString();
        }
        if (filtro.estado) {
            link += '&estado=' + filtro.estado;
        }
        if (filtro.documentoTipo && filtro.documentoTipo.id) {
            link += '&documentoTipoId=' + filtro.documentoTipo.id;
        }
        if (filtro.documentoNumero) {
            link += '&documentoNumero=' + filtro.documentoNumero;
        }
        if (filtro.enRuta !== undefined && filtro.enRuta !== null) {
            link += '&enRuta=' + filtro.enRuta;
        }
        if (filtro.entregado !== undefined && filtro.entregado !== null) {
            link += '&entregado=' + filtro.entregado;
        }
        if (filtro.id !== undefined && filtro.id !== null) {
            link += '&id=' + filtro.id;
        }
        if (filtro.categoria && filtro.categoria.id) {
            link += '&categoria=' + filtro.categoria.id;
        }
        if (filtro.documentoReferencia) {
            link += '&documentoReferencia=' + filtro.documentoReferencia;
        }
        return this.authHttp.get<Page<OrdenServicio>>(link);
    }

    get(id: string): Observable<OrdenServicio> {
        return this.authHttp.get<OrdenServicio>(`${this.url}/${id}`);
    }

    create(orden: OrdenServicio): Observable<OrdenServicio> {
        return this.authHttp.post<OrdenServicio>(this.url, orden);
    }

    update(orden: OrdenServicio, files: any[]): Observable<OrdenServicio> {
        const formData = new FormData();
        formData.append('orden', new Blob([JSON.stringify(orden)], { type: 'application/json' }));
        files.forEach((file, index) => {
            formData.append('files', file);
        });
        return this.authHttp.put<OrdenServicio>(`${this.url}/${orden.id}`, formData);
    }

    delete(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }

    generarPdf(id: string): Observable<Blob> {
        return this.authHttp.postBlob(`${this.url}/${id}/pdf`, null, {
            responseType: 'blob' as 'json' // TypeScript requiere el cast aquí
        });
    }

    deleteDetalle(detalleId: number): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/detalles/${detalleId}`);
    }

    getTopItems(filtro: OrdenServicioFiltro): Observable<Reporte[]> {
        let link = `${this.url}/reporte/items-mas-despachados`;
        if (filtro.escuela) {
            link += `?escuelaId=${filtro.escuela.id}`;
        }
        if (filtro.categoria && filtro.categoria.id) {
            link += filtro.escuela ? `&categoria=${filtro.categoria.id}` : `?categoria=${filtro.categoria.id}`;
        }
        if (filtro.documentoReferencia && filtro.documentoReferencia.trim() !== '') {
            link += filtro.escuela || filtro.categoria ? `&documentoReferencia=${filtro.documentoReferencia}` : `?documentoReferencia=${filtro.documentoReferencia}`;
        }
        return this.authHttp.get<Reporte[]>(link);
    }

    uploadImagenes(ordenId: number, files: File[]): Observable<void> {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        return this.authHttp.post<void>(`${this.url}/${ordenId}/imagenes`, formData);
    }

    getByIngreso(ingresoId: number): Observable<OrdenServicio> {
        return this.authHttp.get<OrdenServicio>(`${this.url}/ingreso/${ingresoId}`);
    }
}
