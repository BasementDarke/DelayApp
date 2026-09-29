import { TestBed } from '@angular/core/testing';

import { ParameterTemplateService } from './parameter.template.service';

describe('ParameterTemplateService', () => {
  let service: ParameterTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParameterTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
