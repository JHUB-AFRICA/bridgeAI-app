// ============================================================
// BRIDGE-AI Kenya - Privacy & Ethics Component
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';
import { APP, FUNDING } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-privacy-ethics',
  standalone: true,
  imports: [CommonModule, EuFundingBannerComponent],
  template: `
    <div class="privacy-ethics-page">
      <div class="container">
        <h1 class="page-title">Privacy and Ethics</h1>

        <div class="content-section">
          <div class="content-card">
            <h2 class="section-heading">Data Protection Policy</h2>
            <p class="section-text">
              BRIDGE-AI is committed to protecting the privacy and security of personal data.
              This policy outlines how we collect, use, and protect your information in
              accordance with applicable data protection laws, including the General Data
              Protection Regulation (GDPR).
            </p>
          </div>

          <div class="content-card">
            <h2 class="section-heading">Information We Collect</h2>
            <p class="section-text">
              We may collect the following types of information:
            </p>
            <ul class="info-list">
              <li>Name and contact information (email address, phone number)</li>
              <li>Organisation or affiliation</li>
              <li>Feedback and survey responses</li>
              <li>Photographs and video recordings (with explicit consent)</li>
              <li>Website usage data (via cookies)</li>
            </ul>
          </div>

          <div class="content-card">
            <h2 class="section-heading">How We Use Your Information</h2>
            <p class="section-text">Your information is used for the following purposes:</p>
            <ul class="info-list">
              <li>To respond to your enquiries and requests</li>
              <li>To register you for events and training programmes</li>
              <li>To provide you with information about project activities</li>
              <li>To conduct research and evaluation activities</li>
              <li>To comply with legal and reporting obligations</li>
            </ul>
          </div>

          <div class="content-card">
            <h2 class="section-heading">Data Sharing and Storage</h2>
            <p class="section-text">
              Your data will not be shared with third parties without your consent, except
              as required by law or for project reporting purposes. All data is stored
              securely and retained only for as long as necessary.
            </p>
          </div>

          <div class="content-card">
            <h2 class="section-heading">Your Rights</h2>
            <p class="section-text">You have the right to:</p>
            <ul class="info-list">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
          </div>

          <div class="content-card">
            <h2 class="section-heading">Consent and Photography</h2>
            <p class="section-text">
              Photographs and video recordings of project activities will only be published
              with explicit, documented consent from all identifiable individuals. You may
              withdraw consent at any time by contacting the project team.
            </p>
          </div>

          <div class="content-card">
            <h2 class="section-heading">Contact for Data Privacy</h2>
            <p class="section-text">
              For any questions about data privacy or to exercise your rights, please contact:
            </p>
            <div class="contact-details">
              <p><strong>BRIDGE-AI Kenya Project Team</strong></p>
              <p>JKUAT Smart Farm Zone, Juja, Kenya</p>
              <p>Email: bridge-ai@jkuat.ac.ke</p>
            </div>
          </div>

          <div class="content-card">
            <h2 class="section-heading">EU Visibility and Compliance</h2>
            <p class="section-text">
              This project has received funding from the European Union's Horizon Europe
              research and innovation programme under grant agreement {{ grantNumber }}.
            </p>
            <p class="section-text disclaimer">{{ disclaimer }}</p>
          </div>
        </div>

        <div class="eu-section">
          <app-eu-funding-banner></app-eu-funding-banner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .privacy-ethics-page {
      padding: 48px 0 64px 0;
      background: #f8fafc;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 32px 0;
    }

    .content-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
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

    .section-text.disclaimer {
      font-size: 14px;
      color: #6b7280;
      margin-top: 8px;
    }

    .info-list {
      list-style: none;
      padding: 0;
      margin: 8px 0 0 0;
    }

    .info-list li {
      padding: 6px 0 6px 24px;
      position: relative;
      font-size: 15px;
      color: #4b5563;
      line-height: 1.6;
    }

    .info-list li::before {
      content: '•';
      position: absolute;
      left: 4px;
      color: #3b82f6;
      font-weight: 700;
      font-size: 18px;
    }

    .contact-details {
      margin-top: 12px;
      padding: 16px 20px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .contact-details p {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #4b5563;
    }

    .eu-section {
      margin-top: 32px;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .content-card {
        padding: 20px;
      }
    }
  `]
})
export class PrivacyEthicsComponent {
  protected grantNumber = FUNDING.GRANT_AGREEMENT;
  protected disclaimer = FUNDING.DISCLAIMER;
}