import { TestBed } from '@angular/core/testing';

import { AscensoService } from './ascenso.service';

describe('AscensoService', () => {
  let service: AscensoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AscensoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
