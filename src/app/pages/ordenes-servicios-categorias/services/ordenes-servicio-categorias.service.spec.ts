import { TestBed } from '@angular/core/testing';

import { OrdenesServicioCategoriasService } from './ordenes-servicio-categorias.service';

describe('OrdenesServicioCategoriasService', () => {
  let service: OrdenesServicioCategoriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenesServicioCategoriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
