// ============================================================
// BRIDGE-AI Kenya - Event Card Component
// ============================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Event } from '../../../core/models/event.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { CloudinaryImageComponent } from '../cloudinary-image/cloudinary-image.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncatePipe, CloudinaryImageComponent],
  template: `
    <div class="event-card" [class.completed]="event.status === 'completed'">
      <div class="event-image">
        <app-cloudinary-image
          *ngIf="event.featured_image"
          [publicId]="event.featured_image"
          [alt]="event.title"
          [width]="400"
          [height]="180"
          crop="fill"
          quality="auto"
        ></app-cloudinary-image>
        <div *ngIf="!event.featured_image" class="image-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <span class="status-tag" [class]="event.status">
          {{ event.status | titlecase }}
        </span>
      </div>
      <div class="event-content">
        <h3 class="event-title">
          <a [routerLink]="['/training-events', event.slug]">{{ event.title }}</a>
        </h3>
        <p class="event-description">{{ event.description | truncate:100 }}</p>
        <div class="event-meta">
          <span class="event-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {{ event.date | date:'dd MMM yyyy' }}
          </span>
          <span *ngIf="event.location" class="event-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {{ event.location }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .event-card {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid #f3f4f6;
    }

    .event-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .event-card.completed {
      opacity: 0.7;
    }

    .event-image {
      position: relative;
      height: 160px;
      overflow: hidden;
      background: #f3f4f6;
    }

    .event-image app-cloudinary-image {
      width: 100%;
      height: 100%;
      display: block;
    }

    .image-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #9ca3af;
      background: #f3f4f6;
    }

    .image-placeholder svg {
      width: 48px;
      height: 48px;
    }

    .status-tag {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-tag.upcoming {
      background: #3b82f6;
      color: #ffffff;
    }

    .status-tag.ongoing {
      background: #22c55e;
      color: #ffffff;
    }

    .status-tag.completed {
      background: #6b7280;
      color: #ffffff;
    }

    .status-tag.cancelled {
      background: #ef4444;
      color: #ffffff;
    }

    .event-content {
      padding: 16px;
    }

    .event-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }

    .event-title a {
      color: #1f2937;
      text-decoration: none;
      transition: color 0.2s;
    }

    .event-title a:hover {
      color: #3b82f6;
    }

    .event-description {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
      margin: 0 0 12px 0;
    }

    .event-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;
      color: #9ca3af;
      flex-wrap: wrap;
    }

    .event-date,
    .event-location {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `]
})
export class EventCardComponent {
  @Input() event!: Event;
}