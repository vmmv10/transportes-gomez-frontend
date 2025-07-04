import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregasButtonRecepcionComponent } from './entregas-button-recepcion.component';

describe('EntregasButtonRecepcionComponent', () => {
  let component: EntregasButtonRecepcionComponent;
  let fixture: ComponentFixture<EntregasButtonRecepcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregasButtonRecepcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregasButtonRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
