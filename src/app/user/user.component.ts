//src/app/user/user.component.ts

import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ClientLimit } from '../services/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule
  ],
  template: `
    <h2>User Notification Test</h2>

    <form (ngSubmit)="loadClientLimit()" class="user-form">
      <mat-form-field appearance="fill">
        <mat-label>Client ID</mat-label>
        <input matInput [(ngModel)]="clientId" name="clientId" required placeholder="e.g., client-x" />
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit">Load Limits</button>
    </form>

    <div *ngIf="clientLimit">
      <h3>Limits for {{ clientLimit.clientId }}</h3>
      <p>Monthly Limit: {{ clientLimit.monthlyLimit }}</p>
      <p>Window Capacity: {{ clientLimit.windowCapacity }}</p>
      <p>Window Duration: {{ clientLimit.windowDurationSeconds }}s</p>

      <mat-form-field appearance="fill">
        <mat-label>Number of Notifications to Send</mat-label>
        <input matInput type="number" [(ngModel)]="numRequests" name="numRequests" min="1" required />
      </mat-form-field>

      <button mat-raised-button color="accent" (click)="sendNotifications()" [disabled]="sending">
        Send Notifications
      </button>

      <h3>Results</h3>
      <mat-list>
        <mat-list-item *ngFor="let r of results">
          {{ r }}
        </mat-list-item>
      </mat-list>
    </div>
  `,
  styles: [`
    .user-form {
      display: flex;
      gap: 16px;
      max-width: 400px;
      align-items: center;
      margin-bottom: 24px;
    }
    mat-list-item {
      word-break: break-word;
    }
  `]
})
export class UserComponent {
  clientId: string = '';
  clientLimit: ClientLimit | null = null;
  numRequests: number = 1;
  results: string[] = [];
  sending = false;

  constructor(private api: ApiService, private ngZone: NgZone) {}

  loadClientLimit() {
    this.api.getLimit(this.clientId).subscribe({
      next: (limit) => this.ngZone.run(() => {
        this.clientLimit = limit;
        this.results = [];
      }),
      error: (err) => console.error('Failed to load client limit', err)
    });
  }


async sendNotifications() {
  if (!this.clientId || this.numRequests < 1) return;
  this.sending = true;
  this.results = [];

  for (let i = 0; i < this.numRequests; i++) {
    try {
      const res = await this.api.sendNotification(this.clientId).toPromise();
      this.ngZone.run(() => {
        if (res) {
          this.results.push(
            `Request ${i + 1}: ${res.message} | Remaining: ${res.remaining}`
          );
        } else {
          this.results.push(`Request ${i + 1}: Unknown response | Remaining: N/A`);
        }
      });
    } catch (err: any) {
      this.ngZone.run(() => {
        const msg = err?.error || err?.statusText || 'Unknown error';
        const remaining = err?.headers?.get('X-Rate-Limit-Remaining') ?? 'N/A';
        this.results.push(`Request ${i + 1} Error: ${msg} | Remaining: ${remaining}`);
      });
      break; // stop sending if quota exhausted
    }
  }

  this.sending = false;
}

}
