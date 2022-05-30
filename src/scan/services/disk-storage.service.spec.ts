import { TestBed } from '@angular/core/testing';

import { DiskStorageService } from './disk-storage.service';

describe('DiskStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiskStorageService = TestBed.get(DiskStorageService);
    expect(service).toBeTruthy();
  });
});
