import { TestBed } from '@angular/core/testing';

import { DocumentosTiposService } from './documentos-tipos.service';

describe('DocumentosTiposService', () => {
  let service: DocumentosTiposService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentosTiposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
