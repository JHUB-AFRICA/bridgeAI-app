// ============================================================
// BRIDGE-AI Kenya - Activity Detail Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { Activity } from '../../../core/models/activity.model';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { CloudinaryImageComponent } from '../../../shared/components/cloudinary-image/cloudinary-image.component';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SafeHtmlPipe,
    CloudinaryImageComponent,
    EuFundingBannerComponent
  ],
  template: `
    <div class="activity-detail-page">
      <div class="container">
        @if (activity(); as act) {
          <div>
            <div class="activity-header">
              <div class="activity-meta">
                <span class="wp-tag" [style.background]="getWpColor(act.wp_tag)">
                  {{ act.wp_tag }}
                </span>
                <span class="activity-type">{{ act.activity_type }}</span>
                <span class="activity-date">{{ act.date | date:'dd MMMM yyyy' }}</span>
              </div>
              <h1 class="activity-title">{{ act.title }}</h1>
              @if (act.location) {
                <p class="activity-location">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {{ act.location }}
                </p>
              }
            </div>

            @if (act.featured_image) {
              <div class="featured-image">
                <app-cloudinary-image
                  [publicId]="act.featured_image"
                  [alt]="act.title"
                  [width]="1200"
                  [height]="500"
                  crop="fill"
                  quality="auto"
                ></app-cloudinary-image>
              </div>
            }

            <div class="activity-body" [innerHTML]="act.body | safeHtml"></div>

            @if (act.gallery_images && act.gallery_images.length > 0) {
              <div class="gallery-section">
                <h2 class="gallery-title">Gallery</h2>
                <div class="gallery-grid">
                  @for (image of act.gallery_images; track image) {
                    <app-cloudinary-image
                      [publicId]="image.image_path"
                      [alt]="image.caption || act.title"
                      [width]="300"
                      [height]="200"
                      crop="fill"
                      quality="auto"
                    ></app-cloudinary-image>
                  }
                </div>
              </div>
            }

            <div class="eu-section">
              <app-eu-funding-banner></app-eu-funding-banner>
            </div>
          </div>
        } @else {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading activity...</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .activity-detail-page {
      padding: 48px 0 64px 0;
      background: #f8fafc;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .activity-header {
      margin-bottom: 24px;
    }

    .activity-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .wp-tag {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
    }

    .activity-type {
      font-size: 13px;
      color: #6b7280;
      padding: 2px 10px;
      background: #f3f4f6;
      border-radius: 4px;
    }

    .activity-date {
      font-size: 13px;
      color: #9ca3af;
    }

    .activity-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    .activity-location {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .featured-image {
      border-radius: 12px;
      overflow: hidden;
      margin: 24px 0 32px 0;
      background: #f3f4f6;
    }

    .featured-image app-cloudinary-image {
      width: 100%;
      height: 400px;
      display: block;
    }

    .activity-body {
      font-size: 16px;
      color: #1f2937;
      line-height: 1.8;
    }

    .activity-body ::ng-deep h2 {
      font-size: 22px;
      font-weight: 600;
      margin: 24px 0 12px 0;
    }

    .activity-body ::ng-deep h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 20px 0 10px 0;
    }

    .activity-body ::ng-deep p {
      margin: 0 0 16px 0;
    }

    .activity-body ::ng-deep ul,
    .activity-body ::ng-deep ol {
      padding-left: 24px;
      margin: 0 0 16px 0;
    }

    .activity-body ::ng-deep li {
      margin-bottom: 6px;
    }

    .activity-body ::ng-deep img {
      max-width: 100%;
      border-radius: 8px;
    }

    .gallery-section {
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid #e5e7eb;
    }

    .gallery-title {
      font-size: 22px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .gallery-grid app-cloudinary-image {
      width: 100%;
      height: 180px;
      border-radius: 8px;
      overflow: hidden;
      background: #f3f4f6;
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
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 768px) {
      .activity-title {
        font-size: 26px;
      }

      .featured-image app-cloudinary-image {
        height: 250px;
      }

      .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .gallery-grid {
        grid-template-columns: 1fr;
      }

      .activity-meta {
        gap: 8px;
      }
    }
  `]
})
export class ActivityDetailComponent implements OnInit {
  protected activity = signal<Activity | null>(null);

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadActivity(slug);
    }
  }

  private loadActivity(slug: string): void {
    this.activityService.getActivityBySlug(slug).subscribe({
      next: (activity: Activity) => {
        this.activity.set(activity);
      },
      error: () => {
        this.activity.set(null);
      }
    });
  }

  getWpColor(wpTag: string): string {
    const colors: Record<string, string> = {
      'WP1': '#3b82f6',
      'WP2': '#8b5cf6',
      'WP3': '#22c55e',
      'WP4': '#f59e0b',
      'WP5': '#ef4444',
      'WP6': '#06b6d4'
    };
    return colors[wpTag] || '#6b7280';
  }
}