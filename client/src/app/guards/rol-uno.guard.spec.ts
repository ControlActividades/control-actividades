import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { rolUnoGuard } from './rol-uno.guard';

describe('rolUnoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rolUnoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
