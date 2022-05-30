import { TestBed } from '@angular/core/testing';

import { HighEndService } from './high-end.service';

describe('HighEndService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HighEndService = TestBed.get(HighEndService);
    expect(service).toBeTruthy();
  });
});
