import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  template: `
    <div class="page-header">
      <h2>Empleados</h2>
      <a mat-raised-button color="primary" routerLink="/employees/new">
        <mat-icon>add</mat-icon> Nuevo empleado
      </a>
    </div>

    <div class="filters">
      <mat-form-field appearance="outline">
        <mat-label>Buscar</mat-label>
        <input matInput [formControl]="searchControl" placeholder="Nombre, email..." />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Departamento</mat-label>
        <mat-select [formControl]="deptControl">
          <mat-option value="">Todos</mat-option>
          @for (dept of departments; track dept) {
            <mat-option [value]="dept">{{ dept }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline">
        <mat-label>Estado</mat-label>
        <mat-select [formControl]="statusControl">
          <mat-option value="">Todos</mat-option>
          <mat-option value="active">Activo</mat-option>
          <mat-option value="inactive">Inactivo</mat-option>
          <mat-option value="on-leave">De licencia</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <table
      mat-table
      [dataSource]="employees()"
      matSort
      (matSortChange)="onSort($event)"
      class="mat-elevation-z2"
    >
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
        <td mat-cell *matCellDef="let emp">{{ emp.firstName }} {{ emp.lastName }}</td>
      </ng-container>
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let emp">{{ emp.email }}</td>
      </ng-container>
      <ng-container matColumnDef="department">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Departamento</th>
        <td mat-cell *matCellDef="let emp">{{ emp.department }}</td>
      </ng-container>
      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Estado</th>
        <td mat-cell *matCellDef="let emp">
          <span [class]="'status-badge status-' + emp.status">{{ statusLabel(emp.status) }}</span>
        </td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let emp">
          <a mat-icon-button [routerLink]="['/employees', emp.id]" title="Ver detalle">
            <mat-icon>visibility</mat-icon>
          </a>
          <a mat-icon-button [routerLink]="['/employees', emp.id, 'edit']" title="Editar">
            <mat-icon>edit</mat-icon>
          </a>
          <button mat-icon-button color="warn" (click)="confirmDelete(emp)" title="Eliminar">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell no-data" colspan="5">No se encontraron empleados</td>
      </tr>
    </table>

    <mat-paginator
      [length]="total()"
      [pageSize]="pageSize"
      [pageSizeOptions]="[5, 10, 25]"
      (page)="onPage($event)"
      showFirstLastButtons
    />
  `,
  styles: [
    `
      .filters {
        display: flex;
        gap: 14px;
        margin-bottom: 20px;
        flex-wrap: wrap;
        padding: 18px 20px;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }
      .filters mat-form-field {
        flex: 1;
        min-width: 160px;
      }
      table {
        width: 100%;
      }
      .no-data {
        text-align: center;
        padding: 48px 32px;
        color: #94a3b8;
        font-size: 14px;
      }
      .status-active {
        --mdc-chip-container-color: #dcfce7;
        color: #166534 !important;
      }
      .status-inactive {
        --mdc-chip-container-color: #fee2e2;
        color: #991b1b !important;
      }
      .status-on-leave {
        --mdc-chip-container-color: #fef3c7;
        color: #92400e !important;
      }
    `,
  ],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  private employeeService = inject(EmployeeService);
  private toastr = inject(ToastrService);
  private destroy$ = new Subject<void>();

  employees = signal<Employee[]>([]);
  total = signal(0);
  pageSize = 10;
  currentPage = 1;

  displayedColumns = ['name', 'email', 'department', 'status', 'actions'];
  departments = ['Tecnología', 'RRHH', 'Administración', 'Comercial', 'Operaciones'];

  searchControl = new FormControl('');
  deptControl = new FormControl('');
  statusControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search =>
          this.employeeService.getPaginated({ search: search ?? '', page: 1, limit: this.pageSize })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(res => {
        this.employees.set(res.data);
        this.total.set(res.items);
      });

    this.deptControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadEmployees());
    this.statusControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadEmployees());

    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService
      .getPaginated({
        search: this.searchControl.value ?? '',
        department: this.deptControl.value ?? '',
        status: this.statusControl.value ?? '',
        page: this.currentPage,
        limit: this.pageSize,
      })
      .subscribe(res => {
        this.employees.set(res.data);
        this.total.set(res.items);
      });
  }

  onPage(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadEmployees();
  }

  onSort(sort: Sort): void {
    console.log('Sort:', sort);
    this.loadEmployees();
  }

  confirmDelete(employee: Employee): void {
    if (!confirm(`¿Eliminar a ${employee.firstName} ${employee.lastName}?`)) return;
    this.employeeService.delete(employee.id).subscribe({
      next: () => {
        this.toastr.success('Empleado eliminado correctamente');
        this.loadEmployees();
      },
      error: () => this.toastr.error('Error al eliminar el empleado'),
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'Activo',
      inactive: 'Inactivo',
      'on-leave': 'De licencia',
    };
    return labels[status] ?? status;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
