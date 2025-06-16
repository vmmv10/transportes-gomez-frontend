import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesServiciosFormComponent } from './ordenes-servicios-form.component';

describe('OrdenesServiciosFormComponent', () => {
  let component: OrdenesServiciosFormComponent;
  let fixture: ComponentFixture<OrdenesServiciosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesServiciosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesServiciosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
