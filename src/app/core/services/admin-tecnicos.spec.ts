import { TestBed } from '@angular/core/testing';

import { AdminTecnicos } from './admin-tecnicos';

describe('AdminTecnicos', () => {
  let service: AdminTecnicos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTecnicos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
