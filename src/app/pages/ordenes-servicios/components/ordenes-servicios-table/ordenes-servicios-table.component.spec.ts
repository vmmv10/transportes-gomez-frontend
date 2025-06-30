import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesServiciosTableComponent } from './ordenes-servicios-table.component';

describe('OrdenesServiciosTableComponent', () => {
  let component: OrdenesServiciosTableComponent;
  let fixture: ComponentFixture<OrdenesServiciosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesServiciosTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesServiciosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
