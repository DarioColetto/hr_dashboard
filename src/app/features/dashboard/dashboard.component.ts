import { Component, inject, signal, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';

interface StatCard {
  label: string;
  value: number | string;
  icon: string;
  color: string;
  bg: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, RouterLink],
  template: `
    <div class="page-header">
      <h2>Dashboard</h2>
    </div>

    <div class="stats-grid">
      @for (stat of stats(); track stat.label) {
        <div class="stat-card">
          <div class="stat-icon" [style.background]="stat.bg">
            <mat-icon [style.color]="stat.color">{{ stat.icon }}</mat-icon>
          </div>
          <div class="stat-body">
            <div class="stat-value" [style.color]="stat.color">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      }
    </div>

    <div class="section-title">Acciones rápidas</div>
    <div class="quick-actions">
      <a routerLink="/employees/new" class="action-link primary">
        <mat-icon>person_add</mat-icon> Nuevo empleado
      </a>
      <a routerLink="/employees" class="action-link outline">
        <mat-icon>people</mat-icon> Ver empleados
      </a>
    </div>
  `,
  styles: [
    `
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
        gap: 16px;
        margin-bottom: 36px;
      }

      .stat-card {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 22px 20px;
        display: flex;
        align-items: center;
        gap: 18px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        transition:
          box-shadow 0.2s,
          transform 0.15s;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
      }

      .stat-icon {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        mat-icon {
          font-size: 26px;
          width: 26px;
          height: 26px;
        }
      }

      .stat-value {
        font-size: 28px;
        font-weight: 700;
        line-height: 1;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 13px;
        color: #64748b;
        font-weight: 500;
      }

      .section-title {
        font-size: 13px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: #94a3b8;
        margin-bottom: 14px;
      }

      .quick-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .action-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        transition:
          box-shadow 0.2s,
          transform 0.15s;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }

        &:hover {
          transform: translateY(-1px);
        }

        &.primary {
          background: #1d4ed8;
          color: #fff;
          &:hover {
            box-shadow: 0 4px 14px rgba(29, 78, 216, 0.35);
          }
        }

        &.outline {
          background: #fff;
          color: #1d4ed8;
          border: 1.5px solid #1d4ed8;
          &:hover {
            background: #eff6ff;
          }
        }
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  stats = signal<StatCard[]>([]);

  ngOnInit(): void {
    this.employeeService.getAll().subscribe(employees => {
      const active = employees.filter(e => e.status === 'active').length;
      const depts = new Set(employees.map(e => e.department)).size;
      this.stats.set([
        {
          label: 'Total empleados',
          value: employees.length,
          icon: 'people',
          color: '#1d4ed8',
          bg: '#eff6ff',
        },
        { label: 'Activos', value: active, icon: 'check_circle', color: '#059669', bg: '#ecfdf5' },
        {
          label: 'Departamentos',
          value: depts,
          icon: 'corporate_fare',
          color: '#d97706',
          bg: '#fffbeb',
        },
        { label: 'Nuevos este mes', value: 3, icon: 'person_add', color: '#7c3aed', bg: '#f5f3ff' },
      ]);
    });
  }
}
