import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>إنشاء حساب جديد</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>اسم المستخدم</mat-label>
              <input matInput formControlName="username" placeholder="أدخل اسم المستخدم">
              <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
                اسم المستخدم مطلوب
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>البريد الإلكتروني</mat-label>
              <input matInput type="email" formControlName="email" placeholder="أدخل البريد الإلكتروني">
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                البريد الإلكتروني مطلوب
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                بريد إلكتروني غير صحيح
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>كلمة المرور</mat-label>
              <input matInput type="password" formControlName="password" placeholder="أدخل كلمة المرور">
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                كلمة المرور مطلوبة
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                كلمة المرور يجب أن تكون 6 أحرف على الأقل
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="registerForm.invalid || loading" class="full-width">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">إنشاء الحساب</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions class="text-center">
          <button mat-button routerLink="/login">لديك حساب بالفعل؟ سجل دخولك</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .register-card {
      max-width: 400px;
      width: 90%;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .text-center {
      text-align: center;
    }

    mat-card-header {
      justify-content: center;
      margin-bottom: 20px;
    }

    mat-card-title {
      font-size: 24px;
      font-weight: 500;
    }

    button[type="submit"] {
      height: 48px;
      font-size: 16px;
    }

    mat-card-actions {
      padding: 16px 0;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('تم إنشاء الحساب بنجاح', 'إغلاق', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('خطأ في إنشاء الحساب', 'إغلاق', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }
      });
    }
  }
}
