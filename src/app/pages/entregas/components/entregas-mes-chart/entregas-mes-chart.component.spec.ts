import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasMesChartComponent } from './entregas-mes-chart.component';

describe('EntregasMesChartComponent', () => {
  let component: EntregasMesChartComponent;
  let fixture: ComponentFixture<EntregasMesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregasMesChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasMesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
