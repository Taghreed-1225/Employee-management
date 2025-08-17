import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar *ngIf="showNavbar"></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  get showNavbar(): boolean {
    const currentRoute = window.location.pathname;
    return currentRoute !== '/login' && currentRoute !== '/register';
  }
}
