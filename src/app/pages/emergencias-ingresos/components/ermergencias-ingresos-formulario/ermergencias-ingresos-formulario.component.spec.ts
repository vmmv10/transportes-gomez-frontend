import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErmergenciasIngresosFormularioComponent } from './ermergencias-ingresos-formulario.component';

describe('ErmergenciasIngresosFormularioComponent', () => {
  let component: ErmergenciasIngresosFormularioComponent;
  let fixture: ComponentFixture<ErmergenciasIngresosFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErmergenciasIngresosFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErmergenciasIngresosFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
