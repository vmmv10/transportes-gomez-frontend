import { Injectable } from '@angular/core';
import { AuthHttpService } from '../../service/auth-http.service';
import { UnidadMedida } from '../models/unidad-medida.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadesMedidasService {

  url: string

  constructor(
    private authHttp: AuthHttpService
  ) {
    this.url = 'api/unidad-medida';
  }

  getAll(): Observable<UnidadMedida[]> {
    return this.authHttp.get<UnidadMedida[]>(this.url);
  }

}
