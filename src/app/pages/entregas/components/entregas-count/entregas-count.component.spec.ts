import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasCountComponent } from './entregas-count.component';

describe('EntregasCountComponent', () => {
  let component: EntregasCountComponent;
  let fixture: ComponentFixture<EntregasCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregasCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
