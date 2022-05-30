import { TestBed } from '@angular/core/testing';

import { AppPortfolioService } from './app-portfolio.service';

describe('AppPortfolioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppPortfolioService = TestBed.get(AppPortfolioService);
    expect(service).toBeTruthy();
  });
});
