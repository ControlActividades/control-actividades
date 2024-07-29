import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { bossGuard } from './boss.guard';

describe('bossGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => bossGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
