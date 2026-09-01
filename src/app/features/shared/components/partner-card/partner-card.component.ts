// ============================================================
// BRIDGE-AI Kenya - Partner Card Component
// ============================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Partner } from '../../../core/models/partner.model';

@Component({
  selector: 'app-partner-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="partner-card" [class.consortium]="partner.is_consortium">
      <div class="partner-logo">
        <img 
          *ngIf="partner.logo" 
          [src]="partner.logo" 
          [alt]="partner.name + ' logo'" 
          class="logo-img"
          appLazyLoad
        />
        <div *ngIf="!partner.logo" class="logo-placeholder">
          <span>{{ partner.short_name | slice:0:2 | uppercase }}</span>
        </div>
      </div>
      <div class="partner-info">
        <h4 class="partner-name">{{ partner.name }}</h4>
        <p class="partner-short">{{ partner.short_name }}</p>
        <p class="partner-country">{{ partner.country }}</p>
        <p *ngIf="partner.role" class="partner-role">{{ partner.role }}</p>
        <span *ngIf="partner.is_consortium" class="consortium-badge">Consortium</span>
        <span *ngIf="!partner.is_consortium" class="local-badge">Local Partner</span>
      </div>
    </div>
  `,
  styles: [`
    .partner-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #f3f4f6;
      transition: all 0.3s ease;
      text-align: center;
    }

    .partner-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .partner-card.consortium {
      border-color: #e5e7eb;
    }

    .partner-logo {
      width: 100px;
      height: 100px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f9fafb;
      border-radius: 50%;
      overflow: hidden;
    }

    .logo-img {
      max-width: 80%;
      max-height: 80%;
      object-fit: contain;
    }

    .logo-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #3b82f6;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
    }

    .partner-name {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 2px 0;
    }

    .partner-short {
      font-size: 12px;
      color: #6b7280;
      margin: 0 0 2px 0;
      font-weight: 500;
    }

    .partner-country {
      font-size: 12px;
      color: #9ca3af;
      margin: 0 0 4px 0;
    }

    .partner-role {
      font-size: 11px;
      color: #4b5563;
      margin: 0 0 8px 0;
    }

    .consortium-badge,
    .local-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .consortium-badge {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .local-badge {
      background: #f3f4f6;
      color: #6b7280;
    }
  `]
})
export class PartnerCardComponent {
  @Input() partner!: Partner;
}