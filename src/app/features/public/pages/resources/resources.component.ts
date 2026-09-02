// ============================================================
// BRIDGE-AI Kenya - Resources Component
// ============================================================

import { Component, OnInit, computed, signal } from '@angular/core';
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
      <section class="resources-hero">
        <div class="hero-inner container">
          <div class="hero-copy">
            <span class="eyebrow">BRIDGE-AI insights</span>
            <h1>Resources and knowledge for agricultural innovation</h1>
            <p>
              Explore public deliverables, policy notes, technical guides, training assets,
              and research outputs from the BRIDGE-AI programme.
            </p>

            <div class="hero-actions">
              <a class="primary-btn" href="#resource-library">Browse resources</a>
              <a class="secondary-btn" [routerLink]="['/training-materials']">Training materials</a>
            </div>
          </div>

          <div class="hero-panel">
            <span class="panel-tag">Featured resource</span>
            <h2>{{ featuredResource()?.title || 'Open knowledge library' }}</h2>
            <p>{{ featuredResource()?.description || 'A growing collection of public resources to support agritech, sustainability, and food systems transformation.' }}</p>

            <div class="panel-meta">
              <span>{{ featuredResource()?.resource_type || 'Knowledge' | titlecase }}</span>
              <span>{{ featuredResource()?.language || 'English' }}</span>
              <span>{{ featuredResource()?.wp_tag || 'WP' }}</span>
            </div>

            <a class="panel-link" *ngIf="featuredResource(); else noFeatured" [routerLink]="['/resources', featuredResource()!.slug]">
              View resource
            </a>
            <ng-template #noFeatured>
              <span class="panel-link muted">Resources will appear here</span>
            </ng-template>
          </div>
        </div>
      </section>

      <section class="resource-overview container" aria-label="Resource overview">
        <div class="overview-card">
          <span class="stat-label">Public items</span>
          <strong>{{ stats().total }}</strong>
        </div>
        <div class="overview-card">
          <span class="stat-label">Deliverables</span>
          <strong>{{ stats().deliverables }}</strong>
        </div>
        <div class="overview-card">
          <span class="stat-label">Training guides</span>
          <strong>{{ stats().guides }}</strong>
        </div>
        <div class="overview-card">
          <span class="stat-label">Languages</span>
          <strong>{{ stats().languages }}</strong>
        </div>
      </section>

      <section class="resource-library container" id="resource-library">
        <div class="library-header">
          <div>
            <span class="section-label">Resource library</span>
            <h2>Browse the collection</h2>
          </div>
          <p>
            Filter by work package, document type, and language to find the material you need.
          </p>
        </div>

        <app-filter-bar
          [filters]="filters"
          [selected]="selectedFilters"
          [resultCount]="filteredResources().length"
          (filterChange)="onFilterChange($event)"
          (clearFiltersEvent)="onClearFilters()"
        ></app-filter-bar>

        <div class="resources-grid" *ngIf="paginatedResources().length; else emptyState">
          <app-resource-card
            *ngFor="let resource of paginatedResources()"
            [resource]="resource"
          ></app-resource-card>
        </div>

        <ng-template #emptyState>
          <div class="empty-state">
            <div class="empty-icon">📚</div>
            <h3>No resources match this filter</h3>
            <p>Try clearing the current filters to view the full resource library.</p>
          </div>
        </ng-template>

        <app-pagination
          [totalItems]="filteredResources().length"
          [currentPage]="currentPage"
          [pageSize]="pageSize"
          (pageChange)="onPageChange($event)"
        ></app-pagination>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .resources-page {
      background: linear-gradient(180deg, #f9fbfc 0%, #f3f7f6 100%);
      color: #112530;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding-left: 24px;
      padding-right: 24px;
    }

    .resources-hero {
      background:
        radial-gradient(circle at top left, rgba(11, 77, 59, 0.1), transparent 34%),
        linear-gradient(135deg, #f4faf5 0%, #eef7f5 40%, #f8fafc 100%);
      border-bottom: 1px solid rgba(17, 37, 48, 0.06);
      padding: 72px 0 34px;
    }

    .hero-inner {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 32px;
      align-items: center;
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(11, 77, 59, 0.08);
      color: #0b4d3b;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .hero-copy h1 {
      margin: 18px 0 14px;
      font-size: clamp(2.2rem, 4vw, 4rem);
      line-height: 1.04;
      letter-spacing: -0.04em;
      color: #102a33;
      max-width: 680px;
    }

    .hero-copy p {
      margin: 0;
      max-width: 600px;
      color: #435765;
      font-size: 1.05rem;
      line-height: 1.75;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 28px;
    }

    .primary-btn,
    .secondary-btn,
    .panel-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 46px;
      padding: 0 18px;
      border-radius: 999px;
      text-decoration: none;
      font-weight: 700;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .primary-btn {
      background: linear-gradient(135deg, #0b4d3b 0%, #1c7d60 100%);
      color: #fff;
      box-shadow: 0 14px 28px rgba(11, 77, 59, 0.18);
    }

    .secondary-btn {
      border: 1px solid rgba(11, 77, 59, 0.15);
      background: rgba(255,255,255,0.5);
      color: #0f2d39;
    }

    .primary-btn:hover,
    .secondary-btn:hover,
    .panel-link:hover {
      transform: translateY(-1px);
    }

    .hero-panel {
      background: rgba(255, 255, 255, 0.82);
      border: 1px solid rgba(17, 37, 48, 0.08);
      border-radius: 24px;
      padding: 24px 24px 20px;
      box-shadow: 0 24px 50px rgba(10, 31, 40, 0.08);
      backdrop-filter: blur(8px);
    }

    .panel-tag {
      display: inline-block;
      padding: 7px 10px;
      border-radius: 999px;
      background: rgba(13, 96, 74, 0.08);
      color: #0b4d3b;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .hero-panel h2 {
      margin: 18px 0 12px;
      font-size: clamp(1.4rem, 2vw, 2.1rem);
      line-height: 1.2;
      color: #112530;
    }

    .hero-panel p {
      margin: 0;
      color: #4f6472;
      font-size: 0.97rem;
      line-height: 1.7;
    }

    .panel-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 18px 0 20px;
    }

    .panel-meta span {
      padding: 7px 10px;
      border-radius: 999px;
      background: #f1f5f9;
      border: 1px solid rgba(17, 37, 48, 0.05);
      color: #385266;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .panel-link {
      background: rgba(11, 77, 59, 0.06);
      color: #0b4d3b;
      border: 1px solid rgba(11, 77, 59, 0.1);
    }

    .panel-link.muted {
      background: #f3f6f9;
      color: #516476;
    }

    .resource-overview {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
      margin-top: -18px;
      margin-bottom: 28px;
      position: relative;
      z-index: 1;
    }

    .overview-card {
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(17, 37, 48, 0.06);
      border-radius: 18px;
      padding: 22px 20px;
      box-shadow: 0 10px 22px rgba(13, 30, 38, 0.04);
    }

    .stat-label {
      display: block;
      margin-bottom: 8px;
      color: #587083;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .overview-card strong {
      font-size: clamp(1.7rem, 2.5vw, 2.4rem);
      color: #102a33;
      letter-spacing: -0.04em;
    }

    .resource-library {
      padding: 16px 0 72px;
    }

    .library-header {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 24px;
      margin-bottom: 20px;
    }

    .section-label {
      display: inline-block;
      margin-bottom: 8px;
      color: #0b4d3b;
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .library-header h2 {
      margin: 0;
      font-size: clamp(1.8rem, 2.6vw, 2.8rem);
      letter-spacing: -0.04em;
      color: #112530;
    }

    .library-header p {
      max-width: 560px;
      margin: 0;
      color: #536875;
      line-height: 1.7;
      font-size: 1rem;
    }

    .resources-grid {
      display: grid;
      gap: 16px;
      margin-top: 24px;
    }

    .empty-state {
      margin-top: 28px;
      border: 1px solid rgba(17, 37, 48, 0.08);
      background: rgba(255,255,255,0.8);
      border-radius: 20px;
      padding: 42px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 2.2rem;
      margin-bottom: 12px;
    }

    .empty-state h3 {
      margin: 0 0 8px;
      color: #112530;
      font-size: 1.4rem;
    }

    .empty-state p {
      margin: 0;
      color: #587083;
      line-height: 1.7;
    }

    @media (max-width: 980px) {
      .hero-inner {
        grid-template-columns: 1fr;
      }

      .resource-overview {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .library-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media (max-width: 640px) {
      .resources-hero {
        padding-top: 56px;
      }

      .container {
        padding-left: 16px;
        padding-right: 16px;
      }

      .resource-overview {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ResourcesComponent implements OnInit {
  protected allResources = signal<Resource[]>([]);
  protected filteredResources = signal<Resource[]>([]);
  protected paginatedResources = signal<Resource[]>([]);

  protected currentPage = 1;
  protected pageSize = 8;
  protected selectedFilters: Record<string, string> = {};

  protected readonly featuredResource = computed(() => {
    const source = this.filteredResources().length ? this.filteredResources() : this.allResources();
    return source[0] ?? null;
  });

  protected readonly stats = computed(() => {
    const source = this.filteredResources().length ? this.filteredResources() : this.allResources();

    return {
      total: source.length,
      deliverables: source.filter(resource => /deliverable|report|brief|summary/i.test(resource.resource_type)).length,
      guides: source.filter(resource => /guide|training|tutorial|manual/i.test(resource.resource_type)).length,
      languages: new Set(source.map(resource => resource.language).filter(Boolean)).size
    };
  });

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
        const publicResources = resources.filter(resource => resource.is_public);
        this.allResources.set(publicResources);
        this.updateFilterOptions(publicResources);
        this.applyFilters();
      },
      error: () => {
        this.allResources.set([]);
        this.filteredResources.set([]);
        this.paginatedResources.set([]);
      }
    });
  }

  private updateFilterOptions(resources: Resource[]): void {
    const types = [...new Set(resources.map(resource => resource.resource_type).filter(Boolean))];

    this.filters = this.filters.map(filter => {
      if (filter.key === 'type') {
        return { ...filter, options: types.map(value => ({ value, label: value.replace('-', ' ') })) };
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
      filtered = filtered.filter(resource => resource.wp_tag === this.selectedFilters['wp']);
    }

    if (this.selectedFilters['type']) {
      filtered = filtered.filter(resource => resource.resource_type === this.selectedFilters['type']);
    }

    if (this.selectedFilters['language']) {
      filtered = filtered.filter(resource => resource.language === this.selectedFilters['language']);
    }

    this.filteredResources.set(filtered);
    this.updatePagination();
  }

  private updatePagination(): void {
    const totalPages = Math.max(1, Math.ceil(this.filteredResources().length / this.pageSize));
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedResources.set(this.filteredResources().slice(start, end));
  }
}