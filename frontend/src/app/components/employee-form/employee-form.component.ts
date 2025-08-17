import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  template: `
    <div class="employee-form-container">
      <h2 mat-dialog-title>{{ isEdit ? 'Edit Employee' : 'Add New Employee' }}</h2>
      
      <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" placeholder="Enter first name">
              <mat-error *ngIf="employeeForm.get('firstName')?.hasError('required')">
                First name is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" placeholder="Enter last name">
              <mat-error *ngIf="employeeForm.get('lastName')?.hasError('required')">
                Last name is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" placeholder="Enter email">
              <mat-error *ngIf="employeeForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="employeeForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone" placeholder="Enter phone number">
              <mat-error *ngIf="employeeForm.get('phone')?.hasError('required')">
                Phone number is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Department</mat-label>
              <mat-select formControlName="department">
                <mat-option value="IT">Information Technology</mat-option>
                <mat-option value="HR">Human Resources</mat-option>
                <mat-option value="Finance">Finance</mat-option>
                <mat-option value="Marketing">Marketing</mat-option>
                <mat-option value="Sales">Sales</mat-option>
                <mat-option value="Operations">Operations</mat-option>
              </mat-select>
              <mat-error *ngIf="employeeForm.get('department')?.hasError('required')">
                Department is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Position</mat-label>
              <input matInput formControlName="position" placeholder="Enter position">
              <mat-error *ngIf="employeeForm.get('position')?.hasError('required')">
                Position is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Salary</mat-label>
              <input matInput type="number" formControlName="salary" placeholder="Enter salary">
              <mat-error *ngIf="employeeForm.get('salary')?.hasError('required')">
                Salary is required
              </mat-error>
              <mat-error *ngIf="employeeForm.get('salary')?.hasError('min')">
                Salary must be greater than zero
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Hire Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="hireDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="employeeForm.get('hireDate')?.hasError('required')">
                Hire date is required
              </mat-error>
            </mat-form-field>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="employeeForm.invalid || loading">
            <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
            <span *ngIf="!loading">{{ isEdit ? 'Update' : 'Add' }}</span>
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .employee-form-container {
      min-width: 400px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .full-width {
      flex: 1;
    }

    mat-dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    mat-dialog-actions {
      padding: 16px 0;
    }

    button[type="submit"] {
      min-width: 100px;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 8px;
      }

      .employee-form-container {
        min-width: 300px;
      }
    }
  `]
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  loading = false;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<EmployeeFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employee | null, isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      department: ['', Validators.required],
      position: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      hireDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.isEdit && this.data.employee) {
      this.employeeForm.patchValue({
        ...this.data.employee,
        hireDate: new Date(this.data.employee.hireDate)
      });
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      this.loading = true;
      const employeeData = this.employeeForm.value;

      if (this.isEdit && this.data.employee) {
        this.employeeService.updateEmployee(this.data.employee.id!, employeeData).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Employee updated successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open('Error updating employee', 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('Employee added successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open('Error adding employee', 'Close', {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
