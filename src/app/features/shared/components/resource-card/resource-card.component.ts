// ============================================================
// BRIDGE-AI Kenya - Resource Card Component
// ============================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Resource } from '../../../core/models/resource.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-resource-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncatePipe],
  template: `
    <div class="resource-card">
      <div class="resource-icon" [style.background]="getResourceColor(resource.resource_type)">
        <span class="icon">{{ getResourceIcon(resource.resource_type) }}</span>
      </div>
      <div class="resource-content">
        <h4 class="resource-title">
          <a [routerLink]="['/resources', resource.slug]">{{ resource.title }}</a>
        </h4>
        <p class="resource-description">{{ resource.description | truncate:80 }}</p>
        <div class="resource-meta">
          <span class="resource-type">{{ resource.resource_type | titlecase }}</span>
          <span *ngIf="resource.file_path" class="resource-size">
            <span class="dot">•</span>
            File
          </span>
          <span *ngIf="resource.download_count !== undefined" class="resource-downloads">
            <span class="dot">•</span>
            {{ resource.download_count }} downloads
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .resource-card {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #f3f4f6;
      transition: all 0.3s ease;
      align-items: flex-start;
    }

    .resource-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-color: #e5e7eb;
    }

    .resource-icon {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .resource-content {
      flex: 1;
      min-width: 0;
    }

    .resource-title {
      font-size: 15px;
      font-weight: 600;
      margin: 0 0 4px 0;
      line-height: 1.4;
    }

    .resource-title a {
      color: #1f2937;
      text-decoration: none;
      transition: color 0.2s;
    }

    .resource-title a:hover {
      color: #3b82f6;
    }

    .resource-description {
      font-size: 13px;
      color: #6b7280;
      margin: 0 0 8px 0;
      line-height: 1.5;
    }

    .resource-meta {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #9ca3af;
      flex-wrap: wrap;
    }

    .resource-type {
      padding: 2px 8px;
      background: #f3f4f6;
      border-radius: 4px;
      color: #6b7280;
      text-transform: capitalize;
    }

    .dot {
      color: #d1d5db;
      margin: 0 4px;
    }

    .resource-size,
    .resource-downloads {
      color: #9ca3af;
    }
  `]
})
export class ResourceCardComponent {
  @Input() resource!: Resource;

  getResourceIcon(type: string): string {
    const iconMap: Record<string, string> = {
      'public-deliverable': '📄',
      'training-guide': '📘',
      'slide-deck': '📊',
      'video': '🎬',
      'policy-brief': '📋',
      'presentation': '📑',
      'report': '📈',
      'dataset': '💾',
      'code': '💻'
    };
    return iconMap[type] || '📄';
  }

  getResourceColor(type: string): string {
    const colorMap: Record<string, string> = {
      'public-deliverable': '#eff6ff',
      'training-guide': '#ecfdf5',
      'slide-deck': '#fffbeb',
      'video': '#fef2f2',
      'policy-brief': '#f5f3ff',
      'presentation': '#fefce8',
      'report': '#f0fdf4',
      'dataset': '#f0f9ff',
      'code': '#f8fafc'
    };
    return colorMap[type] || '#f3f4f6';
  }
}