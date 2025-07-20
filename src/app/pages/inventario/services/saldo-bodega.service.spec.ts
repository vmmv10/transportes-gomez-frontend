import { TestBed } from '@angular/core/testing';

import { SaldoBodegaService } from './saldo-bodega.service';

describe('SaldoBodegaService', () => {
  let service: SaldoBodegaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaldoBodegaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
