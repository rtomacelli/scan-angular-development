import { TestBed } from '@angular/core/testing';

import { ReferenceMatrixService } from './reference-matrix.service';

describe('ReferenceMatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferenceMatrixService = TestBed.get(ReferenceMatrixService);
    expect(service).toBeTruthy();
  });
});
