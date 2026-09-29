import { TestBed } from '@angular/core/testing';

import { PlaywrightApiService } from './playwright.api.service';

describe('PlaywrightApiService', () => {
  let service: PlaywrightApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaywrightApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
