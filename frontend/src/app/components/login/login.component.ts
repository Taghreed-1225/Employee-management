import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>تسجيل الدخول</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>اسم المستخدم</mat-label>
              <input matInput formControlName="username" placeholder="أدخل اسم المستخدم">
              <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
                اسم المستخدم مطلوب
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>كلمة المرور</mat-label>
              <input matInput type="password" formControlName="password" placeholder="أدخل كلمة المرور">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                كلمة المرور مطلوبة
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="loginForm.invalid || loading" class="full-width">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">تسجيل الدخول</span>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions class="text-center">
          <button mat-button routerLink="/register">ليس لديك حساب؟ سجل الآن</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
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
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('تم تسجيل الدخول بنجاح', 'إغلاق', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('خطأ في تسجيل الدخول', 'إغلاق', {
            duration: 3000,
            panelClass: 'error-snackbar'
          });
        }
      });
    }
  }
}
