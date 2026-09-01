// ============================================================
// BRIDGE-AI Kenya - Material Detail Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TrainingMaterialService } from '../../../../services/training-material.service';
import { TrainingMaterial } from '../../../core/models/training-material.model';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-material-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SafeHtmlPipe,
    EuFundingBannerComponent
  ],
  template: `
    <div class="material-detail-page">
      <div class="container">
        <div *ngIf="material() as materialItem; else loading">
          <div class="material-header">
            <div class="material-badge">
              <span class="level-badge" [style.background]="getLevelColor(materialItem.level)">
                {{ materialItem.level }}
              </span>
              <span class="type-badge">{{ materialItem.resource_type.replace(/-/g, ' ') | titlecase }}</span>
            </div>
            <h1 class="material-title">{{ materialItem.title }}</h1>
          </div>

          <div class="material-content">
            <div class="content-card">
              <div class="material-description" [innerHTML]="materialItem.description | safeHtml"></div>
            </div>

            <div class="material-sidebar">
              <div class="sidebar-card">
                <h3 class="sidebar-title">Details</h3>
                <div class="sidebar-item">
                  <span class="item-label">Level</span>
                  <span class="item-value">{{ materialItem.level | titlecase }}</span>
                </div>
                <div *ngIf="materialItem.language" class="sidebar-item">
                  <span class="item-label">Language</span>
                  <span class="item-value">{{ materialItem.language }}</span>
                </div>
                <div *ngIf="materialItem.license" class="sidebar-item">
                  <span class="item-label">License</span>
                  <span class="item-value">{{ materialItem.license }}</span>
                </div>
                <div *ngIf="materialItem.file_path" class="sidebar-item">
                  <span class="item-label">File Size</span>
                  <span class="item-value">{{ formatFileSize(materialItem.file_size) }}</span>
                </div>
                <div *ngIf="materialItem.tags && materialItem.tags.length > 0" class="sidebar-item">
                  <span class="item-label">Tags</span>
                  <span class="item-value">{{ materialItem.tags.join(', ') }}</span>
                </div>
                <div class="sidebar-actions">
                  <a *ngIf="materialItem.file_path" [href]="materialItem.file_path" target="_blank" rel="noopener" class="btn-download">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download Material
                  </a>
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
            <p>Loading material...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .material-detail-page {
      padding: 48px 0 64px 0;
      background: #f8fafc;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .material-header {
      margin-bottom: 24px;
    }

    .material-badge {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }

    .level-badge {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .type-badge {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      background: #f3f4f6;
      color: #6b7280;
    }

    .material-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .material-content {
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

    .material-description {
      font-size: 16px;
      color: #4b5563;
      line-height: 1.7;
    }

    .material-sidebar {
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

    .sidebar-actions {
      margin-top: 16px;
    }

    .btn-download {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 12px;
      background: #3b82f6;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.2s;
    }

    .btn-download:hover {
      background: #2563eb;
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
      .material-content {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .material-title {
        font-size: 26px;
      }
    }
  `]
})
export class MaterialDetailComponent implements OnInit {
  protected material = signal<TrainingMaterial | null>(null);

  constructor(
    private route: ActivatedRoute,
    private materialService: TrainingMaterialService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadMaterial(slug);
    }
  }

  private loadMaterial(slug: string): void {
    this.materialService.getMaterialBySlug(slug).subscribe({
      next: (material) => {
        this.material.set(material);
      },
      error: () => {
        this.material.set(null);
      }
    });
  }

  getLevelColor(level?: string | null): string {
    const colors: Record<string, string> = {
      'beginner': '#dbeafe',
      'intermediate': '#fef3c7',
      'advanced': '#fce4ec'
    };
    return colors[level ?? ''] || '#f3f4f6';
  }

  formatFileSize(fileSize?: string | null): string {
    if (!fileSize) {
      return 'N/A';
    }

    const bytes = Number(fileSize);
    if (!Number.isFinite(bytes) || bytes < 0) {
      return 'N/A';
    }

    if (bytes === 0) {
      return '0 Bytes';
    }

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** unitIndex;

    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }
}