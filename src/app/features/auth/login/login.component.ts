import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>business</mat-icon>
          <mat-card-title>HR Dashboard</mat-card-title>
          <mat-card-subtitle>Ingresá con tus credenciales</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" />
              @if (form.get('email')?.hasError('required')) {
                <mat-error>El email es requerido</mat-error>
              }
              @if (form.get('email')?.hasError('email')) {
                <mat-error>Email inválido</mat-error>
              }
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input
                matInput
                formControlName="password"
                [type]="showPassword ? 'text' : 'password'"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="showPassword = !showPassword"
              >
                <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.get('password')?.hasError('required')) {
                <mat-error>La contraseña es requerida</mat-error>
              }
            </mat-form-field>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width"
              [disabled]="form.invalid"
            >
              Ingresar
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #f5f5f5;
      }
      .login-card {
        width: 400px;
        padding: 16px;
      }
      .full-width {
        width: 100%;
        margin-bottom: 16px;
        display: block;
      }
    `,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  showPassword = false;

  form = this.fb.group({
    email: ['admin@empresa.com', [Validators.required, Validators.email]],
    password: ['admin123', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    // Simula autenticación JWT
    localStorage.setItem('auth_token', 'mock-jwt-token-12345');
    this.toastr.success('Bienvenido al sistema');
    this.router.navigate(['/dashboard']);
  }
}
