// ============================================================
// BRIDGE-AI Kenya - Admin Layout Component
// ============================================================

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    AdminSidebarComponent,
    AdminHeaderComponent
  ],
  template: `
    <div class="admin-layout">
      <app-admin-header (toggleSidebar)="toggleSidebar()"></app-admin-header>
      <div class="admin-body">
        <app-admin-sidebar [collapsed]="sidebarCollapsed()"></app-admin-sidebar>
        <main class="admin-main" [class.expanded]="sidebarCollapsed()">
          <div class="admin-content">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f1f5f9;
    }

    .admin-body {
      display: flex;
      flex: 1;
      margin-top: 64px;
    }

    .admin-main {
      flex: 1;
      margin-left: 250px;
      transition: margin-left 0.3s ease;
      padding: 24px;
      min-height: calc(100vh - 64px);
    }

    .admin-main.expanded {
      margin-left: 64px;
    }

    .admin-content {
      max-width: 1400px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .admin-main {
        margin-left: 0;
        padding: 16px;
      }

      .admin-main.expanded {
        margin-left: 0;
      }
    }
  `]
})
export class AdminLayoutComponent {
  protected sidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.sidebarCollapsed.update(value => !value);
  }
}