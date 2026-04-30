import { FormControl, FormGroup } from '@angular/forms';
import { dniValidator, dateRangeValidator, salaryRangeValidator } from './custom.validators';

describe('Custom Validators', () => {
  describe('dniValidator', () => {
    const control = new FormControl('', dniValidator());

    it('should accept a valid 8-digit DNI', () => {
      control.setValue('28456789');
      expect(control.errors).toBeNull();
    });

    it('should reject a DNI with letters', () => {
      control.setValue('ABCDEFGH');
      expect(control.errors?.['invalidDni']).toBeTruthy();
    });

    it('should reject a DNI with less than 7 digits', () => {
      control.setValue('123456');
      expect(control.errors?.['invalidDni']).toBeTruthy();
    });

    it('should return null for empty value', () => {
      control.setValue('');
      expect(control.errors).toBeNull();
    });
  });

  describe('dateRangeValidator', () => {
    it('should pass when start is before end', () => {
      const group = new FormGroup(
        { startDate: new FormControl('2020-01-01'), endDate: new FormControl('2022-01-01') },
        { validators: dateRangeValidator('startDate', 'endDate') }
      );
      expect(group.errors).toBeNull();
    });

    it('should fail when start is after end', () => {
      const group = new FormGroup(
        { startDate: new FormControl('2023-01-01'), endDate: new FormControl('2020-01-01') },
        { validators: dateRangeValidator('startDate', 'endDate') }
      );
      expect(group.errors?.['invalidDateRange']).toBeTruthy();
    });
  });

  describe('salaryRangeValidator', () => {
    const control = new FormControl(0, salaryRangeValidator(100000, 10000000));

    it('should pass a valid salary', () => {
      control.setValue(500000);
      expect(control.errors).toBeNull();
    });

    it('should fail when salary is below minimum', () => {
      control.setValue(50000);
      expect(control.errors?.['salaryTooLow']).toBeTruthy();
    });

    it('should fail when salary exceeds maximum', () => {
      control.setValue(20000000);
      expect(control.errors?.['salaryTooHigh']).toBeTruthy();
    });
  });
});
