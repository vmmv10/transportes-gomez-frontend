import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutasActualComponent } from './rutas-actual.component';

describe('RutasActualComponent', () => {
  let component: RutasActualComponent;
  let fixture: ComponentFixture<RutasActualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RutasActualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RutasActualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
