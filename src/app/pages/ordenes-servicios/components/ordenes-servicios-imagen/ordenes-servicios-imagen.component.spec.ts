import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesServiciosImagenComponent } from './ordenes-servicios-imagen.component';

describe('OrdenesServiciosImagenComponent', () => {
  let component: OrdenesServiciosImagenComponent;
  let fixture: ComponentFixture<OrdenesServiciosImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesServiciosImagenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesServiciosImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
