import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscuelasDashboardComponent } from './escuelas-dashboard.component';

describe('EscuelasDashboardComponent', () => {
  let component: EscuelasDashboardComponent;
  let fixture: ComponentFixture<EscuelasDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscuelasDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscuelasDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
