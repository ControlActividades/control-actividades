import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { weGuard } from './we.guard';

describe('weGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => weGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
