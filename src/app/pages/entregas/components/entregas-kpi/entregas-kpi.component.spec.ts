import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasKpiComponent } from './entregas-kpi.component';

describe('EntregasKpiComponent', () => {
  let component: EntregasKpiComponent;
  let fixture: ComponentFixture<EntregasKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregasKpiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
