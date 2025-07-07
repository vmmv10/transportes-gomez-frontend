import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionesTableComponent } from './devoluciones-table.component';

describe('DevolucionesTableComponent', () => {
  let component: DevolucionesTableComponent;
  let fixture: ComponentFixture<DevolucionesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevolucionesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevolucionesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
