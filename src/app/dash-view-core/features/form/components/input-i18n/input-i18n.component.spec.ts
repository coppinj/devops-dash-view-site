import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputI18nComponent } from './input-i18n.component';

describe('InputI18nComponent', () => {
  let component: InputI18nComponent;
  let fixture: ComponentFixture<InputI18nComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputI18nComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputI18nComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
