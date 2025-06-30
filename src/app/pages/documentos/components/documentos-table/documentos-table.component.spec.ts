import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosTableComponent } from './documentos-table.component';

describe('DocumentosTableComponent', () => {
  let component: DocumentosTableComponent;
  let fixture: ComponentFixture<DocumentosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
