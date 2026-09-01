// ============================================================
// BRIDGE-AI Kenya - Event Detail Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../../../../services/event.service';
import { Event } from '../../../core/models/event.model';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { CloudinaryImageComponent } from '../../../shared/components/cloudinary-image/cloudinary-image.component';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SafeHtmlPipe,
    CloudinaryImageComponent,
    EuFundingBannerComponent
  ],
  template: `
    <div class="event-detail-page">
      <div class="container">
        <div *ngIf="event() as currentEvent; else loading">
          <div class="event-header">
            <div class="event-meta">
              <span class="status-tag" [class]="currentEvent.status">
                {{ currentEvent.status | titlecase }}
              </span>
              <span class="event-date">{{ currentEvent.date | date:'dd MMMM yyyy' }}</span>
              <span *ngIf="currentEvent.time" class="event-time">{{ currentEvent.time }}</span>
            </div>
            <h1 class="event-title">{{ currentEvent.title }}</h1>
            <div class="event-location-info">
              <span *ngIf="currentEvent.location" class="event-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {{ currentEvent.location }}
              </span>
              <span *ngIf="currentEvent.venue" class="event-venue">{{ currentEvent.venue }}</span>
            </div>
          </div>

          <div *ngIf="currentEvent.featured_image" class="featured-image">
            <app-cloudinary-image
              [publicId]="currentEvent.featured_image"
              [alt]="currentEvent.title"
              [width]="1200"
              [height]="400"
              crop="fill"
              quality="auto"
            ></app-cloudinary-image>
          </div>

          <div class="event-details-grid">
            <div class="event-main">
              <div class="content-card" *ngIf="currentEvent.description">
                <h2 class="section-heading">About This Event</h2>
                <div [innerHTML]="currentEvent.description | safeHtml"></div>
              </div>

              <div class="content-card" *ngIf="currentEvent.agenda">
                <h2 class="section-heading">Agenda</h2>
                <div [innerHTML]="currentEvent.agenda | safeHtml"></div>
              </div>

              <div class="content-card" *ngIf="currentEvent.speakers">
                <h2 class="section-heading">Speakers</h2>
                <div [innerHTML]="currentEvent.speakers | safeHtml"></div>
              </div>

              <div class="content-card" *ngIf="currentEvent.post_event_report">
                <h2 class="section-heading">Post-Event Report</h2>
                <div [innerHTML]="currentEvent.post_event_report | safeHtml"></div>
              </div>
            </div>

            <div class="event-sidebar">
              <div class="sidebar-card">
                <h3 class="sidebar-title">Event Details</h3>
                <div class="sidebar-item">
                  <span class="item-label">Date</span>
                  <span class="item-value">{{ currentEvent.date | date:'dd MMMM yyyy' }}</span>
                </div>
                <div *ngIf="currentEvent.time" class="sidebar-item">
                  <span class="item-label">Time</span>
                  <span class="item-value">{{ currentEvent.time }}</span>
                </div>
                <div *ngIf="currentEvent.location" class="sidebar-item">
                  <span class="item-label">Location</span>
                  <span class="item-value">{{ currentEvent.location }}</span>
                </div>
                <div *ngIf="currentEvent.venue" class="sidebar-item">
                  <span class="item-label">Venue</span>
                  <span class="item-value">{{ currentEvent.venue }}</span>
                </div>
                <div *ngIf="currentEvent.capacity" class="sidebar-item">
                  <span class="item-label">Capacity</span>
                  <span class="item-value">{{ currentEvent.capacity }} participants</span>
                </div>
                <div *ngIf="currentEvent.audience" class="sidebar-item">
                  <span class="item-label">Audience</span>
                  <span class="item-value">{{ currentEvent.audience }}</span>
                </div>
                <div *ngIf="currentEvent.registration_link" class="sidebar-actions">
                  <a [href]="currentEvent.registration_link" target="_blank" rel="noopener" class="btn-register">
                    Register Now
                  </a>
                </div>
              </div>

              <div *ngIf="currentEvent.gallery_images && currentEvent.gallery_images.length > 0" class="sidebar-card">
                <h3 class="sidebar-title">Gallery</h3>
                <div class="gallery-grid">
                  <app-cloudinary-image
                    *ngFor="let image of currentEvent.gallery_images"
                    [publicId]="image.image_path"
                    [alt]="image.caption || currentEvent.title"
                    [width]="100"
                    [height]="80"
                    crop="fill"
                    quality="auto"
                  ></app-cloudinary-image>
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
            <p>Loading event...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .event-detail-page {
      padding: 48px 0 64px 0;
      background: #f8fafc;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .event-header {
      margin-bottom: 24px;
    }

    .event-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .status-tag {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-tag.upcoming { background: #3b82f6; color: #ffffff; }
    .status-tag.ongoing { background: #22c55e; color: #ffffff; }
    .status-tag.completed { background: #6b7280; color: #ffffff; }
    .status-tag.cancelled { background: #ef4444; color: #ffffff; }

    .event-date, .event-time {
      font-size: 13px;
      color: #6b7280;
    }

    .event-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    .event-location-info {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 14px;
      color: #6b7280;
    }

    .event-location {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .event-venue {
      display: flex;
      align-items: center;
    }

    .featured-image {
      border-radius: 12px;
      overflow: hidden;
      margin: 24px 0 32px 0;
      background: #f3f4f6;
    }

    .featured-image app-cloudinary-image {
      width: 100%;
      height: 350px;
      display: block;
    }

    .event-details-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .event-main {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .content-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 28px;
      border: 1px solid #f3f4f6;
    }

    .section-heading {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 12px 0;
    }

    .content-card ::ng-deep p {
      font-size: 16px;
      color: #4b5563;
      line-height: 1.7;
      margin: 0 0 12px 0;
    }

    .content-card ::ng-deep ul,
    .content-card ::ng-deep ol {
      padding-left: 24px;
      margin: 0 0 12px 0;
    }

    .content-card ::ng-deep li {
      font-size: 15px;
      color: #4b5563;
      margin-bottom: 6px;
    }

    .event-sidebar {
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

    .btn-register {
      display: block;
      width: 100%;
      padding: 12px;
      background: #3b82f6;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      text-decoration: none;
      transition: background 0.2s;
    }

    .btn-register:hover {
      background: #2563eb;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .gallery-grid app-cloudinary-image {
      width: 100%;
      height: 80px;
      border-radius: 4px;
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
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .event-details-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .event-title {
        font-size: 26px;
      }

      .featured-image app-cloudinary-image {
        height: 220px;
      }
    }
  `]
})
export class EventDetailComponent implements OnInit {
  protected event = signal<Event | null>(null);

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadEvent(slug);
    }
  }

  private loadEvent(slug: string): void {
    this.eventService.getEventBySlug(slug).subscribe({
      next: (event) => {
        this.event.set(event);
      },
      error: () => {
        this.event.set(null);
      }
    });
  }
}