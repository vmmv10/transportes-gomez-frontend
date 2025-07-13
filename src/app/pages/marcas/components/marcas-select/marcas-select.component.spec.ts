import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcasSelectComponent } from './marcas-select.component';

describe('MarcasSelectComponent', () => {
  let component: MarcasSelectComponent;
  let fixture: ComponentFixture<MarcasSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcasSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcasSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
