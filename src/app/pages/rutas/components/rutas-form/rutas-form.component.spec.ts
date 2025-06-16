import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutasFormComponent } from './rutas-form.component';

describe('RutasFormComponent', () => {
  let component: RutasFormComponent;
  let fixture: ComponentFixture<RutasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RutasFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
