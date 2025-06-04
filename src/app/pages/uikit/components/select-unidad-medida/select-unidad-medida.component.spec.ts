import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUnidadMedidaComponent } from './select-unidad-medida.component';

describe('SelectUnidadMedidaComponent', () => {
  let component: SelectUnidadMedidaComponent;
  let fixture: ComponentFixture<SelectUnidadMedidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectUnidadMedidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectUnidadMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
