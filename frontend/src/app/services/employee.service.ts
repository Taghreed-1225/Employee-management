import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(this.apiUrl);
  }

  getEmployeeById(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: Employee): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  exportToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' });
  }
}
