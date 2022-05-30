import { TestBed } from '@angular/core/testing';

import { DB2Service } from './db2.service';

describe('DB2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DB2Service = TestBed.get(DB2Service);
    expect(service).toBeTruthy();
  });
});
