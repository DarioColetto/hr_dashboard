import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let routerSpy: { navigate: jest.Mock };
  let toastrSpy: { success: jest.Mock; error: jest.Mock };

  beforeEach(async () => {
    routerSpy = { navigate: jest.fn() };
    toastrSpy = { success: jest.fn(), error: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid when empty', () => {
    component.form.setValue({ email: '', password: '' });
    expect(component.form.invalid).toBe(true);
  });

  it('form is invalid with malformed email', () => {
    component.form.setValue({ email: 'not-an-email', password: '123456' });
    expect(component.form.get('email')?.hasError('email')).toBe(true);
  });

  it('form is valid with correct inputs', () => {
    component.form.setValue({ email: 'user@test.com', password: '123456' });
    expect(component.form.valid).toBe(true);
  });

  it('onSubmit does nothing when form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    component.onSubmit();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('onSubmit sets auth token, shows success toast and navigates to /dashboard', () => {
    component.form.setValue({ email: 'admin@empresa.com', password: 'admin123' });
    component.onSubmit();
    expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token-12345');
    expect(toastrSpy.success).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('toggles password visibility', () => {
    expect(component.showPassword).toBe(false);
    component.showPassword = true;
    expect(component.showPassword).toBe(true);
    component.showPassword = false;
    expect(component.showPassword).toBe(false);
  });
});
