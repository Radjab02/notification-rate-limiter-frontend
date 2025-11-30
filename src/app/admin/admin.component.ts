// src/app/admin/admin.component.ts
import { Component, OnInit, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ClientLimit } from '../services/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
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
    <h2>Admin - Manage Limits</h2>

    <form (ngSubmit)="addLimit()" class="admin-form">
      <mat-form-field appearance="fill">
        <mat-label>Client ID</mat-label>
        <input matInput [(ngModel)]="newLimit.clientId" name="clientId" required />
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Monthly Limit</mat-label>
        <input matInput type="number" [(ngModel)]="newLimit.monthlyLimit" name="monthlyLimit" required />
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Window Capacity</mat-label>
        <input matInput type="number" [(ngModel)]="newLimit.windowCapacity" name="windowCapacity" required />
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Window Duration (seconds)</mat-label>
        <input matInput type="number" [(ngModel)]="newLimit.windowDurationSeconds" name="windowDurationSeconds" required />
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit">Add / Update Limit</button>
    </form>

    <h3>Existing Limits</h3>
    <mat-list>
      <mat-list-item *ngFor="let limit of limits">
        {{ limit.clientId }} - Monthly: {{ limit.monthlyLimit }}, Window: {{ limit.windowCapacity }}/{{ limit.windowDurationSeconds }}s
        <button mat-icon-button color="warn" (click)="deleteLimit(limit.clientId)">
          <span class="material-icons">delete</span>
        </button>
      </mat-list-item>
    </mat-list>
  `,
  styles: [`
    .admin-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
    }
    mat-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class AdminComponent implements OnInit {
  limits: ClientLimit[] = [];
  newLimit: ClientLimit = { clientId: '', monthlyLimit: 0, windowCapacity: 0, windowDurationSeconds: 0 };

  constructor(private api: ApiService, private ngZone: NgZone) {}

  ngOnInit() {
    this.loadLimits();
  }

  loadLimits() {
    this.api.getLimits().subscribe({
      next: (res) => this.ngZone.run(() => { this.limits = res; }),
      error: (err) => console.error('Failed to load limits', err)
    });
  }

  addLimit() {
    this.api.createLimit(this.newLimit).subscribe({
      next: (savedLimit) => {
        this.limits.push(savedLimit);
        this.newLimit = { clientId: '', monthlyLimit: 0, windowCapacity: 0, windowDurationSeconds: 0 };
        setTimeout(() => this.loadLimits(), 100); // refresh from backend
      },
      error: (err) => console.error('Failed to add limit', err)
    });
  }
  
  deleteLimit(clientId: string) {
    this.api.deleteLimit(clientId).subscribe({
      next: () => this.loadLimits(),
      error: (err) => console.error('Failed to delete limit', err)
    });
  }
}
