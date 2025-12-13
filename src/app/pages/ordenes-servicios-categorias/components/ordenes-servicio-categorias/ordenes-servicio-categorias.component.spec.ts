import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesServicioCategoriasComponent } from './ordenes-servicio-categorias.component';

describe('OrdenesServicioCategoriasComponent', () => {
  let component: OrdenesServicioCategoriasComponent;
  let fixture: ComponentFixture<OrdenesServicioCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesServicioCategoriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesServicioCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
