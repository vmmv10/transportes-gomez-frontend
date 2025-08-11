import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesServiciosItemsDespachadosChartComponent } from './ordenes-servicios-items-despachados-chart.component';

describe('OrdenesServiciosItemsDespachadosChartComponent', () => {
  let component: OrdenesServiciosItemsDespachadosChartComponent;
  let fixture: ComponentFixture<OrdenesServiciosItemsDespachadosChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesServiciosItemsDespachadosChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesServiciosItemsDespachadosChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
