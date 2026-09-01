// ============================================================
// BRIDGE-AI Kenya - Pagination Component
// ============================================================

import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pagination">
      <div class="pagination-info">
        Showing {{ startItem }} - {{ endItem }} of {{ totalItems }} items
      </div>

      <div class="pagination-controls">
        <button
          (click)="goToPage(1)"
          [disabled]="currentPage === 1"
          class="page-btn"
          aria-label="First page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </svg>
        </button>

        <button
          (click)="goToPage(currentPage - 1)"
          [disabled]="currentPage === 1"
          class="page-btn"
          aria-label="Previous page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          *ngFor="let page of visiblePages"
          (click)="goToPage(page)"
          class="page-btn"
          [class.active]="page === currentPage"
          [class.ellipsis]="page === -1"
          [disabled]="page === -1"
        >
          <span *ngIf="page !== -1">{{ page }}</span>
          <span *ngIf="page === -1">...</span>
        </button>

        <button
          (click)="goToPage(currentPage + 1)"
          [disabled]="currentPage === totalPages"
          class="page-btn"
          aria-label="Next page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <button
          (click)="goToPage(totalPages)"
          [disabled]="currentPage === totalPages"
          class="page-btn"
          aria-label="Last page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
        </button>

        <div class="page-size-wrapper">
          <label class="page-size-label">Show</label>
          <select [(ngModel)]="pageSize" (change)="onPageSizeChange()" class="page-size-select">
            <option *ngFor="let size of pageSizeOptions" [value]="size">{{ size }}</option>
          </select>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      flex-wrap: wrap;
      gap: 12px;
    }

    .pagination-info {
      font-size: 14px;
      color: #6b7280;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .page-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 40px;
      padding: 0 8px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #ffffff;
      color: #374151;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .page-btn:hover:not(:disabled):not(.active):not(.ellipsis) {
      background: #f3f4f6;
      border-color: #d1d5db;
    }

    .page-btn.active {
      background: #3b82f6;
      border-color: #3b82f6;
      color: #ffffff;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-btn.ellipsis {
      border: none;
      background: none;
      cursor: default;
      pointer-events: none;
      color: #9ca3af;
    }

    .page-size-wrapper {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: 8px;
    }

    .page-size-label {
      font-size: 13px;
      color: #6b7280;
    }

    .page-size-select {
      padding: 6px 10px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: #ffffff;
      font-size: 13px;
      color: #1f2937;
      cursor: pointer;
    }

    .page-size-select:focus {
      outline: none;
      border-color: #3b82f6;
    }

    @media (max-width: 768px) {
      .pagination {
        flex-direction: column;
        align-items: stretch;
      }

      .pagination-info {
        text-align: center;
      }

      .pagination-controls {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .page-btn {
        min-width: 32px;
        height: 32px;
        font-size: 12px;
        padding: 0 4px;
      }

      .page-size-wrapper {
        margin-left: 4px;
      }
    }
  `]
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];

  @Output() pageChange = new EventEmitter<{ page: number; size: number }>();

  totalPages: number = 1;
  visiblePages: number[] = [];
  protected startItem: number = 0;
  protected endItem: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePagination();
  }

  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;

    this.startItem = (this.currentPage - 1) * this.pageSize + 1;
    this.endItem = Math.min(this.currentPage * this.pageSize, this.totalItems);

    this.visiblePages = this.getVisiblePages();
  }

  private getVisiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: number[] = [];
    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);

    if (current - delta > 1) {
      pages.push(1);
      if (current - delta > 2) {
        pages.push(-1);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current + delta < total) {
      if (current + delta < total - 1) {
        pages.push(-1);
      }
      pages.push(total);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.emitPageChange();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.emitPageChange();
  }

  private emitPageChange(): void {
    this.calculatePagination();
    this.pageChange.emit({ page: this.currentPage, size: this.pageSize });
  }
}