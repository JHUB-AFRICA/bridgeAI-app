// ============================================================
// BRIDGE-AI Kenya - Admin Layout Component
// ============================================================

import { Component, Injectable, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Injectable({ providedIn: 'root' })
export class AdminDetailsModalService {
  readonly item = signal<Record<string, unknown> | null>(null);

  open(item: unknown): void {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      this.item.set(item as Record<string, unknown>);
    }
  }

  close(): void {
    this.item.set(null);
  }
}

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
      @if (detailsModal.item(); as item) {
        <div class="details-overlay" role="presentation" (click)="detailsModal.close()">
          <section class="details-modal" role="dialog" aria-modal="true" aria-labelledby="details-title" (click)="$event.stopPropagation()">
            <header class="details-header">
              <h2 id="details-title">Details</h2>
              <button type="button" class="details-close" aria-label="Close details" (click)="detailsModal.close()"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
            </header>
            <dl class="details-body">
              @for (entry of detailsEntries(item); track entry[0]) {
                <div class="detail-row"><dt>{{ formatDetailLabel(entry[0]) }}</dt><dd>{{ formatDetailValue(entry[1]) }}</dd></div>
              }
            </dl>
          </section>
        </div>
      }
      <div class="admin-body">
        @if (mobileSidebarOpen()) {
          <button class="sidebar-backdrop" type="button" aria-label="Close navigation" (click)="closeMobileSidebar()"></button>
        }
        <app-admin-sidebar
          [collapsed]="sidebarCollapsed()"
          [mobileOpen]="mobileSidebarOpen()"
          (navigationSelected)="closeMobileSidebar()"
        ></app-admin-sidebar>
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
      position: relative;
      display: flex;
      flex: 1;
      margin-top: 64px;
    }

    .admin-main {
      flex: 1;
      min-width: 0;
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

    .sidebar-backdrop {
      display: none;
    }

    .details-overlay { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 24px; background: rgba(15, 23, 42, .55); }
    .details-modal { display: flex; flex-direction: column; width: min(680px, 100%); max-height: min(720px, calc(100vh - 48px)); overflow: hidden; background: #fff; border-radius: 12px; box-shadow: 0 24px 70px rgba(15, 23, 42, .28); }
    .details-header { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; padding: 18px 22px; border-bottom: 1px solid #e5e7eb; }
    .details-header h2 { margin: 0; color: #111827; font-size: 18px; }
    .details-close { display: grid; place-items: center; width: 36px; height: 36px; border: 0; border-radius: 6px; background: #f3f4f6; color: #4b5563; cursor: pointer; }
    .details-body { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; overflow-y: auto; margin: 0; padding: 16px 22px 22px; background: #e5e7eb; }
    .detail-row { min-width: 0; padding: 12px; background: #fff; }
    dt { margin-bottom: 5px; color: #6b7280; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
    dd { margin: 0; color: #1f2937; font-size: 14px; line-height: 1.5; overflow-wrap: anywhere; white-space: pre-wrap; }

    @media (max-width: 768px) {
      .sidebar-backdrop {
        position: fixed;
        inset: 64px 0 0;
        display: block;
        width: 100%;
        border: 0;
        background: rgba(15, 23, 42, 0.42);
        cursor: pointer;
        z-index: 35;
      }

      .admin-main {
        margin-left: 0;
        padding: 16px;
      }

      .admin-main.expanded {
        margin-left: 0;
      }

      .details-overlay { padding: 12px; }
      .details-modal { max-height: calc(100vh - 24px); }
      .details-header { padding: 15px 16px; }
      .details-body { grid-template-columns: 1fr; padding: 12px 16px 16px; }
    }
  `]
})
export class AdminLayoutComponent {
  protected sidebarCollapsed = signal(false);
  protected mobileSidebarOpen = signal(false);
  protected detailsModal = inject(AdminDetailsModalService);

  toggleSidebar(): void {
    if (window.matchMedia('(max-width: 768px)').matches) {
      this.mobileSidebarOpen.update(value => !value);
      return;
    }

    this.sidebarCollapsed.update(value => !value);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  detailsEntries(item: Record<string, unknown>): [string, unknown][] {
    return Object.entries(item);
  }

  formatDetailLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, character => character.toUpperCase());
  }

  formatDetailValue(value: unknown): string {
    return value === null || value === undefined || value === '' ? 'Not provided' : typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
  }
}