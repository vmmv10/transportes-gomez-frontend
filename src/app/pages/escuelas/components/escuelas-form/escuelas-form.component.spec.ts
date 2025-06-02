import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscuelasFormComponent } from './escuelas-form.component';

describe('EscuelasFormComponent', () => {
  let component: EscuelasFormComponent;
  let fixture: ComponentFixture<EscuelasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscuelasFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscuelasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
