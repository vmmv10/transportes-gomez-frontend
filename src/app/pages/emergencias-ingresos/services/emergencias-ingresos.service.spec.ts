import { TestBed } from '@angular/core/testing';

import { EmergenciasIngresosService } from './emergencias-ingresos.service';

describe('EmergenciasIngresosService', () => {
  let service: EmergenciasIngresosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergenciasIngresosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
