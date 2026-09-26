import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from '../../service/auth-http.service';
import { Page } from '../../uikit/models/page.model';
import { Contrato } from '../models/contrato.model';
import { ContratoFiltro } from '../models/contrato-filtro';

@Injectable({
    providedIn: 'root'
})
export class ContratosService {
    url: string = 'api/contratos';

    constructor(private authHttp: AuthHttpService) {}

    getAll(filtro: ContratoFiltro): Observable<Page<Contrato>> {
        const params = new URLSearchParams({ size: String(filtro.size), page: String(filtro.page), sort: filtro.sort });
        if (filtro.cliente) {
            params.set('cliente', String(filtro.cliente));
        }
        if (filtro.texto?.trim()) {
            params.set('texto', filtro.texto.trim());
        }
        if (filtro.activo !== undefined && filtro.activo !== null) {
            params.set('activo', String(filtro.activo));
        }
        if (filtro.vigente) {
            params.set('vigente', 'true');
        }
        return this.authHttp.get<Page<Contrato>>(`${this.url}?${params.toString()}`);
    }

    /** Contratos vigentes hoy, opcionalmente de un cliente. */
    getVigentes(clienteId?: number): Observable<Contrato[]> {
        return this.authHttp.get<Contrato[]>(clienteId ? `${this.url}/vigentes?cliente=${clienteId}` : `${this.url}/vigentes`);
    }

    get(id: number | string): Observable<Contrato> {
        return this.authHttp.get<Contrato>(`${this.url}/${id}`);
    }

    create(contrato: Contrato): Observable<Contrato> {
        return this.authHttp.post<Contrato>(this.url, contrato);
    }

    update(contrato: Contrato): Observable<Contrato> {
        return this.authHttp.put<Contrato>(`${this.url}/${contrato.id}`, contrato);
    }

    desactivar(id: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/desactivar`, {});
    }

    activar(id: number): Observable<void> {
        return this.authHttp.put<void>(`${this.url}/${id}/activar`, {});
    }

    /** Solo se puede eliminar si no tiene órdenes de servicio asociadas (lo valida el backend). */
    eliminar(id: number): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }
}
