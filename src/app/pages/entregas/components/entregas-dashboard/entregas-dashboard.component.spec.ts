import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasDashboardComponent } from './entregas-dashboard.component';

describe('EntregasDashboardComponent', () => {
  let component: EntregasDashboardComponent;
  let fixture: ComponentFixture<EntregasDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregasDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
