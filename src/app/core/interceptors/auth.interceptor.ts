import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const token = localStorage.getItem('auth_token');

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('auth_token');
        router.navigate(['/login']);
        toastr.error('Sesión expirada. Por favor, ingresá nuevamente.');
      } else if (error.status === 403) {
        toastr.error('No tenés permisos para realizar esta acción.');
      } else if (error.status >= 500) {
        toastr.error('Error del servidor. Intentá más tarde.');
      }
      return throwError(() => error);
    })
  );
};
