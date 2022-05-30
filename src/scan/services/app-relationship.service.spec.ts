import { TestBed } from '@angular/core/testing';

import { AppRelationshipService } from './app-relationship.service';

describe('AppRelationshipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppRelationshipService = TestBed.get(AppRelationshipService);
    expect(service).toBeTruthy();
  });
});
