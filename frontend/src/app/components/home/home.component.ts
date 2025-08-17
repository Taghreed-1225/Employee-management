import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="container">
      <div class="welcome-section">
        <h1>مرحباً بك في نظام إدارة الموظفين</h1>
        <p>يمكنك إدارة الموظفين وإضافة وتعديل وحذف بياناتهم</p>
      </div>

      <app-employee-list></app-employee-list>
    </div>
  `,
  styles: [`
    .welcome-section {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
    }

    h1 {
      margin: 0 0 10px 0;
      font-size: 2.5rem;
      font-weight: 300;
    }

    p {
      margin: 0;
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class HomeComponent {}
