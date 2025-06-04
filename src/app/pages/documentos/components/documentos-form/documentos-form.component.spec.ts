import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosFormComponent } from './documentos-form.component';

describe('DocumentosFormComponent', () => {
  let component: DocumentosFormComponent;
  let fixture: ComponentFixture<DocumentosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
