import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { APP } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="admin-header">
      <div class="header-left">
        <button class="toggle-btn" (click)="toggle()" aria-label="Toggle sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <a [routerLink]="['/admin']" class="brand">
          <span class="brand-name">{{ appName }}</span>
          <span class="brand-role">Admin</span>
        </a>
      </div>

      <div class="header-right">
        <div class="user-info">
          <span class="user-name">{{ currentUser?.display_name || currentUser?.username }}</span>
          <span class="user-role">{{ currentUser?.role | titlecase }}</span>
        </div>
        <button class="logout-btn" (click)="logout()" title="Logout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .admin-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .header-left { display: flex; align-items: center; gap: 16px; }
    .toggle-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: none; background: none; border-radius: 8px; color: #6b7280; cursor: pointer; transition: background 0.2s; }
    .toggle-btn:hover { background: #f3f4f6; }
    .brand { display: flex; align-items: center; gap: 8px; text-decoration: none; }
    .brand-name { font-size: 18px; font-weight: 700; color: #1f2937; }
    .brand-role { font-size: 12px; font-weight: 500; color: #3b82f6; background: #eff6ff; padding: 2px 10px; border-radius: 12px; }
    .header-right { display: flex; align-items: center; gap: 16px; }
    .user-info { text-align: right; }
    .user-name { display: block; font-size: 14px; font-weight: 600; color: #1f2937; }
    .user-role { font-size: 12px; color: #6b7280; }
    .logout-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: none; background: none; border-radius: 8px; color: #ef4444; cursor: pointer; transition: background 0.2s; }
    .logout-btn:hover { background: #fef2f2; }
    @media (max-width: 768px) { .admin-header { padding: 0 12px; } .brand-name { font-size: 16px; } .user-name { font-size: 13px; } .user-role { font-size: 11px; } }
    @media (max-width: 480px) { .user-info { display: none; } }
  `]
})
export class AdminHeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  protected appName = APP.ACRONYM;
  protected currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  toggle(): void {
    this.toggleSidebar.emit();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}