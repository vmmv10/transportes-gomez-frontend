import { TestBed } from '@angular/core/testing';

import { OrdenesServiciosService } from './ordenes-servicios.service';

describe('OrdenesServiciosService', () => {
  let service: OrdenesServiciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenesServiciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
