// ============================================================
// BRIDGE-AI Kenya - Contact Component
// ============================================================

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SubmissionService } from '../../../../services/submission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';
import { LOCAL_CONTEXT } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EuFundingBannerComponent],
  template: `
    <div class="contact-page">
      <div class="container">
        <h1 class="page-title">Contact Us</h1>

        <div class="contact-grid">
          <!-- Contact Form -->
          <div class="contact-form-wrapper">
            <h2 class="form-title">Send a Message</h2>
            <form (ngSubmit)="onSubmit()" #contactForm="ngForm" class="contact-form">
              <div class="form-group">
                <label for="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="formData.name"
                  required
                  class="form-control"
                  placeholder="Your full name"
                />
              </div>
              <div class="form-group">
                <label for="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="formData.email"
                  required
                  class="form-control"
                  placeholder="your@email.com"
                />
              </div>
              <div class="form-group">
                <label for="organisation">Organisation</label>
                <input
                  type="text"
                  id="organisation"
                  name="organisation"
                  [(ngModel)]="formData.organisation"
                  class="form-control"
                  placeholder="Your organisation name"
                />
              </div>
              <div class="form-group">
                <label for="audience">I am a...</label>
                <select
                  id="audience"
                  name="audience"
                  [(ngModel)]="formData.audience"
                  class="form-control"
                >
                  <option value="general">General Visitor</option>
                  <option value="farmer">Farmer</option>
                  <option value="student">Student</option>
                  <option value="developer">Developer</option>
                  <option value="sme">SME</option>
                  <option value="researcher">Researcher</option>
                  <option value="media">Media</option>
                  <option value="partner">Partner</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label for="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  [(ngModel)]="formData.message"
                  required
                  class="form-control"
                  rows="5"
                  placeholder="Your message..."
                ></textarea>
              </div>
              <div class="form-group full-width consent-group">
                <label class="consent-label">
                  <input
                    type="checkbox"
                    name="consent"
                    [(ngModel)]="formData.consent"
                    required
                  />
                  I agree to the processing of my data for the purpose of this enquiry.
                </label>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-submit" [disabled]="isSubmitting">
                  {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Contact Info -->
          <div class="contact-info">
            <div class="info-card">
              <h3 class="info-title">Get in Touch</h3>
              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>bridge-ai@jkuat.ac.ke</span>
              </div>
              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{{ pilotSite }}</span>
              </div>
            </div>

            <div class="info-card">
              <h3 class="info-title">Quick Links</h3>
              <ul class="quick-links">
                <li><a [routerLink]="['/smart-mushrooms']">Smart Mushroom Pilot</a></li>
                <li><a [routerLink]="['/activities']">Activities</a></li>
                <li><a [routerLink]="['/training-wp5']">Training & WP5</a></li>
                <li><a [routerLink]="['/resources']">Resources</a></li>
                <li><a [routerLink]="['/partners']">Partners</a></li>
                <li><a [routerLink]="['/privacy-ethics']">Privacy & Ethics</a></li>
              </ul>
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
    .contact-page {
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

    .contact-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 32px;
    }

    .contact-form-wrapper {
      background: #ffffff;
      border-radius: 12px;
      padding: 28px 32px;
      border: 1px solid #f3f4f6;
    }

    .form-title {
      font-size: 22px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 20px 0;
    }

    .contact-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-size: 13px;
      font-weight: 500;
      color: #374151;
    }

    .form-control {
      padding: 10px 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .consent-group {
      margin-top: 8px;
    }

    .consent-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #4b5563;
      cursor: pointer;
    }

    .consent-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: #3b82f6;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }

    .btn-submit {
      padding: 12px 32px;
      background: #3b82f6;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-submit:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .info-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 28px;
      border: 1px solid #f3f4f6;
    }

    .info-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      color: #4b5563;
      font-size: 14px;
    }

    .info-item svg {
      flex-shrink: 0;
      color: #6b7280;
    }

    .quick-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .quick-links li {
      padding: 6px 0;
    }

    .quick-links a {
      color: #3b82f6;
      text-decoration: none;
      font-size: 14px;
    }

    .quick-links a:hover {
      text-decoration: underline;
    }

    .eu-section {
      margin-top: 32px;
    }

    @media (max-width: 1024px) {
      .contact-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .contact-form {
        grid-template-columns: 1fr;
      }

      .contact-form-wrapper {
        padding: 20px;
      }
    }
  `]
})
export class ContactComponent {
  protected pilotSite = LOCAL_CONTEXT.PILOT_SITE;
  protected isSubmitting = false;

  protected formData = {
    name: '',
    email: '',
    organisation: '',
    audience: 'general',
    message: '',
    consent: false
  };

  constructor(
    private submissionService: SubmissionService,
    private notificationService: NotificationService
  ) {}

  onSubmit(): void {
    if (this.isSubmitting || !this.formData.consent) {
      return;
    }

    this.isSubmitting = true;

    this.submissionService.submitContactForm({
      name: this.formData.name,
      email: this.formData.email,
      organisation: this.formData.organisation,
      audience: this.formData.audience,
      message: this.formData.message,
      is_read: false,
      form_type: 'contact'
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notificationService.showSuccess('Your message has been sent successfully!');
        this.formData = {
          name: '',
          email: '',
          organisation: '',
          audience: 'general',
          message: '',
          consent: false
        };
      },
      error: () => {
        this.isSubmitting = false;
        this.notificationService.showError('There was an error sending your message. Please try again.');
      }
    });
  }
}