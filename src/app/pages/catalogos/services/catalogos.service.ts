import { Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { AuthHttpService } from '../../service/auth-http.service';
import { Comuna } from '../models/comuna.model';
import { ServicioTipo } from '../models/servicio-tipo.model';

/** Listas fijas del sistema (comunas y tipos de servicio). Se piden una vez por sesión. */
@Injectable({
    providedIn: 'root'
})
export class CatalogosService {
    private comunas$: Observable<Comuna[]> | undefined;
    private serviciosTipos$: Observable<ServicioTipo[]> | undefined;

    constructor(private authHttp: AuthHttpService) {}

    getComunas(): Observable<Comuna[]> {
        if (!this.comunas$) {
            this.comunas$ = this.authHttp.get<Comuna[]>('api/comunas').pipe(tap({ error: () => (this.comunas$ = undefined) }), shareReplay({ bufferSize: 1, refCount: false }));
        }
        return this.comunas$;
    }

    getServiciosTipos(): Observable<ServicioTipo[]> {
        if (!this.serviciosTipos$) {
            this.serviciosTipos$ = this.authHttp.get<ServicioTipo[]>('api/servicios-tipos').pipe(tap({ error: () => (this.serviciosTipos$ = undefined) }), shareReplay({ bufferSize: 1, refCount: false }));
        }
        return this.serviciosTipos$;
    }
}
