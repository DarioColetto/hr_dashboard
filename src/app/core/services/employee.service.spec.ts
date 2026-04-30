import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee } from '../models/employee.model';

const mockEmployee: Employee = {
  id: 1,
  firstName: 'María',
  lastName: 'González',
  email: 'maria@empresa.com',
  phone: '11-1111-1111',
  dni: '28456789',
  department: 'Tecnología',
  position: 'Developer',
  employmentType: 'full-time',
  status: 'active',
  startDate: '2022-01-01',
  salary: 500000,
  workExperience: [],
  skills: [],
};

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() should return employee list', () => {
    service.getAll().subscribe(employees => {
      expect(employees.length).toBe(1);
      expect(employees[0].firstName).toBe('María');
    });
    const req = httpMock.expectOne(r => r.url.includes('/employees'));
    expect(req.request.method).toBe('GET');
    req.flush([mockEmployee]);
  });

  it('getById() should return a single employee', () => {
    service.getById(1).subscribe(emp => {
      expect(emp.id).toBe(1);
    });
    const req = httpMock.expectOne(r => r.url.includes('/employees/1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployee);
  });

  it('create() should POST a new employee', () => {
    const { id, ...newEmp } = mockEmployee;
    service.create(newEmp).subscribe(emp => {
      expect(emp.id).toBeDefined();
    });
    const req = httpMock.expectOne(r => r.url.includes('/employees'));
    expect(req.request.method).toBe('POST');
    req.flush(mockEmployee);
  });

  it('delete() should DELETE an employee', () => {
    service.delete(1).subscribe(() => expect(true).toBe(true));
    const req = httpMock.expectOne(r => r.url.includes('/employees/1'));
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
