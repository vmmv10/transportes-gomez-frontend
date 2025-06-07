import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { Observable } from 'rxjs';
import { Imagen } from '../models/imagen.model';

@Injectable({
    providedIn: 'root'
})
export class ImagenesService {
    url: string;

    constructor(private authHttp: AuthHttpService) {
        this.url = 'api/imagenes';
    }

    getImagenes(tipoEntidad: string, idEntidad: number): Observable<Imagen[]> {
        return this.authHttp.get<Imagen[]>(`${this.url}/${tipoEntidad}/${idEntidad}`);
    }

    delete(id: string): Observable<void> {
        return this.authHttp.delete<void>(`${this.url}/${id}`);
    }
}
