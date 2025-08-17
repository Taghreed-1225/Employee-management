import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService, Employee } from '../../services/employee.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-employee-list',
  template: `
    <div class="employee-list-container">
      <div class="header-actions">
        <h2>قائمة الموظفين</h2>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="addEmployee()">
            <mat-icon>add</mat-icon>
            إضافة موظف جديد
          </button>
          <button mat-raised-button color="accent" (click)="exportToExcel()" [disabled]="loading">
            <mat-icon>download</mat-icon>
            تصدير إلى Excel
          </button>
        </div>
      </div>

      <div class="table-container mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort>
          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> الرقم </th>
            <td mat-cell *matCellDef="let element"> {{element.id}} </td>
          </ng-container>

          <!-- First Name Column -->
          <ng-container matColumnDef="firstName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> الاسم الأول </th>
            <td mat-cell *matCellDef="let element"> {{element.firstName}} </td>
          </ng-container>

          <!-- Last Name Column -->
          <ng-container matColumnDef="lastName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> الاسم الأخير </th>
            <td mat-cell *matCellDef="let element"> {{element.lastName}} </td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> البريد الإلكتروني </th>
            <td mat-cell *matCellDef="let element"> {{element.email}} </td>
          </ng-container>

          <!-- Phone Column -->
          <ng-container matColumnDef="phone">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> رقم الهاتف </th>
            <td mat-cell *matCellDef="let element"> {{element.phone}} </td>
          </ng-container>

          <!-- Department Column -->
          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> القسم </th>
            <td mat-cell *matCellDef="let element"> {{element.department}} </td>
          </ng-container>

          <!-- Position Column -->
          <ng-container matColumnDef="position">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> المنصب </th>
            <td mat-cell *matCellDef="let element"> {{element.position}} </td>
          </ng-container>

          <!-- Salary Column -->
          <ng-container matColumnDef="salary">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> الراتب </th>
            <td mat-cell *matCellDef="let element"> {{element.salary | currency:'EGP'}} </td>
          </ng-container>

          <!-- Hire Date Column -->
          <ng-container matColumnDef="hireDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> تاريخ التعيين </th>
            <td mat-cell *matCellDef="let element"> {{element.hireDate | date:'shortDate'}} </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> الإجراءات </th>
            <td mat-cell *matCellDef="let element">
              <div class="action-buttons">
                <button mat-icon-button color="primary" (click)="editEmployee(element)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteEmployee(element.id!)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of employees"></mat-paginator>
      </div>

      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>جاري تحميل البيانات...</p>
      </div>
    </div>
  `,
  styles: [`
    .employee-list-container {
      margin-top: 20px;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    h2 {
      margin: 0;
      color: #333;
    }

    .table-container {
      position: relative;
      min-height: 400px;
    }

    table {
      width: 100%;
    }

    .mat-column-actions {
      width: 120px;
      text-align: center;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
      justify-content: center;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      gap: 16px;
    }

    .loading-container p {
      margin: 0;
      color: #666;
    }

    @media (max-width: 768px) {
      .header-actions {
        flex-direction: column;
        align-items: stretch;
      }

      .actions {
        justify-content: center;
      }
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'phone', 'department', 'position', 'salary', 'hireDate', 'actions'];
  dataSource: MatTableDataSource<Employee> = new MatTableDataSource<Employee>([]);
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('خطأ في تحميل البيانات', 'إغلاق', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  addEmployee() {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '500px',
      data: { employee: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  editEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      width: '500px',
      data: { employee: employee, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
  }

  deleteEmployee(id: number) {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.snackBar.open('تم حذف الموظف بنجاح', 'إغلاق', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.loadEmployees();
        },
        error: (error) => {
          this.snackBar.open('خطأ في حذف الموظف', 'إغلاق', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }
      });
    }
  }

  exportToExcel() {
    this.loading = true;
    this.employeeService.exportToExcel().subscribe({
      next: (blob) => {
        saveAs(blob, 'employees.xlsx');
        this.loading = false;
        this.snackBar.open('تم تصدير البيانات بنجاح', 'إغلاق', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('خطأ في تصدير البيانات', 'إغلاق', {
          duration: 3000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }
}
