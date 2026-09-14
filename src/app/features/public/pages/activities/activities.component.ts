// ============================================================
// BRIDGE-AI - Activities Component
// ============================================================

import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { Activity } from '../../../core/models/activity.model';

type ActivityFilters = {
  wp: string;
  type: string;
  year: string;
};

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="activities-page">
      <section class="activities-banner" aria-labelledby="activities-title">
        <h1 id="activities-title">News &amp; Articles</h1>
      </section>

      <section class="activities-intro">
        <div>
          <h2>Follow <span>Bridge-AI</span> Journey</h2>
          <p>Stay informed about the latest developments, activities, and achievements of the Bridge-AI project.</p>
          <p>From project meetings and workshops to pilot activities and major milestones, this section brings together all project news and upcoming events.</p>
        </div>
        <img src="/images/webimages/tunisapome.png" alt="Agricultural field work supporting BRIDGE-AI activities" title="BRIDGE-AI field activities" />
      </section>

      <section class="filter-section" id="filters">
        <div class="filter-container">
          <div class="filter-group">
            <span class="filter-label">Filter</span>

            <div class="custom-dropdown">
              <button type="button" class="dropdown-trigger" [class.open]="wpOpen" (click)="$event.stopPropagation(); toggleDropdown('wp')">
                <span>{{ selectedFilters.wp || 'All Work Packages' }}</span>
                <span class="dropdown-arrow">&#9662;</span>
              </button>
              <ul class="dropdown-menu" [class.open]="wpOpen">
                <li (click)="setFilter('wp', '')">All Work Packages</li>
                @for (wp of wpOptions; track wp) {
                  <li (click)="setFilter('wp', wp)" [class.active]="selectedFilters.wp === wp">{{ wp }}</li>
                }
              </ul>
            </div>

            <div class="custom-dropdown">
              <button type="button" class="dropdown-trigger" [class.open]="typeOpen" (click)="$event.stopPropagation(); toggleDropdown('type')">
                <span>{{ selectedFilters.type || 'All Activity Types' }}</span>
                <span class="dropdown-arrow">&#9662;</span>
              </button>
              <ul class="dropdown-menu" [class.open]="typeOpen">
                <li (click)="setFilter('type', '')">All Activity Types</li>
                @for (type of typeOptions; track type) {
                  <li (click)="setFilter('type', type)" [class.active]="selectedFilters.type === type">{{ formatTypeLabel(type) }}</li>
                }
              </ul>
            </div>

            <div class="custom-dropdown">
              <button type="button" class="dropdown-trigger" [class.open]="yearOpen" (click)="$event.stopPropagation(); toggleDropdown('year')">
                <span>{{ selectedFilters.year || 'All Years' }}</span>
                <span class="dropdown-arrow">&#9662;</span>
              </button>
              <ul class="dropdown-menu" [class.open]="yearOpen">
                <li (click)="setFilter('year', '')">All Years</li>
                @for (year of yearOptions; track year) {
                  <li (click)="setFilter('year', year)" [class.active]="selectedFilters.year === year">{{ year }}</li>
                }
              </ul>
            </div>
          </div>

          <div class="filter-actions">
            <label class="sort-control">
              <span>Sort</span>
              <select [value]="sortOrder" (change)="setSortOrder($any($event.target).value)">
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
            @if (hasActiveFilters()) {
              <span class="filter-active-count">Active Filters</span>
            }
            <button type="button" class="filter-clear" (click)="clearFilters()">
              <i class="fas fa-times"></i> Clear
            </button>
          </div>
        </div>
      </section>

      <section class="activities-section" id="activities">
        <div class="container">
          <div class="section-header reveal">
            <h2>Latest <span class="highlight">Activities</span></h2>
            <p>News, events, and field updates from the BRIDGE-AI consortium.</p>
          </div>

          <div class="activities-grid">
            @if (isLoading()) {
              @for (placeholder of skeletonCards; track placeholder) {
                <article class="activity-card activity-skeleton" aria-hidden="true">
                  <div class="skeleton-image shimmer"></div>
                  <div class="skeleton-body">
                    <div class="skeleton-meta shimmer"></div>
                    <div class="skeleton-title shimmer"></div>
                    <div class="skeleton-line shimmer"></div>
                    <div class="skeleton-line short shimmer"></div>
                    <div class="skeleton-footer shimmer"></div>
                  </div>
                </article>
              }
            } @else if (filteredActivities().length > 0) {
              @for (activity of filteredActivities(); track trackByActivity($index, activity); let first = $first) {
                <article class="activity-card reveal" [class.featured-card]="first">
                  <div class="card-image">
                    <img [src]="getActivityImage(activity)" [alt]="activity.title" loading="lazy" />
                    @if (activity.wp_tag) {
                      <span class="image-tag">{{ activity.wp_tag }}</span>
                    }
                  </div>

                  <div class="card-body">
                    <div class="card-meta">
                      @if (first) {
                        <span class="featured-label">Featured update</span>
                      }
                      <span class="meta-date">{{ getDateText(activity.date) }}</span>
                      @if (activity.wp_tag) {
                        <span class="meta-tag wp">{{ activity.wp_tag }}</span>
                      }
                      @if (activity.audience) {
                        <span class="meta-tag audience">{{ activity.audience | titlecase }}</span>
                      }
                      @if (activity.activity_type) {
                        <span class="meta-tag type">{{ formatTypeLabel(activity.activity_type) }}</span>
                      }
                    </div>

                    <h3>
                      <a [routerLink]="['/activities', activity.slug || activity.id]">{{ activity.title }}</a>
                    </h3>

                    <p class="card-summary">
                      {{ getSummary(activity) }}
                    </p>

                    <div class="card-footer">
                      @if (activity.location) {
                        <span class="card-location"><i class="fas fa-map-pin"></i> {{ activity.location }}</span>
                      }
                      <a [routerLink]="['/activities', activity.slug || activity.id]" class="card-link">
                        Read More <i class="fas fa-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </article>
              }
            } @else {
              <div class="empty-state">
                <span class="empty-icon"><i class="fas fa-newspaper"></i></span>
                <h3>No Activities Found</h3>
                <p>There are no activities matching your filters. Try clearing the filters or check back later.</p>
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      color: #2d3d35;
      background: #f7f2e6;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    * { box-sizing: border-box; }
    img { max-width: 100%; display: block; }
    a { text-decoration: none; }

    .container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    .activities-banner { min-height: 108px; display: grid; place-items: center; padding: 24px; background: #818528; }
    .activities-banner h1 { margin: 0; color: #fff; font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 600; }
    .activities-intro { max-width: 1180px; margin: 0 auto; padding: 60px 38px 54px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(300px, 460px); align-items: center; gap: clamp(40px, 8vw, 100px); background: #fff; }
    .activities-intro h2 { margin: 0 0 22px; color: #343b40; font-size: clamp(1.45rem, 2.6vw, 2rem); font-weight: 500; line-height: 1.2; }
    .activities-intro h2 span { color: #818528; }
    .activities-intro p { max-width: 590px; margin: 0 0 14px; color: #687278; font-size: .9rem; line-height: 1.7; }
    .activities-intro img { display: block; width: 100%; aspect-ratio: 1.55; object-fit: cover; border-radius: 24px; }
    .hero { display: none; }
    .hero-image-wrapper { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
    .hero-slide-bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0; filter: none; transition: opacity 1.2s ease; }
    .hero-slide-bg.active { opacity: 1; animation: hero-zoom 8s ease-in-out both; }
    @keyframes hero-zoom { from { transform: scale(1); } to { transform: scale(1.06); } }
    .hero::after { content: ''; position: absolute; inset: 0; background: rgba(22, 40, 26, 0.52); z-index: 1; }
    .hero-grid { position: relative; z-index: 2; width: 100%; max-width: 1280px; display: flex; align-items: center; gap: 48px; padding: 60px 28px; }
    .hero-left { flex: 1 1 50%; text-align: left; }
    .hero-right { display: none; }
    .hero-left h1 { font-size: 3.6rem; font-weight: 900; line-height: 1.08; letter-spacing: -0.02em; color: #fff; margin: 0 0 12px; text-shadow: 0 4px 30px rgba(0,0,0,0.35); }
    .hero-left .highlight { color: #c89be8; }
    .hero-sub { font-size: 1.12rem; color: rgba(255,255,255,0.8); margin: 0 0 8px; letter-spacing: 0.02em; }
    .hero-description { max-width: 560px; font-size: 1.02rem; line-height: 1.8; color: rgba(255,255,255,0.76); margin: 16px 0 28px; }
    .hero-buttons { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .btn-primary, .btn-secondary, .filter-clear, .card-link { display: inline-flex; align-items: center; justify-content: center; gap: 10px; border-radius: 50px; font-weight: 600; transition: all 0.25s ease; }
    .btn-primary { background: #26432b; color: #f7f2e6; padding: 14px 32px; border: none; text-decoration: none; }
    .btn-primary:hover { background: #16281a; transform: translateY(-3px); }
    .btn-secondary { background: transparent; color: #fff; padding: 14px 32px; border: 1.5px solid rgba(255,255,255,0.3); text-decoration: none; }
    .btn-secondary:hover { background: rgba(255,255,255,0.08); transform: translateY(-3px); }
    .filter-section { position: sticky; top: var(--site-header-offset, 80px); z-index: 40; background: #818528; border-bottom: 1px solid #73771f; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .filter-container { max-width: 1280px; margin: 0 auto; padding: 16px 28px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; }
    .filter-group { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px; }
    .filter-label { font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase; color: #fff; font-weight: 600; }
    .custom-dropdown { position: relative; min-width: 130px; }
    .dropdown-trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; padding: 7px 14px; background: #fffdf7; border: 1px solid #e1d8c0; border-radius: 50px; font-size: 0.75rem; font-weight: 500; color: #2d3d35; cursor: pointer; }
    .dropdown-arrow { font-size: 0.55rem; color: #6e7767; }
    .dropdown-menu { position: absolute; top: calc(100% + 4px); left: 0; right: 0; min-width: 150px; max-height: 180px; overflow-y: auto; background: #fffdf7; border: 1px solid #e1d8c0; border-radius: 10px; padding: 4px 0; box-shadow: 0 12px 40px rgba(0,0,0,0.08); opacity: 0; visibility: hidden; transform: translateY(-4px); transition: all 0.25s ease; list-style: none; z-index: 1000; }
    .dropdown-menu.open { opacity: 1; visibility: visible; transform: translateY(0); }
    .dropdown-menu li { padding: 6px 14px; font-size: 0.75rem; color: #2d3d35; cursor: pointer; list-style: none; }
    .dropdown-menu li:hover, .dropdown-menu li.active { background: rgba(124, 79, 163, 0.09); color: #5b3878; font-weight: 600; }
    .filter-actions { display: flex; align-items: center; gap: 8px; }
    .sort-control { display: inline-flex; align-items: center; gap: 7px; padding: 6px 8px 6px 12px; border: 1px solid #e1d8c0; border-radius: 50px; background: #fffdf7; color: #6e7767; font-size: .62rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
    .sort-control select { border: 0; outline: 0; padding: 1px 18px 1px 2px; background: transparent; color: #26432b; font: 600 .72rem 'Inter', sans-serif; cursor: pointer; }
    .sort-control:focus-within { border-color: #c89b3c; box-shadow: 0 0 0 2px rgba(200,155,60,.16); }
    .filter-active-count { display: inline-block; font-size: 0.62rem; font-weight: 600; color: #5b3878; background: rgba(124, 79, 163, 0.09); padding: 3px 12px; border-radius: 50px; }
    .filter-clear { padding: 6px 16px; background: #efe6ce; border: 1px solid #e1d8c0; color: #2d3d35; cursor: pointer; }
    .filter-clear:hover { background: #26432b; color: #f7f2e6; }
    .activities-section { padding: 44px 0 64px; background: #fff; }
    .section-header { max-width: 720px; margin: 0 auto 48px; text-align: center; }
    .section-header h2 { font-size: 2.8rem; font-weight: 800; color: #17241b; line-height: 1.08; letter-spacing: -0.02em; margin: 0; }
    .section-header .highlight { color: #818528; }
    .section-header p { margin-top: 14px; font-size: 1.05rem; color: #6e7767; }
    .activities-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 360px)); justify-content: center; gap: 24px; align-items: stretch; max-width: 1180px; margin: 0 auto; }
    .activity-card { min-width: 0; display: flex; flex-direction: column; background: #fffdf7; border: 1px solid rgba(255,255,255,.55); border-radius: 22px; overflow: hidden; box-shadow: 0 12px 28px rgba(22,40,26,.1); transition: transform 0.35s ease, box-shadow 0.35s ease; }
    .activity-card:hover { transform: translateY(-6px); box-shadow: 0 24px 50px rgba(22,40,26,.18); }
    .activity-card.featured-card { grid-column: auto; display: flex; min-height: 0; background: #fff; border-color: #e1e5e1; }
    .activity-card.featured-card .card-image { height: auto; min-height: 0; }
    .activity-card.featured-card .card-body { min-height: 0; padding: 18px 16px 0; background: #fff; }
    .activity-card.featured-card .card-body h3 a { color: #17241b; font-size: 1.1rem; }
    .activity-card.featured-card .card-summary { color: #6e7767; font-size: .78rem; }
    .activity-card.featured-card .card-footer { border-top-color: #e1d8c0; }
    .activity-card.featured-card .meta-date, .activity-card.featured-card .card-location { color: #6e7767; }
    .card-image { position: relative; height: 210px; overflow: hidden; background: #16281a; }
    .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
    .activity-card:hover .card-image img { transform: scale(1.05); }
    .image-tag { position: absolute; top: 12px; right: 12px; background: rgba(22, 40, 26, 0.8); color: #f7f2e6; padding: 3px 14px; border-radius: 50px; font-size: 0.58rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .card-body { padding: 16px 16px 0; display: flex; flex-direction: column; min-height: 190px; }
    .card-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 10px; }
    .featured-label { color: #d8e86b; font: 600 .62rem 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; margin-right: 4px; }
    .meta-date { font-size: 0.65rem; color: #6e7767; font-weight: 500; }
    .meta-tag { display: inline-block; border-radius: 50px; padding: 2px 10px; font-size: 0.52rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    .meta-tag.wp { background: rgba(124, 79, 163, 0.09); color: #5b3878; }
    .meta-tag.audience { background: rgba(190, 90, 43, 0.1); color: #be5a2b; }
    .meta-tag.type { background: #efe6ce; color: #26432b; }
    .card-body h3 { margin: 0 0 8px; font-size: 1.1rem; font-weight: 700; line-height: 1.3; }
    .card-body h3 a { color: #17241b; }
    .card-summary { margin: 0 0 14px; flex: 1; font-size: 0.88rem; line-height: 1.7; color: #6e7767; }
    .card-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding: 14px 0 20px; border-top: 1px solid #e1d8c0; }
    .card-location { display: inline-flex; align-items: center; gap: 4px; font-size: 0.7rem; color: #6e7767; }
    .card-link { font-size: 0.75rem; font-weight: 600; color: #26432b; gap: 6px; text-decoration: none; }
    .card-link:hover { gap: 12px; color: #16281a; }
    .activity-skeleton { pointer-events: none; }
    .shimmer { position: relative; overflow: hidden; background: #e6eadf; }
    .shimmer::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, rgba(255,255,255,.62), transparent); animation: shimmer 1.35s infinite; }
    @keyframes shimmer { to { transform: translateX(100%); } }
    .skeleton-image { height: 176px; }
    .skeleton-body { padding: 18px 18px 20px; }
    .skeleton-meta { width: 42%; height: 10px; border-radius: 5px; margin-bottom: 18px; }
    .skeleton-title { width: 86%; height: 17px; border-radius: 5px; margin-bottom: 16px; }
    .skeleton-line { width: 100%; height: 10px; border-radius: 5px; margin-bottom: 10px; }
    .skeleton-line.short { width: 72%; }
    .skeleton-footer { width: 58%; height: 10px; border-radius: 5px; margin-top: 16px; }
    .empty-state { width: 100%; grid-column: 1 / -1; text-align: center; padding: 70px 20px; background: #efe6ce; border-radius: 24px; border: 2px dashed #e1d8c0; }
    .empty-state .empty-icon { display: block; margin-bottom: 16px; font-size: 2.6rem; color: #26432b; opacity: 0.3; }
    .empty-state h3 { margin: 0 0 6px; font-size: 1.3rem; color: #17241b; }
    .empty-state p { max-width: 400px; margin: 0 auto; color: #6e7767; }
    @media (max-width: 1024px) { .activities-intro { gap: 36px; } .section-header h2 { font-size: 2.2rem; } }
    @media (max-width: 768px) { .activities-intro { grid-template-columns: 1fr; padding: 44px 20px; } .activities-intro img { max-width: 560px; } .filter-container { padding: 0 16px; flex-direction: column; } .filter-group { justify-content: center; } .activities-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; max-width: 600px; } .section-header h2 { font-size: 1.8rem; } .section-header p { font-size: 0.95rem; } }
    @media (max-width: 480px) { .container { padding: 0 16px; } .hero-left h1 { font-size: 1.8rem; } .section-header h2 { font-size: 1.5rem; } .card-body { padding: 16px 18px 0; } .card-footer { flex-direction: column; align-items: flex-start; } .activities-grid { grid-template-columns: 1fr; } }
  `]
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  protected allActivities = signal<Activity[]>([]);
  protected filteredActivities = signal<Activity[]>([]);
  protected isLoading = signal(true);
  protected readonly skeletonCards = [1, 2, 3, 4, 5, 6];
  protected selectedFilters: ActivityFilters = { wp: '', type: '', year: '' };
  protected sortOrder: 'latest' | 'oldest' = 'latest';
  protected wpOptions: string[] = [];
  protected typeOptions: string[] = [];
  protected yearOptions: string[] = [];
  protected wpOpen = false;
  protected typeOpen = false;
  protected yearOpen = false;
  protected heroIndex = signal(0);
  protected heroImages = computed(() => {
    const images = this.allActivities().map(activity => activity.featured_image).filter((image): image is string => !!image);
    return images.length > 0 ? images : [this.fallbackImage];
  });
  private heroTimer?: number;

  protected readonly fallbackImage = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80';

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.loadActivities();
    this.syncStickyOffset();
    window.addEventListener('resize', this.syncStickyOffset.bind(this));
    document.addEventListener('click', this.handleDocumentClick);
    this.heroTimer = window.setInterval(() => {
      this.heroIndex.update(index => (index + 1) % this.heroImages().length);
    }, 7000);
  }

  ngOnDestroy(): void {
    if (this.heroTimer) window.clearInterval(this.heroTimer);
    document.removeEventListener('click', this.handleDocumentClick);
  }

  private syncStickyOffset(): void {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const headerHeight = header ? header.offsetHeight : 92;
    document.documentElement.style.setProperty('--site-header-offset', `${headerHeight}px`);
  }

  private handleDocumentClick = (): void => {
    this.wpOpen = false;
    this.typeOpen = false;
    this.yearOpen = false;
  };

  private loadActivities(): void {
    this.activityService.getActivities().subscribe({
      next: (activities) => {
        const published = activities.filter((a) => a.evidence_status === 'published');
        this.allActivities.set(published);
        this.updateFilterOptions(published);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: () => {
        this.allActivities.set([]);
        this.filteredActivities.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private updateFilterOptions(activities: Activity[]): void {
    this.wpOptions = this.getAvailableValues(activities.map((activity) => activity.wp_tag));
    this.typeOptions = this.getAvailableValues(activities.map((activity) => activity.activity_type));
    this.yearOptions = Array.from(new Set(activities
      .map((activity) => this.getActivityYear(activity.date))
      .filter((year): year is string => !!year)))
      .sort((first, second) => Number(second) - Number(first));
  }

  protected toggleDropdown(key: 'wp' | 'type' | 'year'): void {
    this.wpOpen = key === 'wp' ? !this.wpOpen : false;
    this.typeOpen = key === 'type' ? !this.typeOpen : false;
    this.yearOpen = key === 'year' ? !this.yearOpen : false;
  }

  protected setFilter(key: 'wp' | 'type' | 'year', value: string): void {
    this.selectedFilters[key] = value;
    this.applyFilters();
    this.closeDropdowns();
  }

  protected clearFilters(): void {
    this.selectedFilters = { wp: '', type: '', year: '' };
    this.applyFilters();
    this.closeDropdowns();
  }

  protected setSortOrder(order: string): void {
    this.sortOrder = order === 'oldest' ? 'oldest' : 'latest';
    this.applyFilters();
  }

  protected getActivityImage(activity: Activity): string {
    return activity.featured_image || this.fallbackImage;
  }

  protected getSummary(activity: Activity): string {
    if (activity.summary) {
      return activity.summary;
    }

    if (activity.body) {
      const stripped = activity.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      return stripped.length > 140 ? `${stripped.slice(0, 140)}...` : stripped;
    }

    return 'Explore this BRIDGE-AI update and keep up with the latest field progress.';
  }

  protected hasActiveFilters(): boolean {
    return Object.values(this.selectedFilters).some((value) => value && value.length > 0);
  }

  protected countType(type: string): number {
    return this.allActivities().filter((activity) => activity.activity_type === type).length;
  }

  protected activityTypeLabels(): string[] {
    const typeMap = new Map<string, string>([
      ['training', 'Training'],
      ['workshop', 'Workshops'],
      ['meeting', 'Meetings'],
      ['field_demo', 'Field Demos'],
      ['community_engagement', 'Community'],
      ['event', 'Events']
    ]);

    const labels = Array.from(new Set(this.allActivities().map((activity) => activity.activity_type).filter(Boolean)))
      .sort();
    return labels.slice(0, 6).map((label) => typeMap.get(label) || this.formatTypeLabel(label));
  }

  protected getTypeColor(type: string): string {
    const palette: Record<string, string> = {
      Training: '#C89BE8',
      Workshops: '#7C4FA3',
      Meetings: '#BE5A2B',
      'Field Demos': '#3E6B45',
      Community: '#D4B06A',
      Events: '#26432B'
    };

    return palette[type] || '#C89BE8';
  }

  protected formatTypeLabel(value: string): string {
    return value
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  protected getTypeDescription(type: string): string {
    const descriptions: Record<string, string> = {
      Training: 'Learning sessions and capacity-building activities.',
      Workshops: 'Practical group sessions and co-design activities.',
      Meetings: 'Stakeholder and project coordination updates.',
      'Field Demos': 'Hands-on demonstrations in the field.',
      Community: 'Farmer and local engagement outreach.',
      Events: 'Special events, launches, and showcases.'
    };

    return descriptions[type] || 'Project activities and implementation updates.';
  }

  protected getDateText(dateValue?: string): string {
    if (!dateValue) {
      return 'Recent';
    }

    const parsed = new Date(dateValue);
    return Number.isNaN(parsed.getTime()) ? 'Recent' : parsed.toISOString().slice(0, 10);
  }

  protected trackByActivity = (_: number, activity: Activity): string => activity.slug || activity.id?.toString() || activity.title;

  private closeDropdowns(): void {
    this.wpOpen = false;
    this.typeOpen = false;
    this.yearOpen = false;
  }

  private applyFilters(): void {
    let filtered = [...this.allActivities()];

    if (this.selectedFilters.wp) {
      filtered = filtered.filter((activity) => this.matchesFilter(activity.wp_tag, this.selectedFilters.wp));
    }

    if (this.selectedFilters.type) {
      filtered = filtered.filter((activity) => this.matchesFilter(activity.activity_type, this.selectedFilters.type));
    }

    if (this.selectedFilters.year) {
      filtered = filtered.filter((activity) => this.getActivityYear(activity.date) === this.selectedFilters.year);
    }

    filtered.sort((a, b) => {
      const ad = a.date ? new Date(a.date).getTime() : 0;
      const bd = b.date ? new Date(b.date).getTime() : 0;
      return this.sortOrder === 'latest' ? bd - ad : ad - bd;
    });
    this.filteredActivities.set(filtered);
  }

  private getAvailableValues(values: Array<string | undefined>): string[] {
    return Array.from(new Set(values
      .map((value) => value?.trim())
      .filter((value): value is string => !!value)))
      .sort((first, second) => first.localeCompare(second));
  }

  private matchesFilter(value: string | undefined, selectedValue: string): boolean {
    return this.normalizeFilterValue(value) === this.normalizeFilterValue(selectedValue);
  }

  private normalizeFilterValue(value: string | undefined): string {
    return (value || '').trim().toLowerCase().replace(/[_-]+/g, ' ');
  }

  private getActivityYear(dateValue?: string): string | null {
    const match = dateValue?.trim().match(/^(\d{4})/);
    return match ? match[1] : null;
  }
}
