import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBooleanComponent } from './select-boolean.component';

describe('SelectBooleanComponent', () => {
  let component: SelectBooleanComponent;
  let fixture: ComponentFixture<SelectBooleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectBooleanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectBooleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
