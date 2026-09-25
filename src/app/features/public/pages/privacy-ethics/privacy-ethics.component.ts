// ============================================================
// BRIDGE-AI Kenya - Privacy & Ethics Component
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { APP, FUNDING } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-privacy-ethics',
  standalone: true,
  imports: [CommonModule],
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

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .content-card {
        padding: 20px;
      }
    }

    .privacy-ethics-page { min-height: 100vh; padding: 0 0 90px; background: #f7f2e6; }
    .privacy-ethics-page .container { max-width: 980px; padding: 0 24px; }
    .privacy-ethics-page .page-title { margin: 0 -24px 38px; padding: 100px 24px 72px; background: #064e3b; color: #fffdf7; font: 400 clamp(3rem, 7vw, 6rem)/.98 Georgia, 'Times New Roman', serif; }
    .privacy-ethics-page .content-section { gap: 16px; }
    .privacy-ethics-page .content-card { border: 1px solid #d4dfd8; border-radius: 0; background: #fffdf8; box-shadow: 0 12px 28px rgba(6,78,59,.07); }
    .privacy-ethics-page .section-heading { color: #064e3b; font: 700 1.55rem/1.2 Georgia, 'Times New Roman', serif; }
    .privacy-ethics-page .section-text, .privacy-ethics-page .info-list li { color: #4c6257; }
    .privacy-ethics-page .info-list li::before { color: #d97706; }
    .privacy-ethics-page .contact-details { background: #eef4ed; border-left: 3px solid #d8e86b; border-radius: 0; }

    .terms-page .terms-hero .eyebrow { display: none; }
    .terms-content a { color: #0b6b52; font-weight: 800; text-decoration: underline; text-underline-offset: 3px; }
  `]
})
export class PrivacyEthicsComponent {
  protected grantNumber = FUNDING.GRANT_AGREEMENT;
  protected disclaimer = FUNDING.DISCLAIMER;
}

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="terms-page">
      <section class="terms-hero"><h1>Terms &amp; Conditions</h1><p>Clear guidance for ordering products, delivery, returns, and responsible use of the SmartMushroom marketplace.</p></section>
      <article class="terms-content">
        <section><h2>Orders and fulfilment</h2><p>Orders are confirmed by the SmartMushroom team after availability, delivery details, and payment arrangements have been reviewed with you.</p></section>
        <section><h2>Product returns and replacements</h2><p>Contact our team promptly if a product arrives damaged, incomplete, or unsuitable. Biological inputs and fresh produce may have specific replacement conditions that will be confirmed at checkout.</p></section>
        <section><h2>Contact</h2><p>For questions about an order or these terms, <a routerLink="/contact">contact the SmartMushroom team through the contact page.</a></p></section>
      </article>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f7f2e6; color: #17372b; }
    .terms-hero { padding: 110px max(24px, calc((100% - 980px) / 2)) 82px; background: #064e3b; color: #fffdf7; }
    .eyebrow { margin: 0 0 16px; color: #d8e86b; font: 800 .75rem/1.2 Arial, sans-serif; letter-spacing: .16em; text-transform: uppercase; }
    h1, h2 { font-family: Georgia, 'Times New Roman', serif; }
    h1 { max-width: 760px; margin: 0; font-size: clamp(3rem, 7vw, 6rem); line-height: .98; font-weight: 400; }
    .terms-hero > p:last-child { max-width: 600px; margin: 24px 0 0; color: #c4d8ce; font: 1.05rem/1.7 Arial, sans-serif; }
    .terms-content { display: grid; gap: 1px; max-width: 980px; margin: 0 auto; padding: 64px 24px 90px; }
    .terms-content section { padding: 28px 0; border-bottom: 1px solid #d4dfd8; }
    h2 { margin: 0 0 10px; color: #064e3b; font-size: 1.8rem; }
    .terms-content p { max-width: 700px; margin: 0; color: #4c6257; font: 1rem/1.8 Arial, sans-serif; }
    @media (max-width: 640px) { .terms-hero { padding: 76px 20px 58px; } .terms-content { padding: 42px 20px 64px; } h1 { font-size: 3.2rem; } }
  `]
})
export class TermsComponent {}