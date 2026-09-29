import { TestBed } from '@angular/core/testing';

import { TaskKeyService } from './task.key.service';

describe('TaskKeyService', () => {
  let service: TaskKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
