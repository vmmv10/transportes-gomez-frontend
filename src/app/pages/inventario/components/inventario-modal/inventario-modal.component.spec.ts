import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioModalComponent } from './inventario-modal.component';

describe('InventarioModalComponent', () => {
  let component: InventarioModalComponent;
  let fixture: ComponentFixture<InventarioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
