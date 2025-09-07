import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregadosComponent } from './entregados.component';

describe('EntregadosComponent', () => {
  let component: EntregadosComponent;
  let fixture: ComponentFixture<EntregadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntregadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntregadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
