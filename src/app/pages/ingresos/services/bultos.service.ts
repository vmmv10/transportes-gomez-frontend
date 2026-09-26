import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpService } from '../../service/auth-http.service';
import { Bulto } from '../models/bulto.model';

@Injectable({
    providedIn: 'root'
})
export class BultosService {
    constructor(private authHttp: AuthHttpService) {}

    listarPorIngreso(folio: number | string): Observable<Bulto[]> {
        return this.authHttp.get<Bulto[]>(`api/ingresos/${folio}/bultos`);
    }

    agregar(folio: number | string, bulto: Bulto): Observable<Bulto> {
        return this.authHttp.post<Bulto>(`api/ingresos/${folio}/bultos`, bulto);
    }

    actualizar(bulto: Bulto): Observable<Bulto> {
        return this.authHttp.put<Bulto>(`api/bultos/${bulto.id}`, bulto);
    }

    eliminar(id: number): Observable<void> {
        return this.authHttp.delete<void>(`api/bultos/${id}`);
    }

    /** Busca por N° de seguimiento externo. */
    buscarPorCodigoExterno(codigo: string): Observable<Bulto[]> {
        return this.authHttp.get<Bulto[]>(`api/bultos?codigoExterno=${encodeURIComponent(codigo.trim())}`);
    }
}
