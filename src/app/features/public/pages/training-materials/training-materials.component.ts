// ============================================================
// BRIDGE-AI Kenya - Training Materials Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TrainingMaterialService } from '../../../../services/training-material.service';
import { TrainingMaterial } from '../../../core/models/training-material.model';
import { FilterBarComponent, FilterOption } from '../../../shared/components/filter-bar/filter-bar.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { FileSizePipe } from '../../../shared/pipes/file-size.pipe';

@Component({
  selector: 'app-training-materials',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FilterBarComponent,
    PaginationComponent,
    FileSizePipe
  ],
  template: `
    <div class="training-materials-page">
      <div class="container">
        <h1 class="page-title">Training Materials</h1>

        <app-filter-bar
          [filters]="filters"
          [selected]="selectedFilters"
          [resultCount]="filteredMaterials().length"
          (filterChange)="onFilterChange($event)"
          (clearFiltersEvent)="onClearFilters()"
        ></app-filter-bar>

        <div class="materials-grid">
          <div *ngFor="let material of paginatedMaterials()" class="material-card">
            <div class="material-icon" [style.background]="getLevelColor(material.level)">
              <span class="icon">{{ getLevelIcon(material.level) }}</span>
            </div>
            <div class="material-content">
              <h4 class="material-title">
                <a [routerLink]="['/training-materials', material.slug]">
                  {{ material.title }}
                </a>
              </h4>
              <p class="material-description">{{ material.description }}</p>
              <div class="material-meta">
                <span class="material-level">{{ material.level }}</span>
                <span *ngIf="material.file_path" class="material-size">
                  <span class="dot">•</span>
                  {{ material.file_size || 'File' }}
                </span>
                <span *ngIf="material.tags && material.tags.length > 0" class="material-tags">
                  <span class="dot">•</span>
                  {{ material.tags.join(', ') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="filteredMaterials().length === 0" class="empty-state">
          <p>No training materials found matching your criteria.</p>
        </div>

        <app-pagination
          [totalItems]="filteredMaterials().length"
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </div>
    </div>
  `,
  styles: [`
    .training-materials-page {
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

    .materials-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 24px;
    }

    .material-card {
      display: flex;
      gap: 16px;
      padding: 20px 24px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #f3f4f6;
      transition: box-shadow 0.3s ease;
    }

    .material-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .material-icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .material-content {
      flex: 1;
      min-width: 0;
    }

    .material-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px 0;
    }

    .material-title a {
      color: #1f2937;
      text-decoration: none;
      transition: color 0.2s;
    }

    .material-title a:hover {
      color: #3b82f6;
    }

    .material-description {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 8px 0;
      line-height: 1.5;
    }

    .material-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px;
      font-size: 12px;
      color: #9ca3af;
    }

    .material-level {
      padding: 2px 8px;
      background: #f3f4f6;
      border-radius: 4px;
      color: #6b7280;
      text-transform: capitalize;
    }

    .dot {
      color: #d1d5db;
      margin: 0 4px;
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

      .material-card {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class TrainingMaterialsComponent implements OnInit {
  protected allMaterials = signal<TrainingMaterial[]>([]);
  protected filteredMaterials = signal<TrainingMaterial[]>([]);
  protected paginatedMaterials = signal<TrainingMaterial[]>([]);

  protected currentPage: number = 1;
  protected pageSize: number = 10;
  protected selectedFilters: Record<string, string> = {};

  protected filters: { key: string; label: string; options: FilterOption[] }[] = [
    {
      key: 'level',
      label: 'Level',
      options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
      ]
    },
    {
      key: 'type',
      label: 'Type',
      options: []
    }
  ];

  constructor(private materialService: TrainingMaterialService) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  private loadMaterials(): void {
    this.materialService.getPublicMaterials().subscribe({
      next: (materials) => {
        this.allMaterials.set(materials);
        this.updateFilterOptions(materials);
        this.applyFilters();
      },
      error: () => {
        this.allMaterials.set([]);
        this.filteredMaterials.set([]);
      }
    });
  }

  private updateFilterOptions(materials: TrainingMaterial[]): void {
    const types = [...new Set(materials.map(m => m.resource_type).filter(Boolean))];

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
    let filtered = [...this.allMaterials()];

    if (this.selectedFilters['level']) {
      filtered = filtered.filter(m => m.level === this.selectedFilters['level']);
    }

    if (this.selectedFilters['type']) {
      filtered = filtered.filter(m => m.resource_type === this.selectedFilters['type']);
    }

    this.filteredMaterials.set(filtered);
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedMaterials.set(this.filteredMaterials().slice(start, end));
  }

  getLevelColor(level: string): string {
    const colors: Record<string, string> = {
      'beginner': '#dbeafe',
      'intermediate': '#fef3c7',
      'advanced': '#fce4ec'
    };
    return colors[level] || '#f3f4f6';
  }

  getLevelIcon(level: string): string {
    const icons: Record<string, string> = {
      'beginner': '🌱',
      'intermediate': '📘',
      'advanced': '🚀'
    };
    return icons[level] || '📄';
  }
}