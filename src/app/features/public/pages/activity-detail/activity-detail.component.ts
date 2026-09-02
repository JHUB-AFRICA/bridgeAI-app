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
  imports: [CommonModule, RouterModule, SafeHtmlPipe, CloudinaryImageComponent, EuFundingBannerComponent],
  template: `
    <div class="activity-detail-page">
      @if (activity(); as act) {
        <section class="detail-hero" [style.background-image]="'linear-gradient(rgba(22,40,26,.55), rgba(22,40,26,.55)), url(' + getHeroImage(act) + ')'">
          <div class="detail-hero-inner">
            <div class="detail-kicker-row">
              <span class="wp-tag" [style.background]="getWpColor(act.wp_tag)">{{ act.wp_tag }}</span>
              <span class="activity-type">{{ act.activity_type | titlecase }}</span>
              <span class="activity-date">{{ act.date | date:'dd MMMM yyyy' }}</span>
            </div>
            <h1>{{ act.title }}</h1>
            @if (act.location) {
              <p class="activity-location"><i class="fas fa-map-pin"></i> {{ act.location }}</p>
            }
          </div>
        </section>

        <div class="container detail-shell">
          <article class="detail-card">
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
                  @for (image of act.gallery_images; track image.image_path) {
                    <div class="gallery-item">
                      <app-cloudinary-image
                        [publicId]="image.image_path"
                        [alt]="image.caption || act.title"
                        [width]="300"
                        [height]="200"
                        crop="fill"
                        quality="auto"
                      ></app-cloudinary-image>
                    </div>
                  }
                </div>
              </div>
            }

            <div class="eu-section">
              <app-eu-funding-banner></app-eu-funding-banner>
            </div>
          </article>
        </div>
      } @else {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading activity...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #f7f2e6;
      color: #2d3d35;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .container { max-width: 980px; margin: 0 auto; padding: 0 20px; }
    .detail-hero { position: relative; min-height: 420px; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; background-repeat: no-repeat; overflow: hidden; }
    .detail-hero-inner { position: relative; z-index: 1; width: 100%; max-width: 1080px; padding: 60px 20px; color: #fff; }
    .detail-kicker-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 18px; }
    .wp-tag { display: inline-block; border-radius: 50px; padding: 5px 12px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #fff; }
    .activity-type { display: inline-block; border-radius: 50px; padding: 5px 12px; font-size: 0.7rem; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.9); text-transform: uppercase; letter-spacing: 0.05em; }
    .activity-date { font-size: 0.82rem; color: rgba(255,255,255,0.8); font-weight: 500; }
    .detail-hero h1 { margin: 0; max-width: 760px; font-size: clamp(2.2rem, 4vw, 4rem); line-height: 1.08; letter-spacing: -0.02em; font-weight: 900; }
    .activity-location { margin-top: 14px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.92rem; color: rgba(255,255,255,0.86); }
    .detail-shell { margin-top: -30px; padding-bottom: 64px; position: relative; z-index: 2; }
    .detail-card { background: #fffdf7; border: 1px solid #e1d8c0; border-radius: 24px; box-shadow: 0 24px 64px rgba(0,0,0,0.08); overflow: hidden; padding: 28px; }
    .featured-image { border-radius: 16px; overflow: hidden; margin-bottom: 28px; background: #f3f4f6; }
    .featured-image app-cloudinary-image { display: block; width: 100%; height: 440px; }
    .activity-body { font-size: 1.02rem; line-height: 1.9; color: #2d3d35; }
    .activity-body ::ng-deep h2, .activity-body ::ng-deep h3, .activity-body ::ng-deep h4 { color: #17241b; margin: 26px 0 12px; line-height: 1.3; }
    .activity-body ::ng-deep h2 { font-size: 1.8rem; }
    .activity-body ::ng-deep h3 { font-size: 1.4rem; }
    .activity-body ::ng-deep p, .activity-body ::ng-deep ul, .activity-body ::ng-deep ol { margin: 0 0 18px; }
    .activity-body ::ng-deep ul, .activity-body ::ng-deep ol { padding-left: 22px; }
    .activity-body ::ng-deep img { max-width: 100%; border-radius: 12px; margin: 12px 0; }
    .gallery-section { margin-top: 32px; padding-top: 28px; border-top: 1px solid #e1d8c0; }
    .gallery-title { margin: 0 0 18px; font-size: 1.8rem; color: #17241b; }
    .gallery-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
    .gallery-item { border-radius: 12px; overflow: hidden; background: #f3f4f6; height: 200px; }
    .gallery-item app-cloudinary-image { display: block; width: 100%; height: 100%; }
    .eu-section { margin-top: 32px; }
    .loading-state { min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6e7767; }
    .spinner { width: 40px; height: 40px; border: 4px solid #efe6ce; border-top-color: #26432b; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 768px) { .detail-card { padding: 18px; } .featured-image app-cloudinary-image { height: 260px; } .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 480px) { .gallery-grid { grid-template-columns: 1fr; } .detail-hero-inner { padding: 40px 16px; } .detail-shell { margin-top: -18px; } }
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
      next: (activity) => this.activity.set(activity),
      error: () => this.activity.set(null)
    });
  }

  protected getHeroImage(activity: Activity): string {
    return activity.featured_image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80';
  }

  protected getWpColor(wpTag: string): string {
    const colors: Record<string, string> = {
      WP1: '#3b82f6',
      WP2: '#8b5cf6',
      WP3: '#22c55e',
      WP4: '#f59e0b',
      WP5: '#ef4444',
      WP6: '#06b6d4'
    };
    return colors[wpTag] || '#26432b';
  }
}
