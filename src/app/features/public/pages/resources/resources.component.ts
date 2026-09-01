// ============================================================
// BRIDGE-AI Kenya - Resources Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResourceService } from '../../../../services/resource.service';
import { Resource } from '../../../core/models/resource.model';
import { ResourceCardComponent } from '../../../shared/components/resource-card/resource-card.component';
import { FilterBarComponent, FilterOption } from '../../../shared/components/filter-bar/filter-bar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { WORK_PACKAGES } from '../../../core/constants/wp-constants';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ResourceCardComponent,
    FilterBarComponent,
    PaginationComponent
  ],
  template: `
    <div class="resources-page">
      <div class="container">
        <h1 class="page-title">Resources</h1>

        <app-filter-bar
          [filters]="filters"
          [selected]="selectedFilters"
          [resultCount]="filteredResources().length"
          (filterChange)="onFilterChange($event)"
          (clearFiltersEvent)="onClearFilters()"
        ></app-filter-bar>

        <div class="resources-list">
          <app-resource-card
            *ngFor="let resource of paginatedResources()"
            [resource]="resource"
          ></app-resource-card>
        </div>

        <div *ngIf="filteredResources().length === 0" class="empty-state">
          <p>No resources found matching your criteria.</p>
        </div>

        <app-pagination
          [totalItems]="filteredResources().length"
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
  styles: [`
    .resources-page {
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

    .resources-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 24px;
    }

    .empty-state {
      text-align: center;
      padding: 48px 0;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }
    }
  `]
})
export class ResourcesComponent implements OnInit {
  protected allResources = signal<Resource[]>([]);
  protected filteredResources = signal<Resource[]>([]);
  protected paginatedResources = signal<Resource[]>([]);

  protected currentPage: number = 1;
  protected pageSize: number = 10;
  protected selectedFilters: Record<string, string> = {};

  protected filters: { key: string; label: string; options: FilterOption[] }[] = [
    {
      key: 'wp',
      label: 'Work Package',
      options: WORK_PACKAGES.map(wp => ({ value: wp.id, label: wp.name }))
    },
    {
      key: 'type',
      label: 'Resource Type',
      options: []
    },
    {
      key: 'language',
      label: 'Language',
      options: [
        { value: 'English', label: 'English' },
        { value: 'French', label: 'French' },
        { value: 'Arabic', label: 'Arabic' }
      ]
    }
  ];

  constructor(private resourceService: ResourceService) {}

  ngOnInit(): void {
    this.loadResources();
  }

  private loadResources(): void {
    this.resourceService.getResources().subscribe({
      next: (resources) => {
        const publicResources = resources.filter(r => r.is_public);
        this.allResources.set(publicResources);
        this.updateFilterOptions(publicResources);
        this.applyFilters();
      },
      error: () => {
        this.allResources.set([]);
        this.filteredResources.set([]);
      }
    });
  }

  private updateFilterOptions(resources: Resource[]): void {
    const types = [...new Set(resources.map(r => r.resource_type).filter(Boolean))];

    this.filters = this.filters.map(filter => {
      if (filter.key === 'type') {
        return { ...filter, options: types.map(t => ({ value: t, label: t.replace('-', ' ') })) };
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
    let filtered = [...this.allResources()];

    if (this.selectedFilters['wp']) {
      filtered = filtered.filter(r => r.wp_tag === this.selectedFilters['wp']);
    }

    if (this.selectedFilters['type']) {
      filtered = filtered.filter(r => r.resource_type === this.selectedFilters['type']);
    }

    if (this.selectedFilters['language']) {
      filtered = filtered.filter(r => r.language === this.selectedFilters['language']);
    }

    this.filteredResources.set(filtered);
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedResources.set(this.filteredResources().slice(start, end));
  }
}