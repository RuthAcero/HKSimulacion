import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMonitoringComponent } from './main-monitoring.component';

describe('MainMonitoringComponent', () => {
  let component: MainMonitoringComponent;
  let fixture: ComponentFixture<MainMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
