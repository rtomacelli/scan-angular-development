import { TestBed } from '@angular/core/testing';

import { CicsService } from './cics.service';

describe('CicsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CicsService = TestBed.get(CicsService);
    expect(service).toBeTruthy();
  });
});
