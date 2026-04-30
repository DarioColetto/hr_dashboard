import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/employees/pages/employee-list/employee-list.component').then(
            m => m.EmployeeListComponent
          ),
      },
      {
        path: 'employees/new',
        loadComponent: () =>
          import('./features/employees/pages/employee-form/employee-form.component').then(
            m => m.EmployeeFormComponent
          ),
      },
      {
        path: 'employees/:id/edit',
        loadComponent: () =>
          import('./features/employees/pages/employee-form/employee-form.component').then(
            m => m.EmployeeFormComponent
          ),
      },
      {
        path: 'employees/:id',
        loadComponent: () =>
          import('./features/employees/pages/employee-detail/employee-detail.component').then(
            m => m.EmployeeDetailComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
