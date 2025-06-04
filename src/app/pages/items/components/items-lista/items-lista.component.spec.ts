import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsListaComponent } from './items-lista.component';

describe('ItemsListaComponent', () => {
  let component: ItemsListaComponent;
  let fixture: ComponentFixture<ItemsListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
