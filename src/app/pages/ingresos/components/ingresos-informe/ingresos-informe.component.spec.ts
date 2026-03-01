import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosInformeComponent } from './ingresos-informe.component';

describe('IngresosInformeComponent', () => {
  let component: IngresosInformeComponent;
  let fixture: ComponentFixture<IngresosInformeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresosInformeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresosInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
