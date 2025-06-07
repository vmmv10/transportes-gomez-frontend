import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosTipoSelectComponent } from './documentos-tipo-select.component';

describe('DocumentosTipoSelectComponent', () => {
  let component: DocumentosTipoSelectComponent;
  let fixture: ComponentFixture<DocumentosTipoSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosTipoSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosTipoSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
