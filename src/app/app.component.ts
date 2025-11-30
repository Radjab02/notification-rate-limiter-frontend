// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav>
      <a routerLink="/admin">Admin</a> |
      <a routerLink="/user">User</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
