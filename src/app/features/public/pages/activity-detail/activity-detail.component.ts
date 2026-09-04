// ============================================================
// BRIDGE-AI Kenya - Activity Detail Component
// ============================================================

import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { Activity } from '../../../core/models/activity.model';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { CloudinaryImageComponent } from '../../../shared/components/cloudinary-image/cloudinary-image.component';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SafeHtmlPipe, CloudinaryImageComponent],
  template: `
    <div class="activity-detail-page">
      @if (activity(); as act) {
        <section class="detail-hero" [style.background-image]="'linear-gradient(rgba(22,40,26,.55), rgba(22,40,26,.55)), url(' + getHeroImage(act) + ')'">
          <div class="detail-hero-inner">
            <div class="detail-kicker-row">
              @if (act.wp_tag) {
                <span class="wp-tag" [style.background]="getWpColor(act.wp_tag)">{{ act.wp_tag }}</span>
              }
              @if (act.activity_type) {
                <span class="activity-type">{{ act.activity_type | titlecase }}</span>
              }
              @if (act.audience) {
                <span class="activity-type">For {{ act.audience | titlecase }}</span>
              }
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
            @if (act.summary) {
              <p class="activity-summary">{{ act.summary }}</p>
            }

            @if (getActivityImages(act).length > 0) {
              <section class="activity-image-carousel" aria-label="Activity images">
                <div class="carousel-stage">
                  @for (image of getActivityImages(act); track image.path; let index = $index) {
                    <div class="carousel-slide" [class.active]="index === activeImageIndex()" [attr.aria-hidden]="index !== activeImageIndex()">
                      <app-cloudinary-image
                        [publicId]="image.path"
                        [alt]="image.alt"
                        [width]="1200"
                        [height]="500"
                        crop="fill"
                        quality="auto"
                      ></app-cloudinary-image>
                      @if (image.caption) {
                        <p class="carousel-caption">{{ image.caption }}</p>
                      }
                    </div>
                  }

                  @if (getActivityImages(act).length > 1) {
                    <button type="button" class="carousel-control previous" (click)="showPreviousImage(getActivityImages(act).length)" aria-label="Show previous activity image">
                      <span aria-hidden="true">&#8592;</span>
                    </button>
                    <button type="button" class="carousel-control next" (click)="showNextImage(getActivityImages(act).length)" aria-label="Show next activity image">
                      <span aria-hidden="true">&#8594;</span>
                    </button>
                  }
                </div>

                @if (getActivityImages(act).length > 1) {
                  <div class="carousel-dots" aria-label="Choose activity image">
                    @for (image of getActivityImages(act); track image.path; let index = $index) {
                      <button type="button" class="carousel-dot" [class.active]="index === activeImageIndex()" (click)="showImage(index)" [attr.aria-label]="'Show activity image ' + (index + 1)" [attr.aria-current]="index === activeImageIndex() ? 'true' : null"></button>
                    }
                  </div>
                }
              </section>
            }

            <div class="activity-body" [innerHTML]="act.body | safeHtml"></div>

          </article>
        </div>
      } @else if (notFound()) {
        <div class="loading-state">
          <h1>Activity not found</h1>
          <p>The activity may have been moved or is no longer available.</p>
          <a routerLink="/activities" class="back-link">Back to Activities</a>
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
    .activity-summary { margin: 0 0 28px; padding: 18px 20px; border-left: 4px solid #c89b3c; background: #f5efe1; color: #48564a; font-size: 1.12rem; line-height: 1.75; }
    .activity-image-carousel { margin-bottom: 28px; }
    .carousel-stage { position: relative; min-height: 500px; overflow: hidden; border-radius: 16px; background: #f3f4f6; }
    .carousel-slide { position: absolute; inset: 0; visibility: hidden; opacity: 0; transition: opacity .35s ease; pointer-events: none; }
    .carousel-slide.active { position: relative; visibility: visible; opacity: 1; pointer-events: auto; }
    .carousel-slide app-cloudinary-image { display: block; width: 100%; height: 500px; }
    .carousel-caption { position: absolute; right: 0; bottom: 0; left: 0; margin: 0; padding: 14px 18px; color: #fff; background: linear-gradient(transparent, rgba(0,0,0,.72)); font-size: .85rem; }
    .carousel-control { position: absolute; top: 50%; z-index: 2; width: 42px; height: 42px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.5); border-radius: 50%; background: rgba(22,40,26,.72); color: #fff; cursor: pointer; transform: translateY(-50%); font-size: 1.3rem; }
    .carousel-control:hover { background: #26432b; }
    .carousel-control.previous { left: 16px; }
    .carousel-control.next { right: 16px; }
    .carousel-dots { display: flex; justify-content: center; gap: 8px; padding-top: 14px; }
    .carousel-dot { width: 9px; height: 9px; padding: 0; border: 0; border-radius: 50%; background: #c8c0ab; cursor: pointer; }
    .carousel-dot.active { background: #26432b; transform: scale(1.25); }
    .activity-body { font-size: 1.02rem; line-height: 1.9; color: #2d3d35; }
    .activity-body ::ng-deep h2, .activity-body ::ng-deep h3, .activity-body ::ng-deep h4 { color: #17241b; margin: 26px 0 12px; line-height: 1.3; }
    .activity-body ::ng-deep h2 { font-size: 1.8rem; }
    .activity-body ::ng-deep h3 { font-size: 1.4rem; }
    .activity-body ::ng-deep p, .activity-body ::ng-deep ul, .activity-body ::ng-deep ol { margin: 0 0 18px; }
    .activity-body ::ng-deep ul, .activity-body ::ng-deep ol { padding-left: 22px; }
    .activity-body ::ng-deep img { max-width: 100%; border-radius: 12px; margin: 12px 0; }
    .loading-state { min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6e7767; }
    .spinner { width: 40px; height: 40px; border: 4px solid #efe6ce; border-top-color: #26432b; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 768px) { .detail-card { padding: 18px; } .carousel-stage, .carousel-slide app-cloudinary-image { min-height: 260px; height: 260px; } }
    @media (max-width: 480px) { .detail-hero-inner { padding: 40px 16px; } .detail-shell { margin-top: -18px; } .carousel-control { width: 36px; height: 36px; } }
  `]
})
export class ActivityDetailComponent implements OnInit, OnDestroy {
  protected activity = signal<Activity | null>(null);
  protected notFound = signal(false);
  protected activeImageIndex = signal(0);
  private imageRotationTimer?: ReturnType<typeof setInterval>;

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
    const request = /^\d+$/.test(slug)
      ? this.activityService.getActivity(Number(slug))
      : this.activityService.getActivityBySlug(slug);
    request.subscribe({
      next: (activity) => {
        this.activeImageIndex.set(0);
        this.activity.set(activity);
        this.startImageRotation(activity);
      },
      error: () => {
        this.activity.set(null);
        this.notFound.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopImageRotation();
  }

  protected getActivityImages(activity: Activity): Array<{ path: string; alt: string; caption?: string }> {
    const galleryImages = [...(activity.gallery_images || [])]
      .sort((first, second) => (first.display_order ?? 0) - (second.display_order ?? 0))
      .map(image => ({
        path: image.image_path,
        alt: image.caption || activity.title,
        caption: image.caption
      }));

    return activity.featured_image
      ? [{ path: activity.featured_image, alt: activity.title }, ...galleryImages]
      : galleryImages;
  }

  protected showImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  protected showPreviousImage(imageCount: number): void {
    this.activeImageIndex.update(index => (index - 1 + imageCount) % imageCount);
  }

  protected showNextImage(imageCount: number): void {
    this.activeImageIndex.update(index => (index + 1) % imageCount);
  }

  private startImageRotation(activity: Activity): void {
    this.stopImageRotation();
    const imageCount = this.getActivityImages(activity).length;
    if (imageCount < 2) return;

    this.imageRotationTimer = setInterval(() => {
      this.showNextImage(imageCount);
    }, 5000);
  }

  private stopImageRotation(): void {
    if (this.imageRotationTimer) {
      clearInterval(this.imageRotationTimer);
      this.imageRotationTimer = undefined;
    }
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
