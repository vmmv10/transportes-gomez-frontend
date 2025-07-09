import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionesFormularioComponent } from './devoluciones-formulario.component';

describe('DevolucionesFormularioComponent', () => {
  let component: DevolucionesFormularioComponent;
  let fixture: ComponentFixture<DevolucionesFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevolucionesFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevolucionesFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
