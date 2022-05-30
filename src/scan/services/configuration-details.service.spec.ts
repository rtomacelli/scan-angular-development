import { TestBed } from '@angular/core/testing';

import { ConfigurationDetailsService } from './configuration-details.service';

describe('ConfigurationDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigurationDetailsService = TestBed.get(ConfigurationDetailsService);
    expect(service).toBeTruthy();
  });
});
