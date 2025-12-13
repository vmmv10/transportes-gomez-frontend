import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesServicioCategoriasSelectComponent } from './ordenes-servicio-categorias-select.component';

describe('OrdenesServicioCategoriasSelectComponent', () => {
  let component: OrdenesServicioCategoriasSelectComponent;
  let fixture: ComponentFixture<OrdenesServicioCategoriasSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesServicioCategoriasSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesServicioCategoriasSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
