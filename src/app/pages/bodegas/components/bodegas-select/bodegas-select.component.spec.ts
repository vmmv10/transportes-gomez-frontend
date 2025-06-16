import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodegasSelectComponent } from './bodegas-select.component';

describe('BodegasSelectComponent', () => {
  let component: BodegasSelectComponent;
  let fixture: ComponentFixture<BodegasSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodegasSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodegasSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
