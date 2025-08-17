import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div style="min-height: 100vh;">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'Employee Management System';
}
