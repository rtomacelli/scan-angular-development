import { TestBed } from '@angular/core/testing';

import { TapeLibraryService } from './tape-library.service';

describe('TapeLibraryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TapeLibraryService = TestBed.get(TapeLibraryService);
    expect(service).toBeTruthy();
  });
});
