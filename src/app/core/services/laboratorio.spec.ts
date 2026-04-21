import { TestBed } from '@angular/core/testing';

import { LaboratorioService } from './laboratorio';

describe('LaboratorioService', () => {
  let service: LaboratorioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratorioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
