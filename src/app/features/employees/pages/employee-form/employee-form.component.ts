import { Component, inject, signal, OnInit, input } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { NgxImageCompressService } from 'ngx-image-compress';
import { EmployeeService } from '../../../../core/services/employee.service';
import {
  dniValidator,
  dateRangeValidator,
  salaryRangeValidator,
} from '../../../../core/validators/custom.validators';

@Component({
  selector: 'app-employee-form',
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h2>{{ isEditMode() ? 'Editar empleado' : 'Nuevo empleado' }}</h2>
        <button mat-stroked-button type="button" (click)="cancel()">
          <mat-icon>arrow_back</mat-icon> Cancelar
        </button>
      </div>

      <mat-stepper linear #stepper>
        <!-- Step 1: Datos personales -->
        <mat-step [stepControl]="personalGroup" label="Datos personales">
          <form [formGroup]="personalGroup">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="firstName" />
                @if (personalGroup.get('firstName')?.hasError('required')) {
                  <mat-error>Requerido</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="lastName" />
                @if (personalGroup.get('lastName')?.hasError('required')) {
                  <mat-error>Requerido</mat-error>
                }
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>DNI</mat-label>
                <input matInput formControlName="dni" />
                @if (personalGroup.get('dni')?.hasError('invalidDni')) {
                  <mat-error>DNI inválido (7-8 dígitos)</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" />
                @if (personalGroup.get('email')?.hasError('email')) {
                  <mat-error>Email inválido</mat-error>
                }
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Teléfono</mat-label>
              <input matInput formControlName="phone" />
            </mat-form-field>

            <!-- Foto de perfil -->
            <div class="photo-section">
              <button mat-stroked-button type="button" (click)="selectPhoto()">
                <mat-icon>photo_camera</mat-icon> Subir foto
              </button>
              @if (photoPreview()) {
                <img [src]="photoPreview()" alt="Preview" class="photo-preview" />
              }
            </div>

            <div class="step-actions">
              <button
                mat-raised-button
                color="primary"
                matStepperNext
                [disabled]="personalGroup.invalid"
              >
                Siguiente
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Step 2: Datos laborales -->
        <mat-step [stepControl]="workGroup" label="Datos laborales">
          <form [formGroup]="workGroup">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Departamento</mat-label>
                <mat-select formControlName="department">
                  @for (dept of departments; track dept) {
                    <mat-option [value]="dept">{{ dept }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Cargo</mat-label>
                <input matInput formControlName="position" />
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tipo de contrato</mat-label>
                <mat-select formControlName="employmentType">
                  <mat-option value="full-time">Full-time</mat-option>
                  <mat-option value="part-time">Part-time</mat-option>
                  <mat-option value="contractor">Contratado</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Estado</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="active">Activo</mat-option>
                  <mat-option value="inactive">Inactivo</mat-option>
                  <mat-option value="on-leave">De licencia</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Fecha de inicio</mat-label>
                <input matInput formControlName="startDate" type="date" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Salario ($)</mat-label>
                <input matInput formControlName="salary" type="number" />
                @if (workGroup.get('salary')?.hasError('salaryTooLow')) {
                  <mat-error>Salario mínimo: $100.000</mat-error>
                }
                @if (workGroup.get('salary')?.hasError('salaryTooHigh')) {
                  <mat-error>Salario máximo: $10.000.000</mat-error>
                }
              </mat-form-field>
            </div>
            <div class="step-actions">
              <button mat-button matStepperPrevious>Anterior</button>
              <button
                mat-raised-button
                color="primary"
                matStepperNext
                [disabled]="workGroup.invalid"
              >
                Siguiente
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Step 3: Experiencia laboral (FormArray) -->
        <mat-step label="Experiencia">
          <form [formGroup]="experienceGroup">
            <div formArrayName="workExperience">
              @for (exp of workExperienceArray.controls; track $index) {
                <mat-card class="exp-card" [formGroupName]="$index">
                  <mat-card-header>
                    <mat-card-title>Experiencia {{ $index + 1 }}</mat-card-title>
                    <button
                      mat-icon-button
                      color="warn"
                      type="button"
                      (click)="removeExperience($index)"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Empresa</mat-label>
                        <input matInput formControlName="company" />
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Cargo</mat-label>
                        <input matInput formControlName="position" />
                      </mat-form-field>
                    </div>
                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Inicio</mat-label>
                        <input matInput formControlName="startDate" type="date" />
                      </mat-form-field>
                      <mat-form-field appearance="outline">
                        <mat-label>Fin (vacío si actual)</mat-label>
                        <input matInput formControlName="endDate" type="date" />
                      </mat-form-field>
                    </div>
                    @if (exp.hasError('invalidDateRange')) {
                      <p class="error-text">La fecha de fin debe ser posterior al inicio</p>
                    }
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Descripción</mat-label>
                      <textarea matInput formControlName="description" rows="2"></textarea>
                    </mat-form-field>
                  </mat-card-content>
                </mat-card>
              }
            </div>
            <button mat-stroked-button type="button" (click)="addExperience()">
              <mat-icon>add</mat-icon> Agregar experiencia
            </button>
            <div class="step-actions">
              <button mat-button matStepperPrevious>Anterior</button>
              <button mat-raised-button color="primary" matStepperNext>Siguiente</button>
            </div>
          </form>
        </mat-step>

        <!-- Step 4: Resumen y envío -->
        <mat-step label="Confirmar">
          <div class="summary">
            <p>
              <strong>Nombre:</strong> {{ personalGroup.get('firstName')?.value }}
              {{ personalGroup.get('lastName')?.value }}
            </p>
            <p><strong>Email:</strong> {{ personalGroup.get('email')?.value }}</p>
            <p><strong>Departamento:</strong> {{ workGroup.get('department')?.value }}</p>
            <p><strong>Cargo:</strong> {{ workGroup.get('position')?.value }}</p>
          </div>
          <div class="step-actions">
            <button mat-button matStepperPrevious>Anterior</button>
            <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="loading()">
              {{ loading() ? 'Guardando...' : isEditMode() ? 'Actualizar' : 'Crear empleado' }}
            </button>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [
    `
      .form-container {
        max-width: 800px;
        margin: 0 auto;
      }
      .form-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }
      h2 {
        color: #1a237e;
        margin: 0;
      }
      .form-row {
        display: flex;
        gap: 16px;
      }
      .form-row mat-form-field {
        flex: 1;
      }
      .full-width {
        width: 100%;
      }
      .step-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
        justify-content: flex-end;
      }
      .exp-card {
        margin-bottom: 16px;
      }
      mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .photo-section {
        display: flex;
        align-items: center;
        gap: 16px;
        margin: 16px 0;
      }
      .photo-preview {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
      }
      .error-text {
        color: #f44336;
        font-size: 0.75rem;
        margin: 4px 0;
      }
      .summary p {
        margin: 8px 0;
      }
    `,
  ],
})
export class EmployeeFormComponent implements OnInit {
  id = input<string>();

  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private imageCompress = inject(NgxImageCompressService);

  isEditMode = signal(false);
  loading = signal(false);
  photoPreview = signal<string | null>(null);

  departments = ['Tecnología', 'RRHH', 'Administración', 'Comercial', 'Operaciones'];

  personalGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    dni: ['', [Validators.required, dniValidator()]],
    photoUrl: [''],
  });

  workGroup = this.fb.group({
    department: ['', Validators.required],
    position: ['', Validators.required],
    employmentType: ['full-time', Validators.required],
    status: ['active', Validators.required],
    startDate: ['', Validators.required],
    salary: [null as number | null, [Validators.required, salaryRangeValidator(100000, 10000000)]],
  });

  experienceGroup = this.fb.group({
    workExperience: this.fb.array([]),
  });

  get workExperienceArray(): FormArray {
    return this.experienceGroup.get('workExperience') as FormArray;
  }

  ngOnInit(): void {
    if (this.id()) {
      this.isEditMode.set(true);
      this.employeeService.getById(Number(this.id())).subscribe(emp => {
        this.personalGroup.patchValue(emp);
        this.workGroup.patchValue(emp);
        emp.workExperience.forEach(exp => this.addExperience(exp));
        if (emp.photoUrl) this.photoPreview.set(emp.photoUrl);
      });
    }
  }

  addExperience(data?: {
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
    description: string;
  }): void {
    const expGroup = this.fb.group(
      {
        company: [data?.company ?? '', Validators.required],
        position: [data?.position ?? '', Validators.required],
        startDate: [data?.startDate ?? '', Validators.required],
        endDate: [data?.endDate ?? ''],
        description: [data?.description ?? ''],
      },
      { validators: dateRangeValidator('startDate', 'endDate') }
    );
    this.workExperienceArray.push(expGroup);
  }

  removeExperience(index: number): void {
    this.workExperienceArray.removeAt(index);
  }

  async selectPhoto(): Promise<void> {
    const result = await this.imageCompress.uploadFile();
    const compressed = await this.imageCompress.compressFile(
      result.image,
      result.orientation,
      50,
      50
    );
    this.photoPreview.set(compressed);
    this.personalGroup.patchValue({ photoUrl: compressed });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }

  onSubmit(): void {
    if (this.personalGroup.invalid || this.workGroup.invalid) return;
    this.loading.set(true);

    const payload = {
      ...this.personalGroup.value,
      ...this.workGroup.value,
      workExperience: this.workExperienceArray.value,
      skills: [],
    } as any;

    const request$ = this.isEditMode()
      ? this.employeeService.update(Number(this.id()), payload)
      : this.employeeService.create(payload);

    request$.subscribe({
      next: () => {
        this.toastr.success(
          this.isEditMode() ? 'Empleado actualizado' : 'Empleado creado correctamente'
        );
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.toastr.error('Ocurrió un error al guardar');
        this.loading.set(false);
      },
    });
  }
}
