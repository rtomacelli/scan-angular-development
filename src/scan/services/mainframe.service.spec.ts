import { TestBed } from '@angular/core/testing';

import { MainframeService } from './mainframe.service';

describe('MainframeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainframeService = TestBed.get(MainframeService);
    expect(service).toBeTruthy();
  });
});
