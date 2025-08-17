import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id?: number;
  employeeCode?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;  // Backend uses phoneNumber, not phone
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// For paginated responses
export interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) { }

  // Get all employees with pagination (matches your Postman)
  getAllEmployees(page: number = 0, size: number = 10, sortBy: string = 'id', sortDirection: string = 'asc', search?: string): Observable<ApiResponse<PagedResponse<Employee>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ApiResponse<PagedResponse<Employee>>>(this.apiUrl, { params });
  }

  // Get all employees without pagination (matches /api/employees/all)
  getAllEmployeesNoPagination(): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/all`);
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.apiUrl}/${id}`);
  }

  // Create new employee
  createEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(this.apiUrl, employee);
  }

  // Update employee
  updateEmployee(id: number, employee: Employee): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(`${this.apiUrl}/${id}`, employee);
  }

  // Delete employee (Admin only)
  deleteEmployee(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Search employees
  searchEmployees(query: string): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/search`, {
      params: { query }
    });
  }

  // Get employees by department
  getEmployeesByDepartment(department: string): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/department/${department}`);
  }

  // Get employees by position
  getEmployeesByPosition(position: string): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.apiUrl}/position/${position}`);
  }

  // Get all departments
  getAllDepartments(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/departments`);
  }

  // Get all positions
  getAllPositions(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/positions`);
  }

  // Export to Excel (need to add this endpoint to your Postman)
  exportToExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/excel`, { 
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
  }
}