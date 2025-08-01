import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosFormularioComponent } from './ingresos-formulario.component';

describe('IngresosFormularioComponent', () => {
  let component: IngresosFormularioComponent;
  let fixture: ComponentFixture<IngresosFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresosFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresosFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
