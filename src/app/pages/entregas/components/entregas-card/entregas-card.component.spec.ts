import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasCardComponent } from './entregas-card.component';

describe('EntregasCardComponent', () => {
  let component: EntregasCardComponent;
  let fixture: ComponentFixture<EntregasCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregasCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
