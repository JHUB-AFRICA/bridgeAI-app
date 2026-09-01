// ============================================================
// BRIDGE-AI Kenya - Admin Sidebar Component
// ============================================================

import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export interface AdminNavItem {
  path: string;
  label: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="admin-sidebar" [class.collapsed]="collapsed">
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li *ngFor="let item of navItems()" class="nav-item">
            <a
              [routerLink]="['/admin', item.path]"
              routerLinkActive="active"
              class="nav-link"
              [class.active]="isActive(item.path)"
              [title]="collapsed ? item.label : ''"
            >
              <span class="nav-icon" [innerHTML]="item.icon"></span>
              <span *ngIf="!collapsed" class="nav-label">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button (click)="logout()" class="logout-btn" [title]="collapsed ? 'Logout' : ''">
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span *ngIf="!collapsed" class="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .admin-sidebar {
      position: fixed;
      top: 64px;
      left: 0;
      bottom: 0;
      width: 250px;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      z-index: 40;
      overflow: hidden;
    }

    .admin-sidebar.collapsed {
      width: 64px;
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      overflow-y: auto;
    }

    .nav-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-item {
      margin-bottom: 2px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #4b5563;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .nav-link:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .nav-link.active {
      background: #eff6ff;
      color: #3b82f6;
    }

    .nav-link.active .nav-icon svg {
      stroke: #3b82f6;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .nav-icon svg {
      width: 20px;
      height: 20px;
      stroke: #6b7280;
    }

    .nav-link.active .nav-icon svg {
      stroke: #3b82f6;
    }

    .nav-label {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .admin-sidebar.collapsed .nav-label {
      display: none;
    }

    .admin-sidebar.collapsed .nav-link {
      justify-content: center;
      padding: 10px;
    }

    .sidebar-footer {
      padding: 12px 8px;
      border-top: 1px solid #f3f4f6;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      background: none;
      border-radius: 8px;
      color: #ef4444;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: #fef2f2;
    }

    .logout-btn .nav-icon svg {
      stroke: #ef4444;
    }

    .admin-sidebar.collapsed .logout-btn {
      justify-content: center;
      padding: 10px;
    }

    .admin-sidebar.collapsed .logout-btn .nav-label {
      display: none;
    }

    @media (max-width: 768px) {
      .admin-sidebar {
        transform: translateX(-100%);
        width: 280px;
        transition: transform 0.3s ease;
      }

      .admin-sidebar.mobile-open {
        transform: translateX(0);
      }

      .admin-sidebar.collapsed {
        width: 280px;
      }

      .admin-sidebar.collapsed .nav-label {
        display: inline;
      }

      .admin-sidebar.collapsed .nav-link {
        justify-content: flex-start;
        padding: 10px 12px;
      }

      .admin-sidebar.collapsed .logout-btn {
        justify-content: flex-start;
        padding: 10px 12px;
      }

      .admin-sidebar.collapsed .logout-btn .nav-label {
        display: inline;
      }
    }
  `]
})
export class AdminSidebarComponent {
  @Input() collapsed: boolean = false;

  protected navItems = signal<AdminNavItem[]>([
    { path: '', label: 'Dashboard', icon: this.getDashboardIcon(), active: false },
    { path: 'activities', label: 'Activities', icon: this.getActivityIcon(), active: false },
    { path: 'events', label: 'Events', icon: this.getEventIcon(), active: false },
    { path: 'resources', label: 'Resources', icon: this.getResourceIcon(), active: false },
    { path: 'partners', label: 'Partners', icon: this.getPartnerIcon(), active: false },
    { path: 'team', label: 'Team', icon: this.getTeamIcon(), active: false },
    { path: 'gallery', label: 'Gallery', icon: this.getGalleryIcon(), active: false },
    { path: 'faqs', label: 'FAQs', icon: this.getFaqIcon(), active: false },
    { path: 'training-materials', label: 'Training Materials', icon: this.getTrainingIcon(), active: false },
    { path: 'sme', label: 'SME', icon: this.getSmeIcon(), active: false },
    { path: 'community', label: 'Community', icon: this.getCommunityIcon(), active: false },
    { path: 'replication', label: 'Replication', icon: this.getReplicationIcon(), active: false },
    { path: 'submissions', label: 'Submissions', icon: this.getSubmissionsIcon(), active: false }
  ]);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  getDashboardIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`;
  }

  getActivityIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
  }

  getEventIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
  }

  getResourceIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;
  }

  getPartnerIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  }

  getTeamIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
  }

  getGalleryIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
  }

  getFaqIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  }

  getTrainingIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`;
  }

  getSmeIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`;
  }

  getCommunityIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  }

  getReplicationIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>`;
  }

  getSubmissionsIcon(): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
  }

  isActive(path: string): boolean {
    const currentUrl = this.router.url;
    if (path === '') {
      return currentUrl === '/admin' || currentUrl === '/admin/';
    }
    return currentUrl.includes(`/admin/${path}`);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}