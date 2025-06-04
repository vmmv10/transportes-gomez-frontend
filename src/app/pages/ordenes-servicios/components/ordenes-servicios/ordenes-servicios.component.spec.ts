import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesServiciosComponent } from './ordenes-servicios.component';

describe('OrdenesServiciosComponent', () => {
  let component: OrdenesServiciosComponent;
  let fixture: ComponentFixture<OrdenesServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
