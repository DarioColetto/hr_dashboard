# HR Dashboard

Panel de administración de recursos humanos construido con Angular 18.

## Stack

- **Angular 18** — standalone components, signals, nueva sintaxis `@if/@for`
- **Angular Material 18** — sidenav, tables, dialogs, steppers, paginación
- **RxJS 7** — `debounceTime`, `switchMap`, `distinctUntilChanged`, `takeUntil`
- **Formularios reactivos** — `FormGroup`, `FormArray`, validadores custom (DNI, rango salarial, rango de fechas), validación cruzada
- **HttpClient + Interceptors** — auth JWT simulado, manejo centralizado de errores HTTP
- **Auth Guard** — rutas protegidas
- **pdfmake** — exportar ficha de empleado a PDF
- **ngx-image-compress** — carga y compresión de foto de perfil
- **ngx-toastr** — notificaciones
- **json-server** — mock API REST para desarrollo local
- **Jest + jest-preset-angular** — tests unitarios
- **ESLint + Prettier + Husky + lint-staged** — calidad de código en pre-commit

## Estructura

```
src/app/
├── core/
│   ├── guards/          # authGuard
│   ├── interceptors/    # authInterceptor (JWT + manejo de errores)
│   ├── models/          # Employee, ApiResponse
│   ├── services/        # EmployeeService
│   └── validators/      # dniValidator, dateRangeValidator, salaryRangeValidator
├── features/
│   ├── auth/login/      # Login con formulario reactivo
│   ├── dashboard/       # Estadísticas en tiempo real
│   └── employees/
│       ├── employee-list    # Tabla con búsqueda debounced, filtros, paginación
│       ├── employee-form    # Stepper 4 pasos + FormArray de experiencia laboral
│       └── employee-detail  # Vista detalle + exportar PDF
├── layout/              # MainLayoutComponent con sidenav Material
└── environments/        # dev / prod con fileReplacements
```

## Correr el proyecto

```bash
npm install

# Levantar mock API (json-server en :3000)
npm run mock-api

# Angular en dev con proxy
npm run start:dev

# Tests
npm test
npm run test:coverage

# Lint / format
npm run lint
npm run format
```

## Credenciales de demo

```
Email: admin@empresa.com
Password: admin123
```

## Environments

| Ambiente | API URL |
|---|---|
| development | `http://localhost:3000` (via proxy.conf.json) |
| production | `https://api.hr-dashboard.com` |
