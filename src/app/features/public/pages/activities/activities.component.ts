// ============================================================
// BRIDGE-AI Kenya - Activities Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { Activity } from '../../../core/models/activity.model';

type ActivityFilters = {
  wp: string;
  audience: string;
  type: string;
  year: string;
};

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="activities-page">
      <section class="hero" id="heroSection">
        <div class="hero-image-wrapper">
          <div class="hero-slide-bg active" style="background-image: url('https://images.unsplash.com/photo-1585951237318-9ea5e175b891?auto=format&fit=crop&w=1600&q=80');"></div>
        </div>

        <div class="hero-grid">
          <div class="hero-left">
            <h1><span class="highlight">Activities</span> &amp; Field Updates</h1>
            <p class="hero-sub">Documenting the journey of BRIDGE-AI across Africa</p>
            <p class="hero-description">
              From pilot implementation to capacity building, stakeholder engagement, and real-world impact across agriculture in Africa. Explore the latest activities and training events from JKUAT and JHUB Africa.
            </p>
            <div class="hero-buttons">
              <a href="#activities" class="btn-primary">
                <i class="fas fa-arrow-right btn-icon"></i>
                Explore Activities
              </a>
              <a [routerLink]="['/gallery']" class="btn-secondary">
                <i class="fas fa-images btn-icon"></i>
                View Gallery
              </a>
            </div>
          </div>

          <div class="hero-right">
            <div class="activity-types-container">
              <div class="activity-types-header">
                <div>
                  <span class="activity-types-label">Activity Types</span>
                  <p class="activity-types-subtitle">BRIDGE-AI engagement areas</p>
                </div>
                <span class="activity-types-count-badge">{{ activityTypeLabels().length }} topics</span>
              </div>

              <div class="activity-types-list">
                @for (type of activityTypeLabels(); track type) {
                  <div class="activity-type-card">
                    <div class="type-header">
                      <span class="type-dot" [style.background]="getTypeColor(type)"></span>
                      <span class="type-name">{{ type }}</span>
                    </div>
                    <span class="type-count-badge">{{ countType(type) }}</span>
                    <p class="type-description">{{ getTypeDescription(type) }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="filter-section" id="filters">
        <div class="filter-container">
          <div class="filter-group">
            <span class="filter-label">Filter</span>

            <div class="custom-dropdown">
              <button type="button" class="dropdown-trigger" [class.open]="wpOpen" (click)="toggleDropdown('wp')">
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
              <button type="button" class="dropdown-trigger" [class.open]="audienceOpen" (click)="toggleDropdown('audience')">
                <span>{{ selectedFilters.audience || 'All Audiences' }}</span>
                <span class="dropdown-arrow">&#9662;</span>
              </button>
              <ul class="dropdown-menu" [class.open]="audienceOpen">
                <li (click)="setFilter('audience', '')">All Audiences</li>
                @for (audience of audienceOptions; track audience) {
                  <li (click)="setFilter('audience', audience)" [class.active]="selectedFilters.audience === audience">{{ audience | titlecase }}</li>
                }
              </ul>
            </div>

            <div class="custom-dropdown">
              <button type="button" class="dropdown-trigger" [class.open]="typeOpen" (click)="toggleDropdown('type')">
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
              <button type="button" class="dropdown-trigger" [class.open]="yearOpen" (click)="toggleDropdown('year')">
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
            <p>News, events, and field updates from BRIDGE-AI implementation at JKUAT</p>
          </div>

          <div class="activities-grid">
            @if (filteredActivities().length > 0) {
              @for (activity of filteredActivities(); track trackByActivity($index, activity)) {
                <article class="activity-card reveal">
                  <div class="card-image">
                    <img [src]="getActivityImage(activity)" [alt]="activity.title" loading="lazy" />
                    @if (activity.wp_tag) {
                      <span class="image-tag">{{ activity.wp_tag }}</span>
                    }
                  </div>

                  <div class="card-body">
                    <div class="card-meta">
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
                      <a [routerLink]="['/activities', activity.slug]">{{ activity.title }}</a>
                    </h3>

                    <p class="card-summary">
                      {{ getSummary(activity) }}
                    </p>

                    <div class="card-footer">
                      @if (activity.location) {
                        <span class="card-location"><i class="fas fa-map-pin"></i> {{ activity.location }}</span>
                      }
                      <a [routerLink]="['/activities', activity.slug]" class="card-link">
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
    .hero { position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; min-height: 85vh; background: #16281a; }
    .hero-image-wrapper { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
    .hero-slide-bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 1; filter: none; }
    .hero::after { content: ''; position: absolute; inset: 0; background: rgba(22, 40, 26, 0.52); z-index: 1; }
    .hero-grid { position: relative; z-index: 2; width: 100%; max-width: 1280px; display: flex; align-items: center; gap: 48px; padding: 60px 28px; }
    .hero-left { flex: 1 1 50%; text-align: left; }
    .hero-right { flex: 1 1 35%; }
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
    .activity-types-container { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px 28px; }
    .activity-types-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .activity-types-label { display: block; font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.45); font-weight: 600; }
    .activity-types-subtitle { margin: 4px 0 0; font-size: 0.85rem; color: rgba(255,255,255,0.75); }
    .activity-types-count-badge { display: inline-block; padding: 4px 12px; border: 1px solid rgba(255,255,255,0.09); border-radius: 50px; font-size: 0.6rem; color: rgba(255,255,255,0.5); white-space: nowrap; }
    .activity-types-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .activity-type-card { flex: 1 1 calc(50% - 4px); min-width: 120px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px 14px; }
    .type-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .type-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .type-name { font-size: 0.78rem; font-weight: 600; color: rgba(255,255,255,0.85); }
    .type-count-badge { display: inline-block; margin-bottom: 4px; padding: 2px 10px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.05); font-size: 0.56rem; color: rgba(255,255,255,0.45); }
    .type-description { margin: 0; font-size: 0.64rem; line-height: 1.5; color: rgba(255,255,255,0.45); }
    .filter-section { position: sticky; top: var(--site-header-offset, 80px); z-index: 40; background: rgba(255, 253, 247, 0.94); backdrop-filter: blur(12px); border-bottom: 1px solid #e1d8c0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .filter-container { max-width: 1280px; margin: 0 auto; padding: 16px 28px; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px; }
    .filter-group { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 6px; }
    .filter-label { font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase; color: #6e7767; font-weight: 600; }
    .custom-dropdown { position: relative; min-width: 130px; }
    .dropdown-trigger { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; padding: 7px 14px; background: #fffdf7; border: 1px solid #e1d8c0; border-radius: 50px; font-size: 0.75rem; font-weight: 500; color: #2d3d35; cursor: pointer; }
    .dropdown-arrow { font-size: 0.55rem; color: #6e7767; }
    .dropdown-menu { position: absolute; top: calc(100% + 4px); left: 0; right: 0; min-width: 150px; max-height: 180px; overflow-y: auto; background: #fffdf7; border: 1px solid #e1d8c0; border-radius: 10px; padding: 4px 0; box-shadow: 0 12px 40px rgba(0,0,0,0.08); opacity: 0; visibility: hidden; transform: translateY(-4px); transition: all 0.25s ease; list-style: none; z-index: 1000; }
    .dropdown-menu.open { opacity: 1; visibility: visible; transform: translateY(0); }
    .dropdown-menu li { padding: 6px 14px; font-size: 0.75rem; color: #2d3d35; cursor: pointer; list-style: none; }
    .dropdown-menu li:hover, .dropdown-menu li.active { background: rgba(124, 79, 163, 0.09); color: #5b3878; font-weight: 600; }
    .filter-actions { display: flex; align-items: center; gap: 8px; }
    .filter-active-count { display: inline-block; font-size: 0.62rem; font-weight: 600; color: #5b3878; background: rgba(124, 79, 163, 0.09); padding: 3px 12px; border-radius: 50px; }
    .filter-clear { padding: 6px 16px; background: #efe6ce; border: 1px solid #e1d8c0; color: #2d3d35; cursor: pointer; }
    .filter-clear:hover { background: #26432b; color: #f7f2e6; }
    .activities-section { padding: 44px 0 64px; background: #f7f2e6; }
    .section-header { max-width: 720px; margin: 0 auto 48px; text-align: center; }
    .section-header h2 { font-size: 2.8rem; font-weight: 800; color: #17241b; line-height: 1.08; letter-spacing: -0.02em; margin: 0; }
    .section-header .highlight { color: #26432b; }
    .section-header p { margin-top: 14px; font-size: 1.05rem; color: #6e7767; }
    .activities-grid { display: flex; flex-wrap: wrap; gap: 30px; justify-content: center; }
    .activity-card { flex: 1 1 calc(33.333% - 20px); min-width: 280px; max-width: 380px; background: #fffdf7; border: 1px solid #e1d8c0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: transform 0.35s ease, box-shadow 0.35s ease; }
    .activity-card:hover { transform: translateY(-6px); box-shadow: 0 24px 64px rgba(0,0,0,0.12); }
    .card-image { position: relative; height: 200px; overflow: hidden; background: #16281a; }
    .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
    .activity-card:hover .card-image img { transform: scale(1.05); }
    .image-tag { position: absolute; top: 12px; right: 12px; background: rgba(22, 40, 26, 0.8); color: #f7f2e6; padding: 3px 14px; border-radius: 50px; font-size: 0.58rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .card-body { padding: 22px 24px 0; display: flex; flex-direction: column; min-height: 220px; }
    .card-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 10px; }
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
    .empty-state { width: 100%; text-align: center; padding: 70px 20px; background: #efe6ce; border-radius: 24px; border: 2px dashed #e1d8c0; }
    .empty-state .empty-icon { display: block; margin-bottom: 16px; font-size: 2.6rem; color: #26432b; opacity: 0.3; }
    .empty-state h3 { margin: 0 0 6px; font-size: 1.3rem; color: #17241b; }
    .empty-state p { max-width: 400px; margin: 0 auto; color: #6e7767; }
    @media (max-width: 1024px) { .hero-grid { gap: 32px; padding: 40px 20px; } .hero-left h1 { font-size: 2.8rem; } .section-header h2 { font-size: 2.2rem; } .activity-card { flex: 1 1 calc(50% - 15px); max-width: none; } .hero-right { flex: 1 1 100%; } }
    @media (max-width: 768px) { .hero { min-height: auto; } .hero-grid { flex-direction: column; text-align: center; padding: 40px 16px; } .hero-left, .hero-right { flex: 1 1 100%; } .hero-left { text-align: center; } .hero-left h1 { font-size: 2.2rem; } .hero-sub { font-size: 1rem; } .hero-description { font-size: 0.92rem; max-width: 100%; } .hero-buttons { justify-content: center; flex-direction: column; width: 100%; } .hero-buttons .btn-primary, .hero-buttons .btn-secondary { width: 100%; } .filter-container { padding: 0 16px; flex-direction: column; } .filter-group { justify-content: center; } .activity-card { flex: 1 1 100%; max-width: 400px; } .activities-grid { gap: 20px; } .activity-type-card { flex: 1 1 100%; min-width: unset; } .section-header h2 { font-size: 1.8rem; } .section-header p { font-size: 0.95rem; } }
    @media (max-width: 480px) { .container { padding: 0 16px; } .hero-left h1 { font-size: 1.8rem; } .section-header h2 { font-size: 1.5rem; } .card-body { padding: 16px 18px 0; } .card-footer { flex-direction: column; align-items: flex-start; } }
  `]
})
export class ActivitiesComponent implements OnInit {
  protected allActivities = signal<Activity[]>([]);
  protected filteredActivities = signal<Activity[]>([]);
  protected selectedFilters: ActivityFilters = { wp: '', audience: '', type: '', year: '' };
  protected wpOptions: string[] = [];
  protected audienceOptions: string[] = [];
  protected typeOptions: string[] = [];
  protected yearOptions: string[] = [];
  protected wpOpen = false;
  protected audienceOpen = false;
  protected typeOpen = false;
  protected yearOpen = false;

  protected readonly fallbackImage = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80';

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.loadActivities();
    this.syncStickyOffset();
    window.addEventListener('resize', this.syncStickyOffset.bind(this));
    document.addEventListener('click', this.handleDocumentClick);
  }

  private syncStickyOffset(): void {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const headerHeight = header ? header.offsetHeight : 92;
    document.documentElement.style.setProperty('--site-header-offset', `${headerHeight}px`);
  }

  private handleDocumentClick = (): void => {
    this.wpOpen = false;
    this.audienceOpen = false;
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
      },
      error: () => {
        this.allActivities.set([]);
        this.filteredActivities.set([]);
      }
    });
  }

  private updateFilterOptions(activities: Activity[]): void {
    this.wpOptions = Array.from(new Set(activities.map((a) => a.wp_tag).filter(Boolean))).sort();
    this.audienceOptions = Array.from(new Set(activities.map((a) => a.audience).filter(Boolean))).sort();
    this.typeOptions = Array.from(new Set(activities.map((a) => a.activity_type).filter(Boolean))).sort();
    this.yearOptions = Array.from(new Set(activities.map((a) => a.date?.substring(0, 4)).filter(Boolean))).sort((a, b) => Number(b) - Number(a));
  }

  protected toggleDropdown(key: 'wp' | 'audience' | 'type' | 'year'): void {
    this.wpOpen = key === 'wp' ? !this.wpOpen : false;
    this.audienceOpen = key === 'audience' ? !this.audienceOpen : false;
    this.typeOpen = key === 'type' ? !this.typeOpen : false;
    this.yearOpen = key === 'year' ? !this.yearOpen : false;
  }

  protected setFilter(key: 'wp' | 'audience' | 'type' | 'year', value: string): void {
    this.selectedFilters[key] = value;
    this.applyFilters();
    this.closeDropdowns();
  }

  protected clearFilters(): void {
    this.selectedFilters = { wp: '', audience: '', type: '', year: '' };
    this.applyFilters();
    this.closeDropdowns();
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
      .replace('_', ' ')
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
    this.audienceOpen = false;
    this.typeOpen = false;
    this.yearOpen = false;
  }

  private applyFilters(): void {
    let filtered = [...this.allActivities()];

    if (this.selectedFilters.wp) {
      filtered = filtered.filter((activity) => activity.wp_tag === this.selectedFilters.wp);
    }

    if (this.selectedFilters.audience) {
      filtered = filtered.filter((activity) => activity.audience === this.selectedFilters.audience);
    }

    if (this.selectedFilters.type) {
      filtered = filtered.filter((activity) => activity.activity_type === this.selectedFilters.type);
    }

    if (this.selectedFilters.year) {
      filtered = filtered.filter((activity) => activity.date?.startsWith(this.selectedFilters.year));
    }

    filtered.sort((a, b) => {
      const ad = a.date ? new Date(a.date).getTime() : 0;
      const bd = b.date ? new Date(b.date).getTime() : 0;
      return bd - ad;
    });
    this.filteredActivities.set(filtered);
  }
}
