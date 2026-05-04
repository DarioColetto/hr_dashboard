import { Component, inject, signal, OnInit, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../../../core/services/employee.service';
import { PdfService } from '../../../../core/services/pdf.service';
import { Employee } from '../../../../core/models/employee.model';

@Component({
  selector: 'app-employee-detail',
  imports: [
    RouterLink,
    DecimalPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],
  template: `
    @if (employee()) {
      <div class="detail-container">
        <div class="detail-header">
          <div class="employee-avatar">
            @if (employee()!.photoUrl) {
              <img [src]="employee()!.photoUrl" alt="Foto" />
            } @else {
              <mat-icon>account_circle</mat-icon>
            }
          </div>
          <div class="header-info">
            <h2>{{ employee()!.firstName }} {{ employee()!.lastName }}</h2>
            <p class="position">{{ employee()!.position }} — {{ employee()!.department }}</p>
            <mat-chip [class]="'status-' + employee()!.status">
              {{ employee()!.status }}
            </mat-chip>
          </div>
          <div class="header-actions">
            <a mat-stroked-button [routerLink]="['/employees', employee()!.id, 'edit']">
              <mat-icon>edit</mat-icon> Editar
            </a>
            <button mat-raised-button color="primary" (click)="generatePdf()">
              <mat-icon>picture_as_pdf</mat-icon> Exportar PDF
            </button>
          </div>
        </div>

        <mat-divider />

        <div class="detail-grid">
          <mat-card>
            <mat-card-header><mat-card-title>Información personal</mat-card-title></mat-card-header>
            <mat-card-content>
              <p><strong>DNI:</strong> {{ employee()!.dni }}</p>
              <p><strong>Email:</strong> {{ employee()!.email }}</p>
              <p><strong>Teléfono:</strong> {{ employee()!.phone }}</p>
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-header><mat-card-title>Datos laborales</mat-card-title></mat-card-header>
            <mat-card-content>
              <p><strong>Tipo:</strong> {{ employee()!.employmentType }}</p>
              <p><strong>Inicio:</strong> {{ employee()!.startDate }}</p>
              <p><strong>Salario:</strong> {{ employee()!.salary | number: '1.0-0' }}</p>
            </mat-card-content>
          </mat-card>
        </div>

        @if (employee()!.workExperience.length) {
          <mat-card class="exp-section">
            <mat-card-header><mat-card-title>Experiencia laboral</mat-card-title></mat-card-header>
            <mat-card-content>
              @for (exp of employee()!.workExperience; track $index) {
                <div class="exp-item">
                  <strong>{{ exp.position }}</strong> — {{ exp.company }}
                  <span class="exp-dates"
                    >{{ exp.startDate }} → {{ exp.endDate ?? 'Actualidad' }}</span
                  >
                  <p>{{ exp.description }}</p>
                </div>
                <mat-divider />
              }
            </mat-card-content>
          </mat-card>
        }

        <div class="back-link">
          <a mat-button routerLink="/employees"><mat-icon>arrow_back</mat-icon> Volver</a>
        </div>
      </div>
    } @else {
      <p>Cargando...</p>
    }
  `,
  styles: [
    `
      .detail-container {
        max-width: 860px;
        margin: 0 auto;
      }

      .detail-header {
        display: flex;
        align-items: center;
        gap: 24px;
        padding: 28px;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        margin-bottom: 20px;
      }

      .employee-avatar {
        flex-shrink: 0;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #e2e8f0;
        }
        mat-icon {
          width: 80px;
          height: 80px;
          font-size: 80px;
          color: #cbd5e1;
        }
      }

      .header-info {
        flex: 1;
      }
      h2 {
        margin: 0 0 4px;
        font-size: 22px;
        font-weight: 700;
        color: #0f172a;
      }
      .position {
        margin: 0 0 10px;
        color: #64748b;
        font-size: 14px;
      }

      .header-actions {
        margin-left: auto;
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;

        @media (max-width: 600px) {
          grid-template-columns: 1fr;
        }
      }

      mat-card-title {
        font-size: 14px !important;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      mat-card-content p {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #f1f5f9;
        font-size: 14px;
        color: #0f172a;
        margin: 0;

        strong {
          color: #64748b;
          font-weight: 500;
        }
        &:last-child {
          border-bottom: none;
        }
      }

      .exp-item {
        padding: 14px 0;
        strong {
          font-size: 14px;
          color: #0f172a;
        }
        p {
          color: #64748b;
          font-size: 13px;
          margin: 4px 0 0;
          border: none;
          padding: 0;
        }
      }
      .exp-dates {
        font-size: 12px;
        color: #94a3b8;
        margin-left: 6px;
      }

      .back-link {
        margin-top: 20px;
      }

      .status-active {
        --mat-chip-container-color: #dcfce7;
        color: #166534 !important;
      }
      .status-inactive {
        --mat-chip-container-color: #fee2e2;
        color: #991b1b !important;
      }
      .status-on-leave {
        --mat-chip-container-color: #fef3c7;
        color: #92400e !important;
      }
    `,
  ],
})
export class EmployeeDetailComponent implements OnInit {
  id = input<string>();
  private employeeService = inject(EmployeeService);
  private toastr = inject(ToastrService);
  private pdfService = inject(PdfService);
  employee = signal<Employee | null>(null);

  ngOnInit(): void {
    this.employeeService.getById(Number(this.id())).subscribe({
      next: emp => this.employee.set(emp),
      error: () => this.toastr.error('No se pudo cargar el empleado'),
    });
  }

  generatePdf(): void {
    const emp = this.employee();
    if (!emp) return;

    const docDefinition = {
      content: [
        { text: 'Ficha de Empleado', style: 'header' },
        { text: `${emp.firstName} ${emp.lastName}`, style: 'subheader' },
        { text: `${emp.position} — ${emp.department}`, margin: [0, 0, 0, 16] },
        {
          table: {
            widths: ['*', '*'],
            body: [
              ['DNI', emp.dni],
              ['Email', emp.email],
              ['Teléfono', emp.phone],
              ['Tipo de contrato', emp.employmentType],
              ['Fecha de inicio', emp.startDate],
              ['Salario', `$${emp.salary}`],
              ['Estado', emp.status],
            ],
          },
        },
        ...(emp.workExperience.length
          ? [
              { text: 'Experiencia laboral', style: 'subheader', margin: [0, 16, 0, 8] },
              ...emp.workExperience.map(exp => ({
                text: `${exp.position} en ${exp.company} (${exp.startDate} – ${exp.endDate ?? 'Actualidad'})\n${exp.description}`,
                margin: [0, 0, 0, 8],
              })),
            ]
          : []),
      ],
      styles: {
        header: { fontSize: 20, bold: true, margin: [0, 0, 0, 8] },
        subheader: { fontSize: 14, bold: true, color: '#1a237e' },
      },
    };

    this.pdfService
      .download(docDefinition, `${emp.firstName}_${emp.lastName}.pdf`)
      .then(() => this.toastr.success('PDF generado correctamente'))
      .catch((err: unknown) => {
        console.error('[PDF] Error:', err);
        this.toastr.error('Error al generar el PDF');
      });
  }
}
