// ============================================================
// BRIDGE-AI Kenya - Training WP5 Component
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-training-wp5',
  standalone: true,
  imports: [CommonModule, RouterModule, EuFundingBannerComponent],
  template: `
    <div class="training-wp5-page">
      <div class="container">
        <h1 class="page-title">Capacity Building and Replication</h1>
        <p class="page-subtitle">Work Package 5 - Led by JKUAT</p>

        <div class="content-section">
          <div class="content-card">
            <h2 class="section-heading">About WP5</h2>
            <p class="section-text">
              JKUAT leads WP5, which focuses on helping African SMEs, developers,
              universities and end-users use, adapt and scale GenAI solutions for
              agriculture. WP5 will support modular training kits, regional
              bootcamps, SME mentoring, open repositories, developer communities and
              replication playbooks.
            </p>
          </div>

          <div class="content-card">
            <h2 class="section-heading">Key Activities</h2>
            <div class="activity-tasks">
              <div class="task-item">
                <h4 class="task-title">Training Content Development</h4>
                <p class="task-description">Modular training kits and materials</p>
              </div>
              <div class="task-item">
                <h4 class="task-title">Local Training Bootcamps</h4>
                <p class="task-description">Hands-on training at JKUAT Smart Farm Zone</p>
              </div>
              <div class="task-item">
                <h4 class="task-title">SME Engagement and Mentoring</h4>
                <p class="task-description">Supporting local agritech SMEs</p>
              </div>
              <div class="task-item">
                <h4 class="task-title">Community Maintenance</h4>
                <p class="task-description">Open repositories and developer community</p>
              </div>
              <div class="task-item">
                <h4 class="task-title">Replication Toolkit</h4>
                <p class="task-description">Localisation playbooks and adoption pathways</p>
              </div>
            </div>
          </div>

          <div class="quick-links">
            <h2 class="section-heading">Quick Links</h2>
            <div class="links-grid">
              <a [routerLink]="['/training-events']" class="link-card">
                <span class="link-icon">📅</span>
                <span class="link-label">Training Events</span>
              </a>
              <a [routerLink]="['/training-materials']" class="link-card">
                <span class="link-icon">📚</span>
                <span class="link-label">Training Materials</span>
              </a>
              <a [routerLink]="['/sme-mentoring']" class="link-card">
                <span class="link-icon">🤝</span>
                <span class="link-label">SME Mentoring</span>
              </a>
              <a [routerLink]="['/community-practice']" class="link-card">
                <span class="link-icon">👥</span>
                <span class="link-label">Community of Practice</span>
              </a>
              <a [routerLink]="['/replication-toolkit']" class="link-card">
                <span class="link-icon">📋</span>
                <span class="link-label">Replication Toolkit</span>
              </a>
            </div>
          </div>
        </div>

        <div class="eu-section">
          <app-eu-funding-banner></app-eu-funding-banner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .training-wp5-page {
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
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 18px;
      color: #6b7280;
      margin: 0 0 32px 0;
    }

    .content-section {
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

    .section-text {
      font-size: 16px;
      color: #4b5563;
      line-height: 1.7;
      margin: 0;
    }

    .activity-tasks {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 8px;
    }

    .task-item {
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #f3f4f6;
    }

    .task-title {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .task-description {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }

    .quick-links {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 28px;
      border: 1px solid #f3f4f6;
    }

    .links-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
      margin-top: 12px;
    }

    .link-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 12px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #f3f4f6;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .link-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .link-icon {
      font-size: 28px;
      margin-bottom: 8px;
    }

    .link-label {
      font-size: 13px;
      font-weight: 500;
      color: #1f2937;
      text-align: center;
    }

    .eu-section {
      margin-top: 24px;
    }

    @media (max-width: 1024px) {
      .activity-tasks {
        grid-template-columns: 1fr 1fr;
      }

      .links-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .activity-tasks {
        grid-template-columns: 1fr;
      }

      .links-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class TrainingWp5Component {
  // Component logic
}