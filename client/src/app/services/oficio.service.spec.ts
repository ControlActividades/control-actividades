import { TestBed } from '@angular/core/testing';

import { OficioService } from './oficio.service';

describe('OficioService', () => {
  let service: OficioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OficioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
