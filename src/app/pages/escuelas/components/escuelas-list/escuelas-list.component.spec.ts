import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscuelasListComponent } from './escuelas-list.component';

describe('EscuelasListComponent', () => {
  let component: EscuelasListComponent;
  let fixture: ComponentFixture<EscuelasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscuelasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscuelasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
