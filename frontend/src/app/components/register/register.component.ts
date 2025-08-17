import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div style="height: 100vh; display: flex; justify-content: center; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; width: 90%;">
        <h2 style="text-align: center; margin-bottom: 30px; color: #333;">Create New Account</h2>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">First Name</label>
              <input type="text" formControlName="firstName" placeholder="Enter first name" 
                     style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
              <div *ngIf="registerForm.get('firstName')?.hasError('required') && registerForm.get('firstName')?.touched" 
                   style="color: red; font-size: 12px; margin-top: 5px;">
                First name is required
              </div>
            </div>
            
            <div>
              <label style="display: block; margin-bottom: 5px; color: #666;">Last Name</label>
              <input type="text" formControlName="lastName" placeholder="Enter last name" 
                     style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
              <div *ngIf="registerForm.get('lastName')?.hasError('required') && registerForm.get('lastName')?.touched" 
                   style="color: red; font-size: 12px; margin-top: 5px;">
                Last name is required
              </div>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #666;">Username</label>
            <input type="text" formControlName="username" placeholder="Enter username" 
                   style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
            <div *ngIf="registerForm.get('username')?.hasError('required') && registerForm.get('username')?.touched" 
                 style="color: red; font-size: 12px; margin-top: 5px;">
              Username is required
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #666;">Email</label>
            <input type="email" formControlName="email" placeholder="Enter email" 
                   style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
            <div *ngIf="registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched" 
                 style="color: red; font-size: 12px; margin-top: 5px;">
              Email is required
            </div>
            <div *ngIf="registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched" 
                 style="color: red; font-size: 12px; margin-top: 5px;">
              Please enter a valid email
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #666;">Password</label>
            <input type="password" formControlName="password" placeholder="Enter password" 
                   style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
            <div *ngIf="registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched" 
                 style="color: red; font-size: 12px; margin-top: 5px;">
              Password is required
            </div>
            <div *ngIf="registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched" 
                 style="color: red; font-size: 12px; margin-top: 5px;">
              Password must be at least 6 characters
            </div>
          </div>

          <button type="submit" [disabled]="registerForm.invalid || loading" 
                  style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading">Creating Account...</span>
          </button>
        </form>

        <div style="text-align: center; margin-top: 20px;">
          <a routerLink="/login" style="color: #667eea; text-decoration: none;">Already have an account? Login</a>
        </div>

        <div *ngIf="errorMessage" style="margin-top: 15px; padding: 10px; background: #f8d7da; color: #721c24; border-radius: 4px; text-align: center;">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" style="margin-top: 15px; padding: 10px; background: #d4edda; color: #155724; border-radius: 4px; text-align: center;">
          {{ successMessage }}
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
  
      const registerData = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        firstName: this.registerForm.value.firstName, // تم إصلاح هذه القيم
        lastName: this.registerForm.value.lastName     // تم إصلاح هذه القيم
      };
  
      this.authService.register(registerData).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.loading = false;
          this.successMessage = 'Account created successfully! Redirecting to login...';
          
          // انتظار ثانيتين ثم توجيه للوجين
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.loading = false;
          if (error.status === 400) {
            this.errorMessage = 'Username or email already exists';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Please check if backend is running.';
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
        }
      });
    }
  }
}