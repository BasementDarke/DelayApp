import { TestBed } from '@angular/core/testing';

import { TaskRegistryHandler } from './task.registry.handler';

describe('TaskRegistryHandler', () => {
  let service: TaskRegistryHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskRegistryHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
