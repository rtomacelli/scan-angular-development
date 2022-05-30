import { TestBed } from '@angular/core/testing';

import { ReferenceDateService } from './reference-date.service';

describe('ReferenceDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferenceDateService = TestBed.get(ReferenceDateService);
    expect(service).toBeTruthy();
  });
});
