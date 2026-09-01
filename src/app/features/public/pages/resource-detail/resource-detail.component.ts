// ============================================================
// BRIDGE-AI Kenya - Resource Detail Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ResourceService } from '../../../../services/resource.service';
import { Resource } from '../../../core/models/resource.model';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { FileSizePipe } from '../../../shared/pipes/file-size.pipe';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-resource-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SafeHtmlPipe,
    FileSizePipe,
    EuFundingBannerComponent
  ],
  template: `
    <div class="resource-detail-page">
      <div class="container">
        <div *ngIf="resource(); else loading">
          <div class="resource-header">
            <div class="resource-badge">
              <span class="type-badge">{{ formatResourceType(resource()?.resource_type) }}</span>
              <span class="wp-badge" [style.background]="getWpColor(resource()?.wp_tag)">
                {{ resource()?.wp_tag }}
              </span>
            </div>
            <h1 class="resource-title">{{ resource()?.title }}</h1>
          </div>

          <div class="resource-content">
            <div class="content-card">
              <div class="resource-description" [innerHTML]="resource()?.description | safeHtml"></div>

              <div *ngIf="resource()?.file_path" class="resource-download">
                <a [href]="resource()?.file_path" target="_blank" rel="noopener" class="btn-download">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Resource
                </a>
              </div>

              <div *ngIf="resource()?.external_url" class="resource-external">
                <a [href]="resource()?.external_url" target="_blank" rel="noopener" class="btn-external">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View External Resource
                </a>
              </div>
            </div>

            <div class="resource-sidebar">
              <div class="sidebar-card">
                <h3 class="sidebar-title">Details</h3>
                <div class="sidebar-item">
                  <span class="item-label">Type</span>
                  <span class="item-value">{{ formatResourceType(resource()?.resource_type) }}</span>
                </div>
                <div class="sidebar-item">
                  <span class="item-label">Work Package</span>
                  <span class="item-value">{{ resource()?.wp_tag }}</span>
                </div>
                <div *ngIf="resource()?.language" class="sidebar-item">
                  <span class="item-label">Language</span>
                  <span class="item-value">{{ resource()?.language }}</span>
                </div>
                <div *ngIf="resource()?.license" class="sidebar-item">
                  <span class="item-label">License</span>
                  <span class="item-value">{{ resource()?.license }}</span>
                </div>
                <div *ngIf="resource()?.download_count !== undefined" class="sidebar-item">
                  <span class="item-label">Downloads</span>
                  <span class="item-value">{{ resource()?.download_count }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="eu-section">
            <app-eu-funding-banner></app-eu-funding-banner>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading resource...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .resource-detail-page {
      padding: 48px 0 64px 0;
      background: #f8fafc;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .resource-header {
      margin-bottom: 24px;
    }

    .resource-badge {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }

    .type-badge {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      background: #f3f4f6;
      color: #6b7280;
    }

    .wp-badge {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
    }

    .resource-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .resource-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .content-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 28px;
      border: 1px solid #f3f4f6;
    }

    .resource-description {
      font-size: 16px;
      color: #4b5563;
      line-height: 1.7;
    }

    .resource-description ::ng-deep p {
      margin: 0 0 12px 0;
    }

    .resource-download,
    .resource-external {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #f3f4f6;
    }

    .btn-download,
    .btn-external {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 28px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.2s;
    }

    .btn-download {
      background: #3b82f6;
      color: #ffffff;
    }

    .btn-download:hover {
      background: #2563eb;
    }

    .btn-external {
      background: #22c55e;
      color: #ffffff;
    }

    .btn-external:hover {
      background: #16a34a;
    }

    .resource-sidebar {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .sidebar-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 20px;
      border: 1px solid #f3f4f6;
    }

    .sidebar-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    .sidebar-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .sidebar-item:last-child {
      border-bottom: none;
    }

    .item-label {
      font-size: 13px;
      color: #9ca3af;
    }

    .item-value {
      font-size: 13px;
      font-weight: 500;
      color: #1f2937;
      text-align: right;
    }

    .eu-section {
      margin-top: 32px;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 0;
      color: #6b7280;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .resource-content {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .resource-title {
        font-size: 26px;
      }
    }
  `]
})
export class ResourceDetailComponent implements OnInit {
  protected resource = signal<Resource | null>(null);

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService
  ) {}

  formatResourceType(resourceType?: string | null): string {
    if (!resourceType) {
      return 'Resource';
    }

    const normalizedType = resourceType.trim();
    const typeMap: Record<string, string> = {
      article: 'Article',
      report: 'Report',
      toolkit: 'Toolkit',
      webinar: 'Webinar',
      video: 'Video',
      dataset: 'Dataset',
      template: 'Template',
      guide: 'Guide'
    };

    return typeMap[normalizedType.toLowerCase()] || normalizedType
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadResource(slug);
    }
  }

  private loadResource(slug: string): void {
    this.resourceService.getResourceBySlug(slug).subscribe({
      next: (resource) => {
        this.resource.set(resource);
        if (resource.id) {
          this.resourceService.incrementDownloadCount(resource.id).subscribe();
        }
      },
      error: () => {
        this.resource.set(null);
      }
    });
  }

  getWpColor(wpTag?: string | null): string {
    const normalizedTag = wpTag?.trim();
    if (!normalizedTag) {
      return '#6b7280';
    }

    const colors: Record<string, string> = {
      'WP1': '#3b82f6',
      'WP2': '#8b5cf6',
      'WP3': '#22c55e',
      'WP4': '#f59e0b',
      'WP5': '#ef4444',
      'WP6': '#06b6d4'
    };
    return colors[normalizedTag] || '#6b7280';
  }
}