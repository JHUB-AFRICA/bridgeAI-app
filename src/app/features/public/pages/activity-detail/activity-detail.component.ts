// ============================================================
// BRIDGE-AI Kenya - Activity Detail Component
// ============================================================

import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
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
              <span class="activity-date">{{ act.date | date:'dd MMMM yyyy' }}</span>
            </div>
            <h1>{{ act.title }}</h1>
            @if (act.location) {
              <p class="activity-location"><i class="fas fa-map-pin"></i> {{ act.location }}</p>
            }
          </div>
        </section>

        <div class="container detail-shell">
          <div class="detail-layout">
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

              <section class="share-section" aria-labelledby="share-title">
                <h2 id="share-title">Share this activity</h2>
                <div class="share-actions">
                  <a [href]="shareUrl('facebook')" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"><span aria-hidden="true">f</span> Facebook</a>
                  <a [href]="shareUrl('linkedin')" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"><span aria-hidden="true">in</span> LinkedIn</a>
                  <a [href]="shareUrl('whatsapp')" target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp"><span aria-hidden="true">&#9742;</span> WhatsApp</a>
                </div>
              </section>

              @if (previousActivity(); as previous) {
                <nav class="previous-navigation" aria-label="Previous activity">
                  <span>Previous</span>
                  <a [routerLink]="['/activities', previous.slug || previous.id]">{{ previous.title }}</a>
                </nav>
              }

            </article>

            <aside class="recent-posts" aria-labelledby="recent-posts-title">
              <div class="recent-posts-heading">
                <span class="eyebrow">From the BRIDGE-AI field journal</span>
                <h2 id="recent-posts-title">Recent posts</h2>
              </div>
              @if (recentPostsLoading()) {
                <div class="recent-posts-grid" aria-hidden="true">
                  @for (placeholder of recentPostSkeletons; track placeholder) {
                    <div class="recent-post recent-post-skeleton">
                      <div class="recent-skeleton-image shimmer"></div>
                      <div class="recent-skeleton-copy">
                        <div class="recent-skeleton-title shimmer"></div>
                        <div class="recent-skeleton-line shimmer"></div>
                        <div class="recent-skeleton-line short shimmer"></div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="recent-posts-grid">
                    @for (post of recentActivities(); track post.slug || post.id) {
                      @if (post.slug || post.id) {
                        <a
                          class="recent-post"
                          [routerLink]="['/activities', post.slug || post.id]"
                          [attr.aria-label]="'Open activity: ' + post.title"
                        >
                          <img [src]="getRecentImage(post)" [alt]="post.title" title="Recent activity" loading="lazy" />
                          <span>
                            <strong>{{ post.title }}</strong>
                            <small>{{ post.activity_type | titlecase }} · {{ getDateText(post.date) }}</small>
                          </span>
                        </a>
                      }
                    }
                </div>
              }
            </aside>
          </div>

          <section class="latest-activities-return" aria-labelledby="latest-activities-title">
            <div>
              <span class="eyebrow">Continue exploring</span>
              <h2 id="latest-activities-title">Latest Activities</h2>
              <p>News, events, and field updates from the BRIDGE-AI consortium.</p>
            </div>
            <a routerLink="/activities" class="latest-activities-link">
              <span>Back to Activities</span>
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </a>
          </section>
        </div>
      } @else if (notFound()) {
        <div class="loading-state">
          <h1>Activity not found</h1>
          <p>The activity may have been moved or is no longer available.</p>
          <a routerLink="/activities" class="back-link">Back to Activities</a>
        </div>
      } @else {
        <div class="detail-loading" aria-label="Loading activity">
          <div class="detail-loading-hero shimmer"></div>
          <div class="detail-loading-layout">
            <div class="detail-loading-main">
              <div class="detail-loading-image shimmer"></div>
              <div class="detail-loading-line wide shimmer"></div>
              <div class="detail-loading-line shimmer"></div>
              <div class="detail-loading-line medium shimmer"></div>
            </div>
            <div class="detail-loading-side">
              <div class="detail-loading-line medium shimmer"></div>
              <div class="detail-loading-post shimmer"></div>
              <div class="detail-loading-post shimmer"></div>
            </div>
          </div>
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
    .detail-layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 28px; align-items: start; }
    .detail-card { min-width: 0; background: #fffdf7; border: 1px solid #e1d8c0; border-radius: 24px; box-shadow: 0 24px 64px rgba(0,0,0,0.08); overflow: hidden; padding: 28px; }
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
    .recent-posts { min-width: 0; margin: 0; padding: 22px 18px; border: 1px solid #e1d8c0; border-radius: 18px; background: rgba(255,253,247,.72); box-shadow: 0 14px 32px rgba(22,40,26,.06); position: sticky; top: calc(var(--site-header-offset, 80px) + 20px); }
    .recent-posts-heading { display: block; margin-bottom: 18px; }
    .recent-posts h2 { margin: 0; color: #30383d; font-size: 1.35rem; font-weight: 800; letter-spacing: -.02em; }
    .eyebrow { display: block; margin-bottom: 8px; color: #818528; font-size: .68rem; font-weight: 700; letter-spacing: .08em; line-height: 1.45; text-transform: uppercase; }
    .recent-posts-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
    .recent-post { display: grid; grid-template-columns: 82px minmax(0, 1fr); gap: 12px; align-items: center; min-height: 96px; padding: 9px; border: 1px solid #e1d8c0; border-radius: 14px; background: #fff; color: #30383d; text-decoration: none; transition: transform .25s ease, box-shadow .25s ease; }
    .recent-post img { width: 82px; height: 72px; border-radius: 9px; object-fit: cover; background: #e6eadf; }
    .recent-post strong { display: block; font-size: .88rem; line-height: 1.35; }
    .recent-post small { display: block; margin-top: 5px; color: #8a8f92; font-size: .72rem; line-height: 1.35; }
    .recent-post:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(22,40,26,.1); }
    .recent-post:hover strong { color: #6f7623; }
    .recent-post:focus-visible { outline: 3px solid #c89b3c; outline-offset: 3px; }
    .recent-post-skeleton { border-color: transparent; pointer-events: none; }
    .recent-skeleton-image { width: 82px; height: 72px; border-radius: 9px; }
    .recent-skeleton-copy { min-width: 0; }
    .recent-skeleton-title { width: 88%; height: 13px; border-radius: 5px; margin-bottom: 12px; }
    .recent-skeleton-line { width: 72%; height: 8px; border-radius: 4px; margin-bottom: 8px; }
    .recent-skeleton-line.short { width: 54%; }
    .share-section { margin-top: 48px; padding-top: 30px; border-top: 1px solid #e1d8c0; }
    .share-section h2 { margin: 0 0 16px; color: #17241b; font-size: .95rem; font-weight: 600; }
    .share-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
    .share-actions a { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-width: 0; padding: 10px 12px; border: 1px solid #818528; color: #818528; font-size: .78rem; text-decoration: none; }
    .share-actions a:hover { background: #818528; color: #fff; }
    .share-actions span { font-weight: 800; }
    .previous-navigation { display: grid; gap: 5px; margin-top: 34px; padding-top: 22px; border-top: 1px solid #e1d8c0; }
    .previous-navigation span { color: #8a8f92; font-size: .75rem; }
    .previous-navigation a { overflow: hidden; color: #17241b; font-size: .9rem; text-overflow: ellipsis; white-space: nowrap; text-decoration: none; }
    .previous-navigation a:hover { color: #6f7623; }
    .latest-activities-return { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-top: 28px; padding: 28px 30px; border-radius: 18px; background: #26432b; color: #f7f2e6; box-shadow: 0 18px 38px rgba(22,40,26,.14); }
    .latest-activities-return .eyebrow { margin-bottom: 7px; color: #d8e86b; }
    .latest-activities-return h2 { margin: 0 0 5px; color: #fff; font-size: 1.45rem; line-height: 1.15; }
    .latest-activities-return p { margin: 0; color: rgba(247,242,230,.76); font-size: .88rem; line-height: 1.5; }
    .latest-activities-link { display: inline-flex; align-items: center; gap: 10px; flex-shrink: 0; padding: 12px 17px; border: 1px solid rgba(247,242,230,.35); border-radius: 50px; color: #fff; font-size: .82rem; font-weight: 700; text-decoration: none; transition: gap .25s ease, background .25s ease, border-color .25s ease; }
    .latest-activities-link:hover { gap: 14px; border-color: #d8e86b; background: rgba(255,255,255,.1); }
    .loading-state { min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6e7767; }
    .detail-loading { padding-bottom: 64px; }
    .detail-loading-hero { height: 360px; }
    .detail-loading-layout { max-width: 980px; margin: -30px auto 0; padding: 0 20px; position: relative; display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 28px; }
    .detail-loading-main, .detail-loading-side { padding: 28px; border-radius: 24px; background: #fffdf7; box-shadow: 0 24px 64px rgba(0,0,0,.08); }
    .detail-loading-image { height: 320px; border-radius: 16px; margin-bottom: 28px; }
    .detail-loading-line { width: 100%; height: 12px; border-radius: 6px; margin-top: 16px; }
    .detail-loading-line.wide { width: 92%; height: 18px; }
    .detail-loading-line.medium { width: 68%; }
    .detail-loading-post { height: 88px; border-radius: 12px; margin-top: 16px; }
    .shimmer { position: relative; overflow: hidden; background: #e6eadf; }
    .shimmer::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,.62), transparent); animation: shimmer 1.35s infinite; }
    @keyframes shimmer { to { transform: translateX(100%); } }
    .spinner { width: 40px; height: 40px; border: 4px solid #efe6ce; border-top-color: #26432b; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 900px) { .detail-layout { grid-template-columns: minmax(0, 1fr) 250px; gap: 20px; } .detail-loading-layout { grid-template-columns: minmax(0, 1fr) 250px; gap: 20px; } }
    @media (max-width: 768px) { .container { padding: 0 14px; } .detail-hero { min-height: 360px; } .detail-hero-inner { padding: 44px 14px; } .detail-layout { display: block; } .recent-posts { position: static; margin-top: 22px; padding: 20px 16px; } .recent-posts-grid { grid-template-columns: 1fr; } .recent-post { grid-template-columns: 76px minmax(0, 1fr); } .recent-post img, .recent-skeleton-image { width: 76px; height: 64px; } .detail-card { padding: 16px; border-radius: 18px; } .carousel-stage, .carousel-slide app-cloudinary-image { min-height: 0; height: clamp(210px, 58vw, 300px); } .detail-loading-layout { grid-template-columns: 1fr; margin-top: -18px; padding: 0 14px; } .detail-loading-side { display: none; } .latest-activities-return { align-items: flex-start; flex-direction: column; padding: 24px 20px; } .latest-activities-link { width: 100%; justify-content: center; } }
    @media (max-width: 480px) { .detail-hero h1 { font-size: 2rem; } .detail-kicker-row { gap: 8px; margin-bottom: 14px; } .activity-summary { padding: 16px; font-size: 1rem; } .detail-shell { margin-top: -18px; } .carousel-control { width: 36px; height: 36px; } .share-actions { grid-template-columns: 1fr; } .recent-posts { margin-top: 18px; } .latest-activities-return h2 { font-size: 1.3rem; } .latest-activities-return p { font-size: .82rem; } }
  `]
})
export class ActivityDetailComponent implements OnInit, OnDestroy {
  protected activity = signal<Activity | null>(null);
  protected recentActivities = signal<Activity[]>([]);
  protected recentPostsLoading = signal(true);
  protected readonly recentPostSkeletons = [1, 2];
  protected previousActivity = signal<Activity | null>(null);
  protected notFound = signal(false);
  protected activeImageIndex = signal(0);
  private imageRotationTimer?: ReturnType<typeof setInterval>;
  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.activity.set(null);
      this.notFound.set(false);
      this.recentPostsLoading.set(true);
      this.activeImageIndex.set(0);

      if (slug) {
        this.loadActivity(slug);
        this.loadRecentActivities(slug);
      } else {
        this.notFound.set(true);
        this.recentPostsLoading.set(false);
      }
    });
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

  private loadRecentActivities(currentSlug: string): void {
    this.activityService.getActivities().subscribe({
      next: (activities) => {
        const published = activities
          .filter(activity => activity.evidence_status === 'published')
          .sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
        const currentIndex = published.findIndex(activity => activity.slug === currentSlug || activity.id?.toString() === currentSlug);
        const currentPosition = currentIndex >= 0 ? currentIndex : 0;
        this.recentActivities.set(published.filter((_, index) => index !== currentPosition).slice(0, 2));
        this.previousActivity.set(currentIndex >= 0 ? published[currentIndex + 1] ?? null : published[1] ?? null);
        this.recentPostsLoading.set(false);
      },
      error: () => {
        this.recentActivities.set([]);
        this.previousActivity.set(null);
        this.recentPostsLoading.set(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopImageRotation();
    this.routeSubscription?.unsubscribe();
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

  protected getRecentImage(activity: Activity): string {
    return activity.featured_image || '/images/webimages/mushroom.png';
  }

  protected getDateText(dateValue?: string): string {
    if (!dateValue) {
      return 'Recent';
    }

    const parsed = new Date(dateValue);
    return Number.isNaN(parsed.getTime()) ? 'Recent' : parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  protected shareUrl(platform: 'facebook' | 'linkedin' | 'whatsapp'): string {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.activity()?.title || 'BRIDGE-AI activity');
    if (platform === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'linkedin') return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    return `https://wa.me/?text=${title}%20${url}`;
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
