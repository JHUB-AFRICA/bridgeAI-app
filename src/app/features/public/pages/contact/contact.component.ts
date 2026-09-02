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
      <section class="contact-hero">
        <div class="hero-bg"></div>
        <div class="hero-content container">
          <span class="hero-badge">Contact</span>
          <h1>We’d love to hear from you.</h1>
          <p>Whether you are a farmer, partner, researcher or student, the BRIDGE-AI team is ready to connect.</p>
        </div>
      </section>

      <div class="container page-wrap">
        <div class="contact-grid">
          <div class="contact-form-wrapper">
            <h2 class="form-title">Send a Message</h2>
            <form (ngSubmit)="onSubmit()" #contactForm="ngForm" class="contact-form">
              <div class="form-group">
                <label for="name">Full Name *</label>
                <input type="text" id="name" name="name" [(ngModel)]="formData.name" required class="form-control" placeholder="Your full name" />
              </div>

              <div class="form-group">
                <label for="email">Email Address *</label>
                <input type="email" id="email" name="email" [(ngModel)]="formData.email" required class="form-control" placeholder="your@email.com" />
              </div>

              <div class="form-group">
                <label for="organisation">Organisation</label>
                <input type="text" id="organisation" name="organisation" [(ngModel)]="formData.organisation" class="form-control" placeholder="Your organisation name" />
              </div>

              <div class="form-group">
                <label for="audience">I am a...</label>
                <select id="audience" name="audience" [(ngModel)]="formData.audience" class="form-control">
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
                <textarea id="message" name="message" [(ngModel)]="formData.message" required class="form-control" rows="5" placeholder="Your message..."></textarea>
              </div>

              <div class="form-group full-width consent-group">
                <label class="consent-label">
                  <input type="checkbox" name="consent" [(ngModel)]="formData.consent" required />
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

          <div class="contact-info">
            <div class="info-card">
              <h3 class="info-title">Get in Touch</h3>
              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <span>bridge-ai@jkuat.ac.ke</span>
              </div>
              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>{{ pilotSite }}</span>
              </div>
            </div>

            <div class="info-card">
              <h3 class="info-title">Quick Links</h3>
              <ul class="quick-links">
                <li><a [routerLink]="['/smart-mushrooms']">Smart Mushroom Pilot</a></li>
                <li><a [routerLink]="['/activities']">Activities</a></li>
                <li><a [routerLink]="['/training-wp5']">Training &amp; WP5</a></li>
                <li><a [routerLink]="['/resources']">Resources</a></li>
                <li><a [routerLink]="['/partners']">Partners</a></li>
                <li><a [routerLink]="['/privacy-ethics']">Privacy &amp; Ethics</a></li>
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
    :host {
      display: block;
      color: #1f2a37;
      background: #f7f2e6;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    * { box-sizing: border-box; }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    .contact-hero {
      position: relative;
      background: #0d1f1a;
      min-height: 320px;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(rgba(10, 24, 18, 0.72), rgba(10, 24, 18, 0.72)),
        url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
    }
    .hero-content {
      position: relative;
      z-index: 1;
      color: #fff;
      padding-top: 50px;
      padding-bottom: 50px;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(212, 168, 67, 0.12);
      border: 1px solid rgba(212, 168, 67, 0.2);
      color: #f5d77e;
      letter-spacing: 0.12em;
      border-radius: 4px;
      padding: 6px 16px;
      text-transform: uppercase;
      font-size: 0.66rem;
      font-weight: 700;
    }
    .hero-content h1 {
      margin: 18px 0 12px;
      font-size: clamp(2.5rem, 4vw, 4.6rem);
      line-height: 1.05;
      letter-spacing: -0.04em;
      font-weight: 800;
    }
    .hero-content p {
      margin: 0;
      max-width: 640px;
      color: rgba(255,255,255,0.82);
      font-size: 1.12rem;
      line-height: 1.7;
    }
    .page-wrap { padding-top: 52px; padding-bottom: 64px; }
    .contact-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
      align-items: start;
    }
    .contact-form-wrapper, .info-card {
      background: #fffdf7;
      border: 1px solid #e3dac2;
      border-radius: 18px;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.04);
    }
    .contact-form-wrapper { padding: 30px; }
    .form-title {
      margin: 0 0 20px;
      font-size: 2rem;
      color: #17241b;
      letter-spacing: -0.02em;
    }
    .contact-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
    .form-group { display: flex; flex-direction: column; } 
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: #39493e;
      margin-bottom: 8px;
    }
    .form-control {
      width: 100%;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1.5px solid #e3dac2;
      background: #f9f5ee;
      color: #17241b;
      font: inherit;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .form-control:focus {
      outline: none;
      border-color: #26432b;
      box-shadow: 0 0 0 4px rgba(38, 67, 43, 0.08);
    }
    .consent-group { margin-top: 6px; }
    .consent-label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.86rem;
      color: #4d5f53;
      cursor: pointer;
    }
    .consent-label input { width: 16px; height: 16px; accent-color: #26432b; }
    .form-actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; margin-top: 8px; }
    .btn-submit {
      border: 0;
      background: #26432b;
      color: #fff;
      border-radius: 999px;
      padding: 14px 32px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
    .contact-info { display: flex; flex-direction: column; gap: 20px; }
    .info-card { padding: 26px 24px; }
    .info-title {
      margin: 0 0 16px;
      color: #17241b;
      font-size: 1.5rem;
    }
    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #465c50;
      padding: 10px 0;
    }
    .info-item svg {
      color: #26432b;
      flex-shrink: 0;
    }
    .quick-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .quick-links li { padding: 8px 0; }
    .quick-links a {
      text-decoration: none;
      color: #26432b;
      font-weight: 600;
    }
    .quick-links a:hover { text-decoration: underline; }
    .eu-section { margin-top: 32px; }
    @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; } }
    @media (max-width: 640px) {
      .container { padding: 0 18px; }
      .contact-form { grid-template-columns: 1fr; }
      .contact-form-wrapper { padding: 20px 18px; }
      .form-title { font-size: 1.6rem; }
      .hero-content { padding-top: 44px; padding-bottom: 44px; }
      .hero-content h1 { font-size: 2.2rem; }
      .btn-submit { width: 100%; }
      .form-actions { justify-content: stretch; }
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