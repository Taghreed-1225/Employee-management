import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div style="height: 100vh; display: flex; justify-content: center; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; width: 90%;">
        <h2 style="text-align: center; margin-bottom: 30px; color: #333;">Login</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #666;">Username</label>
            <input type="text" formControlName="username" placeholder="Enter username" 
                   style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
            <div *ngIf="loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched" 
                 style="color: red; font-size: 12px; margin-top: 5px;">
              Username is required
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; color: #666;">Password</label>
            <input type="password" formControlName="password" placeholder="Enter password" 
                   style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;">
            <div *ngIf="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched" 
                 style="color: red; font-size: 12px; margin-top: 5px;">
              Password is required
            </div>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || loading" 
                  style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">
            <span *ngIf="!loading">Login</span>
            <span *ngIf="loading">Loading...</span>
          </button>
        </form>

        <div style="text-align: center; margin-top: 20px;">
          <a routerLink="/register" style="color: #667eea; text-decoration: none;">Don't have an account? Register now</a>
        </div>

        <div *ngIf="errorMessage" style="margin-top: 15px; padding: 10px; background: #f8d7da; color: #721c24; border-radius: 4px; text-align: center;">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    console.log('LoginComponent initialized');
  }

  onSubmit() {
    console.log('Login form submitted');
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      console.log('Form data:', this.loginForm.value);
      
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.loading = false;
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.loading = false;
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Please check if backend is running.';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
        }
      });
    }
  }
}
