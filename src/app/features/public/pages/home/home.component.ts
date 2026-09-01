// ============================================================
// BRIDGE-AI Kenya - Home Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { EventService } from '../../../../services/event.service';
import { Activity } from '../../../core/models/activity.model';
import { Event } from '../../../core/models/event.model';
import { ActivityCardComponent } from '../../../shared/components/activity-card/activity-card.component';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';
import { APP, FUNDING } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ActivityCardComponent,
    EventCardComponent,
    EuFundingBannerComponent
  ],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-text">{{ grantNumber }}</span>
            </div>
            <h1 class="hero-title">{{ heroTitle }}</h1>
            <p class="hero-description">{{ heroDescription }}</p>
            <div class="hero-actions">
              <a [routerLink]="['/smart-mushrooms']" class="btn-primary">Explore Smart Mushroom Pilot</a>
              <a [routerLink]="['/activities']" class="btn-secondary">View Activities</a>
            </div>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">{{ activitiesCount }}</span>
              <span class="stat-label">Activities</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ eventsCount }}</span>
              <span class="stat-label">Events</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ partnersCount }}</span>
              <span class="stat-label">Partners</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ resourcesCount }}</span>
              <span class="stat-label">Resources</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Why It Matters -->
      <section class="section">
        <div class="container">
          <h2 class="section-title">Why It Matters</h2>
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 class="feature-title">Climate-Smart Farming</h3>
              <p class="feature-description">GenAI and IoT solutions for sustainable mushroom farming in Kenya.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 class="feature-title">Inclusive Digital Skills</h3>
              <p class="feature-description">Empowering youth, women, and SMEs with practical digital agriculture training.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 class="feature-title">African GenAI Capacity</h3>
              <p class="feature-description">Building local expertise in generative AI for agricultural innovation.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Latest Activities -->
      <section class="section section-alt">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Latest Activities</h2>
            <a [routerLink]="['/activities']" class="view-all">View All →</a>
          </div>
          <div class="activity-grid">
            <app-activity-card
              *ngFor="let activity of latestActivities()"
              [activity]="activity"
            ></app-activity-card>
          </div>
        </div>
      </section>

      <!-- Upcoming Events -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Upcoming Events</h2>
            <a [routerLink]="['/training-events']" class="view-all">View All →</a>
          </div>
          <div class="event-grid">
            <app-event-card
              *ngFor="let event of upcomingEvents()"
              [event]="event"
            ></app-event-card>
          </div>
        </div>
      </section>

      <!-- EU Funding Banner -->
      <section class="section">
        <div class="container">
          <app-eu-funding-banner></app-eu-funding-banner>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      padding-bottom: 48px;
    }

    .hero-section {
      background: linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%);
      color: #ffffff;
      padding: 60px 0 48px 0;
    }

    .hero-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .hero-content {
      max-width: 720px;
      margin: 0 auto;
      text-align: center;
    }

    .hero-badge {
      display: inline-block;
      padding: 4px 16px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }

    .badge-text {
      color: #93c5fd;
    }

    .hero-title {
      font-size: 38px;
      font-weight: 800;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }

    .hero-description {
      font-size: 18px;
      color: #cbd5e1;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-primary {
      padding: 12px 28px;
      background: #3b82f6;
      color: #ffffff;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-secondary {
      padding: 12px 28px;
      background: transparent;
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: border-color 0.2s;
    }

    .btn-secondary:hover {
      border-color: #ffffff;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      max-width: 800px;
      margin: 40px auto 0;
      padding-top: 32px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
    }

    .stat-label {
      font-size: 14px;
      color: #93c5fd;
    }

    .section {
      padding: 48px 0;
    }

    .section-alt {
      background: #f8fafc;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .view-all {
      font-size: 14px;
      font-weight: 500;
      color: #3b82f6;
      text-decoration: none;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-top: 24px;
    }

    .feature-card {
      padding: 24px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #f3f4f6;
      text-align: center;
      transition: box-shadow 0.3s ease;
    }

    .feature-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eff6ff;
      border-radius: 50%;
      color: #3b82f6;
    }

    .feature-icon svg {
      width: 24px;
      height: 24px;
    }

    .feature-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    .feature-description {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0;
    }

    .activity-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .event-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    @media (max-width: 1024px) {
      .activity-grid,
      .event-grid,
      .feature-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 28px;
      }

      .hero-description {
        font-size: 16px;
      }

      .hero-stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .stat-number {
        font-size: 22px;
      }

      .activity-grid,
      .event-grid,
      .feature-grid {
        grid-template-columns: 1fr;
      }

      .section-title {
        font-size: 22px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  protected heroTitle = APP.ACRONYM + ' Kenya at JKUAT';
  protected heroDescription = APP.DESCRIPTION;
  protected grantNumber = FUNDING.GRANT_AGREEMENT;

  protected latestActivities = signal<Activity[]>([]);
  protected upcomingEvents = signal<Event[]>([]);
  protected activitiesCount: number = 0;
  protected eventsCount: number = 0;
  protected partnersCount: number = 12;
  protected resourcesCount: number = 0;

  constructor(
    private activityService: ActivityService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.activityService.getActivities().subscribe({
      next: (activities) => {
        const published = activities.filter(a => a.evidence_status === 'published');
        this.activitiesCount = published.length;
        this.latestActivities.set(published.slice(0, 3));
      },
      error: () => {
        this.latestActivities.set([]);
      }
    });

    this.eventService.getEvents().subscribe({
      next: (events) => {
        const upcoming = events.filter(e => e.status === 'upcoming');
        this.eventsCount = events.length;
        this.upcomingEvents.set(upcoming.slice(0, 3));
      },
      error: () => {
        this.upcomingEvents.set([]);
      }
    });

    this.resourcesCount = 0;
  }
}