import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasTableComponent } from './entregas-table.component';

describe('EntregasTableComponent', () => {
  let component: EntregasTableComponent;
  let fixture: ComponentFixture<EntregasTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregasTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
