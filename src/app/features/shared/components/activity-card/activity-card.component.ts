// ============================================================
// BRIDGE-AI Kenya - Activity Card Component
// ============================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Activity } from '../../../core/models/activity.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { CloudinaryImageComponent } from '../cloudinary-image/cloudinary-image.component';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncatePipe, CloudinaryImageComponent],
  template: `
    <div class="activity-card">
      <div class="activity-image">
        <app-cloudinary-image
          *ngIf="activity.featured_image"
          [publicId]="activity.featured_image"
          [alt]="activity.title"
          [width]="400"
          [height]="220"
          crop="fill"
          quality="auto"
        ></app-cloudinary-image>
        <div *ngIf="!activity.featured_image" class="image-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <span class="wp-tag" [style.background]="getWpColor(activity.wp_tag)">
          {{ activity.wp_tag }}
        </span>
      </div>
      <div class="activity-content">
        <h3 class="activity-title">
          <a [routerLink]="['/activities', activity.slug]">{{ activity.title }}</a>
        </h3>
        <p class="activity-summary">{{ activity.summary || activity.body | truncate:120 }}</p>
        <div class="activity-meta">
          <span class="activity-date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {{ activity.date | date:'dd MMM yyyy' }}
          </span>
          <span *ngIf="activity.activity_type" class="activity-type">{{ activity.activity_type }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .activity-card {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid #f3f4f6;
    }

    .activity-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .activity-image {
      position: relative;
      height: 200px;
      overflow: hidden;
      background: #f3f4f6;
    }

    .activity-image app-cloudinary-image {
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

    .wp-tag {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      color: #ffffff;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .activity-content {
      padding: 16px;
    }

    .activity-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
      line-height: 1.4;
    }

    .activity-title a {
      color: #1f2937;
      text-decoration: none;
      transition: color 0.2s;
    }

    .activity-title a:hover {
      color: #3b82f6;
    }

    .activity-summary {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
      margin: 0 0 12px 0;
    }

    .activity-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;
      color: #9ca3af;
    }

    .activity-date {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .activity-type {
      padding: 2px 8px;
      background: #f3f4f6;
      border-radius: 4px;
      color: #6b7280;
    }
  `]
})
export class ActivityCardComponent {
  @Input() activity!: Activity;

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