import { TestBed } from '@angular/core/testing';

import { RegisterAuthGuard } from './register-auth.guard';

describe('RegisterAuthGuard', () => {
  let guard: RegisterAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RegisterAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
