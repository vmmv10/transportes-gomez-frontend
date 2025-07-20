import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErmergenciasIngresosTableComponent } from './ermergencias-ingresos-table.component';

describe('ErmergenciasIngresosTableComponent', () => {
  let component: ErmergenciasIngresosTableComponent;
  let fixture: ComponentFixture<ErmergenciasIngresosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErmergenciasIngresosTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErmergenciasIngresosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
