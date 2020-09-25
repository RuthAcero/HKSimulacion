import { TestBed } from '@angular/core/testing';

import { MyGeotabService } from './my-geotab.service';

describe('MyGeotabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyGeotabService = TestBed.get(MyGeotabService);
    expect(service).toBeTruthy();
  });
});
