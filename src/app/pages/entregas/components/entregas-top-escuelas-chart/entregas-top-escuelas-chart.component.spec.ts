import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasTopEscuelasChartComponent } from './entregas-top-escuelas-chart.component';

describe('EntregasTopEscuelasChartComponent', () => {
  let component: EntregasTopEscuelasChartComponent;
  let fixture: ComponentFixture<EntregasTopEscuelasChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregasTopEscuelasChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasTopEscuelasChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
