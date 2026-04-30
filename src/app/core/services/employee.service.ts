import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Employee, EmployeeFormValue } from '../models/employee.model';
import { ApiResponse, EmployeeFilters } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/employees`;

  getAll(filters: Omit<EmployeeFilters, 'page' | 'limit'> = {}): Observable<Employee[]> {
    let params = new HttpParams();
    if (filters.search) params = params.set('q', filters.search);
    if (filters.department) params = params.set('department', filters.department);
    if (filters.status) params = params.set('status', filters.status);
    return this.http.get<Employee[]>(this.baseUrl, { params });
  }

  getPaginated(filters: EmployeeFilters = {}): Observable<ApiResponse<Employee[]>> {
    let params = new HttpParams();
    if (filters.search) params = params.set('q', filters.search);
    if (filters.department) params = params.set('department', filters.department);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.page) params = params.set('_page', filters.page);
    if (filters.limit) params = params.set('_per_page', filters.limit);
    return this.http.get<ApiResponse<Employee[]>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  create(employee: EmployeeFormValue): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee);
  }

  update(id: number, employee: Partial<EmployeeFormValue>): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
