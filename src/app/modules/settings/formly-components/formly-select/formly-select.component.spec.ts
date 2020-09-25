import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlySelectComponent } from './formly-select.component';

describe('FormlySelectComponent', () => {
  let component: FormlySelectComponent;
  let fixture: ComponentFixture<FormlySelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormlySelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormlySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
