import { TestBed } from '@angular/core/testing';

import { AdabasService } from './adabas.service';

describe('AdabasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdabasService = TestBed.get(AdabasService);
    expect(service).toBeTruthy();
  });
});
