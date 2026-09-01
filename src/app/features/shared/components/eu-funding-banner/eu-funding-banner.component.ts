// ============================================================
// BRIDGE-AI Kenya - EU Funding Banner Component
// ============================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FUNDING, APP } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-eu-funding-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="eu-banner" [class.compact]="compact">
      <div class="eu-banner-container">
        <div class="eu-emblem">
          <img src="/assets/images/logos/eu_emblem.svg" alt="EU Emblem" class="eu-emblem-img" />
        </div>
        <div class="eu-content">
          <p class="eu-title">{{ fundingText }}</p>
          <p class="eu-grant">{{ grantText }}</p>
          <p *ngIf="!compact" class="eu-disclaimer">{{ disclaimer }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .eu-banner {
      background: #f8f9fa;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px 20px;
      margin: 16px 0;
    }

    .eu-banner.compact {
      padding: 8px 12px;
    }

    .eu-banner-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .eu-emblem {
      flex-shrink: 0;
    }

    .eu-emblem-img {
      height: 48px;
      width: auto;
    }

    .eu-banner.compact .eu-emblem-img {
      height: 32px;
    }

    .eu-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .eu-title {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .eu-banner.compact .eu-title {
      font-size: 12px;
    }

    .eu-grant {
      font-size: 12px;
      color: #4b5563;
      margin: 0;
    }

    .eu-banner.compact .eu-grant {
      font-size: 11px;
    }

    .eu-disclaimer {
      font-size: 11px;
      color: #6b7280;
      margin: 4px 0 0 0;
      line-height: 1.5;
    }

    @media (max-width: 640px) {
      .eu-banner {
        padding: 12px 16px;
      }

      .eu-banner-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .eu-emblem-img {
        height: 36px;
      }

      .eu-content {
        width: 100%;
      }
    }
  `]
})
export class EuFundingBannerComponent {
  @Input() compact: boolean = false;

  protected fundingText = FUNDING.EU_EMBLEM_TEXT;
  protected grantText = `Grant Agreement ${FUNDING.GRANT_AGREEMENT}`;
  protected disclaimer = FUNDING.DISCLAIMER;
}