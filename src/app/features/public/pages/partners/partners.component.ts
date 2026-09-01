// ============================================================
// BRIDGE-AI Kenya - Partners Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerService } from '../../../../services/partner.service';
import { Partner } from '../../../core/models/partner.model';
import { PartnerCardComponent } from '../../../shared/components/partner-card/partner-card.component';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, PartnerCardComponent, EuFundingBannerComponent],
  template: `
    <div class="partners-page">
      <div class="container">
        <h1 class="page-title">Our Partners</h1>

        <!-- Consortium Partners -->
        <section class="section">
          <h2 class="section-heading">Consortium Partners</h2>
          <div class="partners-grid">
            <app-partner-card
              *ngFor="let partner of consortiumPartners()"
              [partner]="partner"
            ></app-partner-card>
          </div>
        </section>

        <!-- Local Partners -->
        <section class="section">
          <h2 class="section-heading">Ecosystem Partners</h2>
          <div *ngIf="localPartners().length === 0" class="empty-state">
            <p>No local partners added yet.</p>
          </div>
          <div class="partners-grid">
            <app-partner-card
              *ngFor="let partner of localPartners()"
              [partner]="partner"
            ></app-partner-card>
          </div>
        </section>

        <div class="eu-section">
          <app-eu-funding-banner></app-eu-funding-banner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .partners-page {
      padding: 48px 0 64px 0;
      background: #f8fafc;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 32px 0;
    }

    .section {
      margin-bottom: 40px;
    }

    .section-heading {
      font-size: 22px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    .partners-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .empty-state {
      padding: 24px;
      background: #ffffff;
      border-radius: 8px;
      text-align: center;
      color: #6b7280;
    }

    .eu-section {
      margin-top: 32px;
    }

    @media (max-width: 1024px) {
      .partners-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .partners-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .partners-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PartnersComponent implements OnInit {
  protected consortiumPartners = signal<Partner[]>([]);
  protected localPartners = signal<Partner[]>([]);

  constructor(private partnerService: PartnerService) {}

  ngOnInit(): void {
    this.loadPartners();
  }

  private loadPartners(): void {
    this.partnerService.getPublishedPartners().subscribe({
      next: (partners) => {
        this.consortiumPartners.set(partners.filter(p => p.is_consortium));
        this.localPartners.set(partners.filter(p => !p.is_consortium));
      },
      error: () => {
        this.consortiumPartners.set([]);
        this.localPartners.set([]);
      }
    });
  }
}