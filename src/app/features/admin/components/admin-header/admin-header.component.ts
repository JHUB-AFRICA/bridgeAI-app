import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
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

      <a [routerLink]="['/admin']" class="center-brand" aria-label="BRIDGE-AI dashboard">
        <img src="/images/logos/bridge_ai_logo.svg" alt="BRIDGE-AI" />
      </a>

      <div class="header-right">
        <a
          [routerLink]="['/']"
          target="_blank"
          rel="noopener noreferrer"
          class="home-link"
          aria-label="Open public home page in a new tab"
          title="Open public home page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" aria-hidden="true">
            <path d="M3 11.5 12 4l9 7.5" />
            <path d="M5 10v10h14V10" />
            <path d="M9 20v-6h6v6" />
          </svg>
          <span>View site</span>
        </a>
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
    .center-brand { position: absolute; left: 50%; top: 50%; display: flex; align-items: center; transform: translate(-50%, -50%); }
    .center-brand img { width: 116px; height: 40px; object-fit: contain; }
    .toggle-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: none; background: none; border-radius: 8px; color: #6b7280; cursor: pointer; transition: background 0.2s; }
    .toggle-btn:hover { background: #f3f4f6; }
    .brand { display: flex; align-items: center; gap: 8px; text-decoration: none; }
    .brand-name { font-size: 18px; font-weight: 700; color: #1f2937; }
    .brand-role { font-size: 12px; font-weight: 500; color: #3b82f6; background: #eff6ff; padding: 2px 10px; border-radius: 12px; }
    .header-right { display: flex; align-items: center; gap: 16px; }
    .home-link { display: inline-flex; align-items: center; gap: 7px; color: #2563eb; font-size: 13px; font-weight: 600; text-decoration: none; }
    .home-link:hover { color: #1d4ed8; }
    .home-link:focus-visible { outline: 3px solid rgba(59, 130, 246, 0.35); outline-offset: 3px; border-radius: 4px; }
    .logout-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: none; background: none; border-radius: 8px; color: #ef4444; cursor: pointer; transition: background 0.2s; }
    .logout-btn:hover { background: #fef2f2; }
    @media (max-width: 768px) { .admin-header { padding: 0 12px; } .brand-name { font-size: 16px; } .center-brand img { width: 96px; } }
    @media (max-width: 480px) { .home-link span { display: none; } .center-brand img { width: 82px; } }
  `]
})
export class AdminHeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  protected appName = APP.ACRONYM;

  constructor(private authService: AuthService) {}

  toggle(): void {
    this.toggleSidebar.emit();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}