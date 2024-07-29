import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { rolDosGuard } from './rol-dos.guard';

describe('rolDosGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rolDosGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
