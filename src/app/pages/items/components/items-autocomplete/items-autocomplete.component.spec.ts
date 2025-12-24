import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsAutocompleteComponent } from './items-autocomplete.component';

describe('ItemsAutocompleteComponent', () => {
  let component: ItemsAutocompleteComponent;
  let fixture: ComponentFixture<ItemsAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsAutocompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
