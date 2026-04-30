import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dniValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (!value) return null;
    const valid = /^\d{7,8}$/.test(value.replace(/\./g, ''));
    return valid ? null : { invalidDni: true };
  };
}

export function dateRangeValidator(startKey: string, endKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startKey)?.value as string;
    const end = group.get(endKey)?.value as string;
    if (!start || !end) return null;
    return new Date(start) <= new Date(end) ? null : { invalidDateRange: true };
  };
}

export function salaryRangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as number;
    if (value == null) return null;
    if (value < min) return { salaryTooLow: { min } };
    if (value > max) return { salaryTooHigh: { max } };
    return null;
  };
}
