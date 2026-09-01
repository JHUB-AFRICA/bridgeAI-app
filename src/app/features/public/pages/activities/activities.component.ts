// ============================================================
// BRIDGE-AI Kenya - Activities Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../../../services/activity.service';
import { Activity } from '../../../core/models/activity.model';
import { ActivityCardComponent } from '../../../shared/components/activity-card/activity-card.component';
import { FilterBarComponent, FilterOption } from '../../../shared/components/filter-bar/filter-bar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { WORK_PACKAGES } from '../../../core/constants/wp-constants';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    CommonModule,
    ActivityCardComponent,
    FilterBarComponent,
    PaginationComponent
  ],
  template: `
    <div class="activities-page">
      <div class="container">
        <h1 class="page-title">Activities</h1>

        <app-filter-bar
          [filters]="filters"
          [selected]="selectedFilters"
          [resultCount]="filteredActivities().length"
          (filterChange)="onFilterChange($event)"
          (clearFiltersEvent)="onClearFilters()"
        ></app-filter-bar>

        <div class="activities-grid">
          <app-activity-card
            *ngFor="let activity of paginatedActivities()"
            [activity]="activity"
          ></app-activity-card>
        </div>

        <div *ngIf="filteredActivities().length === 0" class="empty-state">
          <p>No activities found matching your criteria.</p>
        </div>

        <app-pagination
          [totalItems]="filteredActivities().length"
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
  styles: [`
    .activities-page {
      padding: 48px 0 64px 0;
      background: #f8fafc;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 24px 0;
    }

    .activities-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 24px;
    }

    .empty-state {
      text-align: center;
      padding: 48px 0;
      color: #6b7280;
    }

    @media (max-width: 1024px) {
      .activities-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .activities-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ActivitiesComponent implements OnInit {
  protected allActivities = signal<Activity[]>([]);
  protected filteredActivities = signal<Activity[]>([]);
  protected paginatedActivities = signal<Activity[]>([]);

  protected currentPage: number = 1;
  protected pageSize: number = 6;
  protected selectedFilters: Record<string, string> = {};

  protected filters: { key: string; label: string; options: FilterOption[] }[] = [
    {
      key: 'wp',
      label: 'Work Package',
      options: WORK_PACKAGES.map(wp => ({ value: wp.id, label: wp.name }))
    },
    {
      key: 'type',
      label: 'Activity Type',
      options: []
    },
    {
      key: 'audience',
      label: 'Audience',
      options: []
    },
    {
      key: 'year',
      label: 'Year',
      options: []
    }
  ];

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  private loadActivities(): void {
    this.activityService.getActivities().subscribe({
      next: (activities) => {
        const published = activities.filter(a => a.evidence_status === 'published');
        this.allActivities.set(published);
        this.updateFilterOptions(published);
        this.applyFilters();
      },
      error: () => {
        this.allActivities.set([]);
        this.filteredActivities.set([]);
      }
    });
  }

  private updateFilterOptions(activities: Activity[]): void {
    const types = [...new Set(activities.map(a => a.activity_type).filter(Boolean))];
    const audiences = [...new Set(activities.map(a => a.audience).filter(Boolean))];
    const years = [...new Set(activities.map(a => a.date ? a.date.substring(0, 4) : '').filter(Boolean))];

    this.filters = this.filters.map(filter => {
      if (filter.key === 'type') {
        return { ...filter, options: types.map(t => ({ value: t, label: t })) };
      }
      if (filter.key === 'audience') {
        return { ...filter, options: audiences.map(a => ({ value: a, label: a })) };
      }
      if (filter.key === 'year') {
        return { ...filter, options: years.sort().reverse().map(y => ({ value: y, label: y })) };
      }
      return filter;
    });
  }

  protected onFilterChange(filters: Record<string, string>): void {
    this.selectedFilters = filters;
    this.currentPage = 1;
    this.applyFilters();
  }

  protected onClearFilters(): void {
    this.selectedFilters = {};
    this.currentPage = 1;
    this.applyFilters();
  }

  protected onPageChange(event: { page: number; size: number }): void {
    this.currentPage = event.page;
    this.pageSize = event.size;
    this.updatePagination();
  }

  private applyFilters(): void {
    let filtered = [...this.allActivities()];

    if (this.selectedFilters['wp']) {
      filtered = filtered.filter(a => a.wp_tag === this.selectedFilters['wp']);
    }

    if (this.selectedFilters['type']) {
      filtered = filtered.filter(a => a.activity_type === this.selectedFilters['type']);
    }

    if (this.selectedFilters['audience']) {
      filtered = filtered.filter(a => a.audience === this.selectedFilters['audience']);
    }

    if (this.selectedFilters['year']) {
      filtered = filtered.filter(a => a.date && a.date.startsWith(this.selectedFilters['year']));
    }

    filtered.sort((a, b) => (a.date > b.date ? -1 : 1));
    this.filteredActivities.set(filtered);
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginated = this.filteredActivities().slice(start, end);
    this.paginatedActivities.set(paginated);
  }
}