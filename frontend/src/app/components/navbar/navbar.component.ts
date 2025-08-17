import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <mat-toolbar color="primary">
      <span>Employee Management System</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/home">
        <mat-icon>home</mat-icon>
        Home
      </button>
      <button mat-button (click)="logout()">
        <mat-icon>logout</mat-icon>
        Logout
      </button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    button {
      margin-left: 8px;
    }
  `]
})
export class NavbarComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
