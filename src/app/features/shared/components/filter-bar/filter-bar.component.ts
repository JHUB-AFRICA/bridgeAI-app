// ============================================================
// BRIDGE-AI Kenya - Filter Bar Component
// ============================================================

import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterState {
  [key: string]: string;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-bar">
      <div class="filter-group" *ngFor="let filter of filters">
        <label class="filter-label">{{ filter.label }}</label>
        <select
          [name]="filter.key"
          [(ngModel)]="selected[filter.key]"
          (change)="onFilterChange()"
          class="filter-select"
        >
          <option value="">All {{ filter.label }}</option>
          <option *ngFor="let option of filter.options" [value]="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="filter-actions">
        <button (click)="clearFilters()" class="clear-btn" *ngIf="hasActiveFilters()">
          Clear Filters
        </button>
        <span class="result-count">{{ resultCount }} results</span>
      </div>
    </div>
  `,
  styles: [`
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 16px;
      padding: 16px 20px;
      background: #f9fafb;
      border-radius: 12px;
      border: 1px solid #f3f4f6;
      margin-bottom: 20px;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 140px;
      flex: 1;
    }

    .filter-label {
      font-size: 12px;
      font-weight: 500;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: #ffffff;
      font-size: 14px;
      color: #1f2937;
      transition: border-color 0.2s;
      width: 100%;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
    }

    .filter-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filter-select option {
      color: #1f2937;
    }

    .filter-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-top: 20px;
    }

    .clear-btn {
      padding: 6px 16px;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 12px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;
    }

    .clear-btn:hover {
      background: #e5e7eb;
      color: #1f2937;
    }

    .result-count {
      font-size: 13px;
      color: #6b7280;
    }

    @media (max-width: 640px) {
      .filter-bar {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

      .filter-group {
        min-width: unset;
      }

      .filter-actions {
        padding-top: 0;
        justify-content: space-between;
      }
    }
  `]
})
export class FilterBarComponent implements OnChanges {
  @Input() filters: { key: string; label: string; options: FilterOption[] }[] = [];
  @Input() selected: FilterState = {};
  @Input() resultCount: number = 0;

  @Output() filterChange = new EventEmitter<FilterState>();
  @Output() clearFiltersEvent = new EventEmitter<void>();

  protected selectedState: FilterState = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected']) {
      this.selectedState = { ...this.selected };
    }
  }

  onFilterChange(): void {
    const activeFilters: FilterState = {};
    for (const [key, value] of Object.entries(this.selectedState)) {
      if (value && value !== '') {
        activeFilters[key] = value;
      }
    }
    this.filterChange.emit(activeFilters);
  }

  clearFilters(): void {
    this.selectedState = {};
    this.filterChange.emit({});
    this.clearFiltersEvent.emit();
  }

  hasActiveFilters(): boolean {
    for (const value of Object.values(this.selectedState)) {
      if (value && value !== '') {
        return true;
      }
    }
    return false;
  }
}