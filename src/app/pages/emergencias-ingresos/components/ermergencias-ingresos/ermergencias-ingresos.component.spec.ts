import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErmergenciasIngresosComponent } from './ermergencias-ingresos.component';

describe('ErmergenciasIngresosComponent', () => {
  let component: ErmergenciasIngresosComponent;
  let fixture: ComponentFixture<ErmergenciasIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErmergenciasIngresosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErmergenciasIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
