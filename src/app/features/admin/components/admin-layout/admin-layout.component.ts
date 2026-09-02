// ============================================================
// BRIDGE-AI Kenya - Admin Layout Component
// ============================================================

import { AfterViewInit, Component, Injectable, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
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
            <section class="table-tools" aria-label="Table filters">
              <label class="search-control">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                <input [(ngModel)]="tableSearch" (ngModelChange)="applyTableControls()" type="search" placeholder="Search this page" aria-label="Search this page" />
              </label>
              <label class="filter-control">
                <span>Field</span>
                <select [(ngModel)]="tableFilterColumn" (ngModelChange)="onFilterColumnChange()" aria-label="Choose filter field">
                  <option value="">No filter</option>
                  @for (column of tableColumns(); track column) {
                    <option [value]="column">{{ column }}</option>
                  }
                </select>
              </label>
              <label class="filter-control">
                <span>Value</span>
                <select [(ngModel)]="tableFilterValue" (ngModelChange)="applyTableControls()" aria-label="Choose filter value">
                  <option value="all">All values</option>
                  @for (value of tableFilterValues(); track value) {
                    <option [value]="value">{{ value }}</option>
                  }
                </select>
              </label>
              <button type="button" class="clear-tools" (click)="resetTableControls()" [disabled]="!hasTableControls()">Clear</button>
            </section>
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
      min-width: 0;
    }

    .table-tools { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; }
    .search-control { display: flex; align-items: center; gap: 8px; flex: 1 1 220px; min-width: 180px; padding: 8px 11px; border: 1px solid #d1d5db; border-radius: 7px; color: #6b7280; }
    .search-control input { min-width: 0; width: 100%; border: 0; outline: 0; color: #1f2937; background: transparent; font: inherit; }
    .filter-control { display: flex; align-items: center; gap: 7px; color: #6b7280; font-size: 12px; font-weight: 600; }
    .filter-control select { padding: 8px 28px 8px 9px; border: 1px solid #d1d5db; border-radius: 7px; color: #374151; background: #fff; font: inherit; }
    .clear-tools { min-height: 36px; padding: 0 12px; border: 1px solid #d1d5db; border-radius: 7px; background: #fff; color: #374151; font-size: 13px; font-weight: 600; cursor: pointer; }
    .clear-tools:hover:not(:disabled) { background: #f3f4f6; }
    .clear-tools:disabled { cursor: not-allowed; opacity: .5; }

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

      .table-tools {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        justify-items: center;
        gap: 10px;
        padding: 14px;
      }

      .search-control,
      .filter-control {
        width: min(100%, 360px);
      }

      .filter-control {
        justify-content: space-between;
      }

      .filter-control select {
        min-width: 0;
        flex: 1;
        max-width: 230px;
      }

      .clear-tools {
        min-width: 100px;
      }

      .details-overlay { padding: 12px; }
      .details-modal { max-height: calc(100vh - 24px); }
      .details-header { padding: 15px 16px; }
      .details-body { grid-template-columns: 1fr; padding: 12px 16px 16px; }
    }
  `]
})
export class AdminLayoutComponent implements AfterViewInit, OnDestroy {
  protected sidebarCollapsed = signal(false);
  protected mobileSidebarOpen = signal(false);
  protected detailsModal = inject(AdminDetailsModalService);
  protected tableSearch = '';
  protected tableColumns = signal<string[]>([]);
  protected tableFilterValues = signal<string[]>([]);
  protected tableFilterColumn = '';
  protected tableFilterValue = 'all';
  private document = inject(DOCUMENT);
  private tableObserver?: MutationObserver;
  private updatingTables = false;

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

  ngAfterViewInit(): void {
    const content = this.document.querySelector('.admin-content');
    if (!content) return;
    this.tableObserver = new MutationObserver(() => {
      if (!this.updatingTables) {
        this.refreshTableMetadata();
        this.applyTableControls();
      }
    });
    this.tableObserver.observe(content, { childList: true, subtree: true });
    this.refreshTableMetadata();
    this.applyTableControls();
  }

  ngOnDestroy(): void {
    this.tableObserver?.disconnect();
  }

  applyTableControls(): void {
    if (this.updatingTables) return;
    this.updatingTables = true;
    const rows = Array.from(this.document.querySelectorAll<HTMLTableRowElement>('.admin-content .data-table tbody tr'));
    const search = this.tableSearch.trim().toLowerCase();
    rows.forEach(row => {
      const text = row.textContent?.toLowerCase() ?? '';
      const isEmpty = row.classList.contains('empty-state') || text.includes('no ') && text.includes(' found');
      const filterMatch = this.matchesTableFilter(row);
      row.hidden = isEmpty || (!!search && !text.includes(search)) || !filterMatch;
    });

    this.updatingTables = false;
  }

  private matchesTableFilter(row: HTMLTableRowElement): boolean {
    if (!this.tableFilterColumn || this.tableFilterValue === 'all') return true;
    const table = row.closest('table');
    if (!table) return true;
    const index = this.columnIndex(table, this.tableFilterColumn);
    return index < 0 || row.cells[index]?.textContent?.trim() === this.tableFilterValue;
  }

  private columnIndex(table: HTMLTableElement, column: string): number {
    return Array.from(table.tHead?.rows[0]?.cells ?? []).findIndex(cell => cell.textContent?.trim() === column);
  }

  private refreshTableMetadata(): void {
    const tables = Array.from(this.document.querySelectorAll<HTMLTableElement>('.admin-content .data-table'));
    const columns = new Set<string>();
    tables.forEach(table => Array.from(table.tHead?.rows[0]?.cells ?? []).forEach(cell => {
      const column = cell.textContent?.trim() ?? '';
      if (column && column !== 'Actions') columns.add(column);
    }));
    this.tableColumns.set([...columns]);
    if (this.tableFilterColumn && !columns.has(this.tableFilterColumn)) this.tableFilterColumn = '';
    const values = new Set<string>();
    tables.forEach(table => {
      const index = this.columnIndex(table, this.tableFilterColumn);
      if (index >= 0) Array.from(table.tBodies[0]?.rows ?? []).forEach(row => {
        const value = row.cells[index]?.textContent?.trim();
        if (value) values.add(value);
      });
    });
    this.tableFilterValues.set([...values].sort());
    if (this.tableFilterValue !== 'all' && !values.has(this.tableFilterValue)) this.tableFilterValue = 'all';
  }

  onFilterColumnChange(): void {
    this.tableFilterValue = 'all';
    this.refreshTableMetadata();
    this.applyTableControls();
  }

  hasTableControls(): boolean {
    return !!this.tableSearch || !!this.tableFilterColumn || this.tableFilterValue !== 'all';
  }

  resetTableControls(): void {
    this.tableSearch = '';
    this.tableFilterColumn = '';
    this.tableFilterValue = 'all';
    this.applyTableControls();
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