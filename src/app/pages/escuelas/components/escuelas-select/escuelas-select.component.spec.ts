import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscuelasSelectComponent } from './escuelas-select.component';

describe('EscuelasSelectComponent', () => {
  let component: EscuelasSelectComponent;
  let fixture: ComponentFixture<EscuelasSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscuelasSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscuelasSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
