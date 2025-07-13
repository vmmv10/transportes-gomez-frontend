import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasSelectComponent } from './categorias-select.component';

describe('CategoriasSelectComponent', () => {
  let component: CategoriasSelectComponent;
  let fixture: ComponentFixture<CategoriasSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
