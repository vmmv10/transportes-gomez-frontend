import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorSelectComponent } from './proveedor-select.component';

describe('ProveedorSelectComponent', () => {
  let component: ProveedorSelectComponent;
  let fixture: ComponentFixture<ProveedorSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProveedorSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
