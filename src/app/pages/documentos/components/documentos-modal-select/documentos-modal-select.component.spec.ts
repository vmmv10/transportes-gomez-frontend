import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosModalSelectComponent } from './documentos-modal-select.component';

describe('DocumentosModalSelectComponent', () => {
  let component: DocumentosModalSelectComponent;
  let fixture: ComponentFixture<DocumentosModalSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosModalSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosModalSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
