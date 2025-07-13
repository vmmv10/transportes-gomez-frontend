import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCantidadComponent } from './modal-cantidad.component';

describe('ModalCantidadComponent', () => {
  let component: ModalCantidadComponent;
  let fixture: ComponentFixture<ModalCantidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCantidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCantidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
