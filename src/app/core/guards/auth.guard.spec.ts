import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let routerSpy: { navigate: jest.Mock };

  beforeEach(() => {
    routerSpy = { navigate: jest.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }],
    });
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  const runGuard = () =>
    TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

  it('returns true when auth token exists', () => {
    localStorage.setItem('auth_token', 'mock-token');
    expect(runGuard()).toBe(true);
  });

  it('returns false and navigates to /login when no token', () => {
    expect(runGuard()).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
