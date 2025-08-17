import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  template: `
    <div class="employee-form-container">
      <h2 mat-dialog-title>{{ isEdit ? 'تعديل الموظف' : 'إضافة موظف جديد' }}</h2>
      
      <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>الاسم الأول</mat-label>
              <input matInput formControlName="firstName" placeholder="أدخل الاسم الأول">
              <mat-error *ngIf="employeeForm.get('firstName')?.hasError('required')">
                الاسم الأول مطلوب
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>الاسم الأخير</mat-label>
              <input matInput formControlName="lastName" placeholder="أدخل الاسم الأخير">
              <mat-error *ngIf="employeeForm.get('lastName')?.hasError('required')">
                الاسم الأخير مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>البريد الإلكتروني</mat-label>
              <input matInput type="email" formControlName="email" placeholder="أدخل البريد الإلكتروني">
              <mat-error *ngIf="employeeForm.get('email')?.hasError('required')">
                البريد الإلكتروني مطلوب
              </mat-error>
              <mat-error *ngIf="employeeForm.get('email')?.hasError('email')">
                بريد إلكتروني غير صحيح
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>رقم الهاتف</mat-label>
              <input matInput formControlName="phone" placeholder="أدخل رقم الهاتف">
              <mat-error *ngIf="employeeForm.get('phone')?.hasError('required')">
                رقم الهاتف مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>القسم</mat-label>
              <mat-select formControlName="department">
                <mat-option value="IT">تقنية المعلومات</mat-option>
                <mat-option value="HR">الموارد البشرية</mat-option>
                <mat-option value="Finance">المالية</mat-option>
                <mat-option value="Marketing">التسويق</mat-option>
                <mat-option value="Sales">المبيعات</mat-option>
                <mat-option value="Operations">العمليات</mat-option>
              </mat-select>
              <mat-error *ngIf="employeeForm.get('department')?.hasError('required')">
                القسم مطلوب
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>المنصب</mat-label>
              <input matInput formControlName="position" placeholder="أدخل المنصب">
              <mat-error *ngIf="employeeForm.get('position')?.hasError('required')">
                المنصب مطلوب
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>الراتب</mat-label>
              <input matInput type="number" formControlName="salary" placeholder="أدخل الراتب">
              <mat-error *ngIf="employeeForm.get('salary')?.hasError('required')">
                الراتب مطلوب
              </mat-error>
              <mat-error *ngIf="employeeForm.get('salary')?.hasError('min')">
                الراتب يجب أن يكون أكبر من صفر
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>تاريخ التعيين</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="hireDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="employeeForm.get('hireDate')?.hasError('required')">
                تاريخ التعيين مطلوب
              </mat-error>
            </mat-form-field>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">إلغاء</button>
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="employeeForm.invalid || loading">
            <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
            <span *ngIf="!loading">{{ isEdit ? 'تحديث' : 'إضافة' }}</span>
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
            this.snackBar.open('تم تحديث الموظف بنجاح', 'إغلاق', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open('خطأ في تحديث الموظف', 'إغلاق', {
              duration: 3000,
              panelClass: 'error-snackbar'
            });
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: () => {
            this.loading = false;
            this.snackBar.open('تم إضافة الموظف بنجاح', 'إغلاق', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.loading = false;
            this.snackBar.open('خطأ في إضافة الموظف', 'إغلاق', {
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
