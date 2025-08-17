import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService, Employee } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <div style="padding: 20px; background: #f5f5f5; min-height: 100vh;">
      <!-- Header -->
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h1 style="color: #333; margin: 0;">Employee Management System</h1>
          <button 
            (click)="logout()"
            style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            Logout
          </button>
        </div>
      </div>

      <!-- Actions Bar -->
      <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button 
            (click)="showAddForm = true"
            style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            Add Employee
          </button>
          <button 
            (click)="loadEmployees()"
            [disabled]="loading"
            style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            {{ loading ? 'Loading...' : 'Refresh' }}
          </button>
          <button 
            (click)="exportToExcel()"
            [disabled]="loading"
            style="background: #17a2b8; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            Export Excel
          </button>
          <input 
            type="text" 
            placeholder="Search employees..." 
            [(ngModel)]="searchTerm"
            (keyup.enter)="searchEmployees()"
            style="padding: 10px; border: 1px solid #ddd; border-radius: 4px; flex: 1; min-width: 200px;">
          <button 
            (click)="searchEmployees()"
            style="background: #ffc107; color: black; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
            Search
          </button>
        </div>
      </div>

      <!-- Add/Edit Form -->
      <div *ngIf="showAddForm || editingEmployee" 
           style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
        <h3 style="margin-bottom: 15px; color: #333;">{{ editingEmployee ? 'Edit Employee' : 'Add New Employee' }}</h3>
        
        <form (ngSubmit)="saveEmployee()">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">Employee Code</label>
              <input type="text" [(ngModel)]="currentEmployee.employeeCode" name="employeeCode" required
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">Status</label>
              <select [(ngModel)]="currentEmployee.status" name="status" required
                      style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">First Name</label>
              <input type="text" [(ngModel)]="currentEmployee.firstName" name="firstName" required
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">Last Name</label>
              <input type="text" [(ngModel)]="currentEmployee.lastName" name="lastName" required
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">Email</label>
              <input type="email" [(ngModel)]="currentEmployee.email" name="email" required
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">Phone Number</label>
              <input type="text" [(ngModel)]="currentEmployee.phoneNumber" name="phoneNumber" required
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">Department</label>
              <input type="text" [(ngModel)]="currentEmployee.department" name="department" required
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">Position</label>
              <input type="text" [(ngModel)]="currentEmployee.position" name="position" required
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">Salary</label>
              <input type="number" [(ngModel)]="currentEmployee.salary" name="salary" required
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">Hire Date</label>
              <input type="date" [(ngModel)]="currentEmployee.hireDate" name="hireDate" required
                     style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
            </div>
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="submit" [disabled]="loading"
                    style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
              {{ loading ? 'Saving...' : (editingEmployee ? 'Update' : 'Add') }}
            </button>
            <button type="button" (click)="cancelEdit()"
                    style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Employees Table -->
      <div style="background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="padding: 20px; border-bottom: 1px solid #eee;">
          <h3 style="margin: 0; color: #333;">Employees ({{ employees.length }})</h3>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="background: #f8f9fa;">
              <tr>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">ID</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Code</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Name</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Email</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Phone</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Department</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Position</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Salary</th>
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Status</th>
                <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let employee of employees; let i = index" 
                  [style.background-color]="i % 2 === 0 ? '#f8f9fa' : 'white'">
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">{{ employee.id }}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">{{ employee.employeeCode }}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">{{ employee.firstName }} {{ employee.lastName }}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">{{ employee.email }}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">{{ employee.phoneNumber }}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">{{ employee.department }}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">{{ employee.position }}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">{{ employee.salary | currency:'USD':'symbol':'1.0-0' }}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">
                  <span [style.color]="employee.status === 'ACTIVE' ? '#28a745' : '#dc3545'">
                    {{ employee.status }}
                  </span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6; text-align: center;">
                  <button (click)="editEmployee(employee)" 
                          style="background: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">
                    Edit
                  </button>
                  <button (click)="deleteEmployee(employee.id!)" 
                          style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div *ngIf="employees.length === 0 && !loading" 
               style="padding: 40px; text-align: center; color: #666;">
            No employees found. <button (click)="showAddForm = true" style="color: #007bff; background: none; border: none; text-decoration: underline; cursor: pointer;">Add the first employee</button>
          </div>

          <div *ngIf="loading" 
               style="padding: 40px; text-align: center; color: #666;">
            Loading employees...
          </div>
        </div>
      </div>

      <!-- Status Messages -->
      <div *ngIf="message" 
           [style.background]="messageType === 'success' ? '#d4edda' : '#f8d7da'"
           [style.color]="messageType === 'success' ? '#155724' : '#721c24'"
           style="margin-top: 15px; padding: 10px; border-radius: 4px; text-align: center;">
        {{ message }}
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  employees: Employee[] = [];
  loading: boolean = false;
  showAddForm: boolean = false;
  editingEmployee: Employee | null = null;
  searchTerm: string = '';
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  currentEmployee: Employee = {
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    position: '',
    salary: 0,
    hireDate: '',
    status: 'ACTIVE'
  };

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getAllEmployeesNoPagination().subscribe({
      next: (response) => {
        if (response.success) {
          this.employees = response.data;
          this.showMessage('Employees loaded successfully', 'success');
        } else {
          this.showMessage('Failed to load employees: ' + response.message, 'error');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.showMessage('Error loading employees. Please check connection.', 'error');
        this.loading = false;
      }
    });
  }

  searchEmployees() {
    if (!this.searchTerm.trim()) {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.employeeService.searchEmployees(this.searchTerm).subscribe({
      next: (response) => {
        if (response.success) {
          this.employees = response.data;
          this.showMessage(`Found ${response.data.length} employees`, 'success');
        } else {
          this.showMessage('Search failed: ' + response.message, 'error');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching employees:', error);
        this.showMessage('Error searching employees', 'error');
        this.loading = false;
      }
    });
  }

  saveEmployee() {
    this.loading = true;

    if (this.editingEmployee) {
      // Update existing employee
      this.employeeService.updateEmployee(this.editingEmployee.id!, this.currentEmployee).subscribe({
        next: (response) => {
          if (response.success) {
            this.showMessage('Employee updated successfully', 'success');
            this.loadEmployees();
            this.cancelEdit();
          } else {
            this.showMessage('Failed to update employee: ' + response.message, 'error');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.showMessage('Error updating employee', 'error');
          this.loading = false;
        }
      });
    } else {
      // Create new employee
      this.employeeService.createEmployee(this.currentEmployee).subscribe({
        next: (response) => {
          if (response.success) {
            this.showMessage('Employee added successfully', 'success');
            this.loadEmployees();
            this.cancelEdit();
          } else {
            this.showMessage('Failed to add employee: ' + response.message, 'error');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          this.showMessage('Error adding employee', 'error');
          this.loading = false;
        }
      });
    }
  }

  editEmployee(employee: Employee) {
    this.editingEmployee = employee;
    this.currentEmployee = { ...employee };
    this.showAddForm = false;
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.loading = true;
      this.employeeService.deleteEmployee(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.showMessage('Employee deleted successfully', 'success');
            this.loadEmployees();
          } else {
            this.showMessage('Failed to delete employee: ' + response.message, 'error');
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.showMessage('Error deleting employee. You may need admin privileges.', 'error');
          this.loading = false;
        }
      });
    }
  }

  cancelEdit() {
    this.showAddForm = false;
    this.editingEmployee = null;
    this.currentEmployee = {
      employeeCode: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      position: '',
      salary: 0,
      hireDate: '',
      status: 'ACTIVE'
    };
  }

  exportToExcel() {
    this.loading = true;
    this.employeeService.exportToExcel().subscribe({
      next: (blob) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.showMessage('Excel file downloaded successfully!', 'success');
        this.loading = false;
      },
      error: (error) => {
        console.error('Export error:', error);
        this.showMessage('Error exporting to Excel. Feature may not be implemented yet.', 'error');
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}