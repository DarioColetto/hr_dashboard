# HR Dashboard

Panel de administración de recursos humanos construido con Angular 18. Incluye autenticación con JWT simulado, CRUD completo de empleados (crear, editar, ver detalle y eliminar), búsqueda con debounce, paginación, exportación a PDF y gestión de experiencia laboral mediante formularios reactivos multi-paso.

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

## Proxy de desarrollo

En desarrollo, Angular corre en `:4200` y la mock API en `:3000`. Para evitar errores de CORS, el dev server redirige automáticamente las requests mediante `proxy.conf.json`:

```
GET /api/employees  →  http://localhost:3000/employees
```

El prefijo `/api` es eliminado antes de reenviar la request al servidor (`pathRewrite`). Esta configuración solo aplica en desarrollo; en producción las requests son interceptadas por el mock backend (ver abajo).

## Mock Backend (producción)

En producción (Netlify) no hay servidor backend. `mock-backend.interceptor.ts` intercepta todas las requests HTTP antes de que salgan a la red y devuelve datos estáticos directamente desde el cliente:

- Simula GET con filtros (`q`, `department`, `status`) y paginación
- Simula POST (crea empleado con ID generado), PUT (actualiza) y DELETE
- Se activa solo cuando `environment.production === true`

Esto permite hacer una demo funcional completa sin infraestructura backend.

## Interceptor HTTP

`auth.interceptor.ts` actúa como middleware para todas las requests HTTP salientes y respuestas entrantes:

- **Request saliente:** agrega el header `Authorization: Bearer <token>` si existe un token en `localStorage`.
- **Respuesta 401:** elimina el token y redirige al login (sesión expirada).
- **Respuesta 403:** muestra notificación de permisos insuficientes.
- **Respuesta 500+:** muestra notificación de error de servidor.

Esto centraliza el manejo de autenticación y errores, sin que cada componente tenga que gestionarlos individualmente.

## Husky y lint-staged

Husky ejecuta un hook de `pre-commit` que corre automáticamente antes de cada `git commit`:

1. **`tsc --noEmit`** — verifica que no haya errores de TypeScript en todo el proyecto.
2. **`lint-staged`** — aplica Prettier solo sobre los archivos staged (`.ts`, `.html`, `.scss`).

Esto garantiza que ningún commit introduzca errores de tipos ni código mal formateado.

## Tests

Los tests unitarios cubren las partes consideradas más críticas de la aplicación:

| Suite | Descripción |
|---|---|
| `auth.guard.spec` | Verifica que las rutas protegidas redirijan al login sin token |
| `auth.interceptor.spec` | Cubre el agregado del header JWT y el manejo de errores 401/403/500 |
| `login.component.spec` | Valida el formulario, el flujo de login y el guardado del token |
| `pdf.service.spec` | Verifica que se llame a pdfmake con la definición correcta |
| `employee.service.spec` | Cubre los métodos CRUD del servicio principal |
| `custom.validators.spec` | Valida los validadores de DNI, rango salarial y rango de fechas |

```bash
npm run test:coverage
```

## Environments

| Ambiente | API URL |
|---|---|
| development | `http://localhost:3000` (via proxy.conf.json) |
| production | `/api` (interceptado por mock-backend.interceptor) |
