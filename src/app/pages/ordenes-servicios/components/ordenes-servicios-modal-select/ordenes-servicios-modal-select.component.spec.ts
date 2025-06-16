import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesServiciosModalSelectComponent } from './ordenes-servicios-modal-select.component';

describe('OrdenesServiciosModalSelectComponent', () => {
  let component: OrdenesServiciosModalSelectComponent;
  let fixture: ComponentFixture<OrdenesServiciosModalSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesServiciosModalSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesServiciosModalSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
