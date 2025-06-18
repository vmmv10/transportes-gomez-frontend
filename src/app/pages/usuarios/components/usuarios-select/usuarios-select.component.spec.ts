import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosSelectComponent } from './usuarios-select.component';

describe('UsuariosSelectComponent', () => {
  let component: UsuariosSelectComponent;
  let fixture: ComponentFixture<UsuariosSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
