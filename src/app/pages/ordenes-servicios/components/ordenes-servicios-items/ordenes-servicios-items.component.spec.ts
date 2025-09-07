import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesServiciosItemsComponent } from './ordenes-servicios-items.component';

describe('OrdenesServiciosItemsComponent', () => {
  let component: OrdenesServiciosItemsComponent;
  let fixture: ComponentFixture<OrdenesServiciosItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesServiciosItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesServiciosItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
