import { TestBed } from '@angular/core/testing';

import { TaskRegistryService } from './task.registry.service.js';

describe('TaskRegistryService', () => {
  let service: TaskRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
