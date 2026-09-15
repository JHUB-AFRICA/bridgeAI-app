// ============================================================
// BRIDGE-AI - Contact Component
// ============================================================

import { Component, HostListener, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, finalize, map } from 'rxjs';
import { SubmissionService } from '../../../../services/submission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LOCAL_CONTEXT } from '../../../core/constants/app.constants';
import { ContactSubmission, MediaRequestSubmission, SMESubmission, Submission, TrainingInterestSubmission } from '../../../core/models/submission.model';

type MessageType = 'contact' | 'training' | 'media' | 'sme';

interface ContactFormData {
  form_type: MessageType;
  name: string;
  email: string;
  organisation: string;
  audience: string;
  phone: string;
  county: string;
  training_interest: string;
  outlet: string;
  request_type: string;
  deadline: string;
  industry: string;
  interest: string;
  message: string;
  consent: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="contact-page">
      <section class="contact-hero">
        <div class="hero-bg"></div>
        <div class="hero-content container">
          <span class="hero-badge">Contact</span>
          <h1>We’d love to hear from you.</h1>
          <p>Whether you are a farmer, builder, researcher, student or buyer, the JKUAT and JHUB Smart Mushroom team is ready to connect.</p>
        </div>
      </section>

      <div class="container page-wrap">
        <div class="contact-grid">
          <div class="contact-form-wrapper">
            <h2 class="form-title">Send a Message</h2>
            <form (ngSubmit)="onSubmit()" #contactForm="ngForm" class="contact-form">
              <div class="form-group">
                <label for="form_type">What can we help you with? *</label>
                <div class="select-field" [class.is-open]="openDropdown === 'form_type'">
                  <button id="form_type" type="button" class="form-control select-trigger" [attr.aria-expanded]="openDropdown === 'form_type'" aria-haspopup="listbox" (click)="toggleDropdown('form_type', $event)">
                    <span>{{ formTypeLabel() }}</span><span class="select-chevron" aria-hidden="true">⌄</span>
                  </button>
                  @if (openDropdown === 'form_type') {
                    <div class="select-menu" role="listbox" aria-label="What can we help you with?">
                      @for (option of formTypeOptions; track option.value) {
                        <button type="button" role="option" class="select-option" [class.selected]="formData.form_type === option.value" [attr.aria-selected]="formData.form_type === option.value" (click)="chooseFormType(option.value, $event)">{{ option.label }}</button>
                      }
                    </div>
                  }
                </div>
              </div>

              <div class="form-group">
                <label for="name">Full Name *</label>
                <input type="text" id="name" name="name" [(ngModel)]="formData.name" required class="form-control" placeholder="Your full name" />
              </div>

              <div class="form-group">
                <label for="email">Email Address *</label>
                <input type="email" id="email" name="email" [(ngModel)]="formData.email" required class="form-control" placeholder="your@email.com" />
              </div>

              @if (formData.form_type === 'contact' || formData.form_type === 'sme') {
              <div class="form-group">
                <label for="organisation">Organisation</label>
                <input type="text" id="organisation" name="organisation" [(ngModel)]="formData.organisation" [required]="formData.form_type === 'sme'" class="form-control" placeholder="Your organisation name" />
              </div>
              }

              @if (formData.form_type !== 'media' && formData.form_type !== 'sme') {
              <div class="form-group">
                <label for="audience">I am a...</label>
                <div class="select-field" [class.is-open]="openDropdown === 'audience'">
                  <button id="audience" type="button" class="form-control select-trigger" [attr.aria-expanded]="openDropdown === 'audience'" aria-haspopup="listbox" (click)="toggleDropdown('audience', $event)">
                    <span>{{ audienceLabel() }}</span><span class="select-chevron" aria-hidden="true">⌄</span>
                  </button>
                  @if (openDropdown === 'audience') {
                    <div class="select-menu" role="listbox" aria-label="I am a">
                      @for (option of audienceOptions; track option.value) {
                        <button type="button" role="option" class="select-option" [class.selected]="formData.audience === option.value" [attr.aria-selected]="formData.audience === option.value" (click)="chooseAudience(option.value, $event)">{{ option.label }}</button>
                      }
                    </div>
                  }
                </div>
              </div>
              }

              @if (formData.form_type === 'training') {
                <div class="form-group"><label for="phone">Phone</label><input type="tel" id="phone" name="phone" [(ngModel)]="formData.phone" class="form-control" placeholder="Your phone number" /></div>
                <div class="form-group"><label for="county">County or location</label><input type="text" id="county" name="county" [(ngModel)]="formData.county" class="form-control" placeholder="e.g. Kiambu" /></div>
                <div class="form-group full-width"><label for="training_interest">Training interest *</label><input type="text" id="training_interest" name="training_interest" [(ngModel)]="formData.training_interest" required class="form-control" placeholder="Which training, workshop or topic interests you?" /></div>
              }

              @if (formData.form_type === 'media') {
                <div class="form-group"><label for="outlet">Media outlet *</label><input type="text" id="outlet" name="outlet" [(ngModel)]="formData.outlet" required class="form-control" placeholder="Publication, station or platform" /></div>
                <div class="form-group"><label for="request_type">Request type *</label>
                  <div class="select-field" [class.is-open]="openDropdown === 'request_type'">
                    <button id="request_type" type="button" class="form-control select-trigger" [attr.aria-expanded]="openDropdown === 'request_type'" aria-haspopup="listbox" (click)="toggleDropdown('request_type', $event)"><span>{{ requestTypeLabel() }}</span><span class="select-chevron" aria-hidden="true">⌄</span></button>
                    @if (openDropdown === 'request_type') {
                      <div class="select-menu" role="listbox" aria-label="Request type">
                        @for (option of requestTypeOptions; track option.value) {
                          <button type="button" role="option" class="select-option" [class.selected]="formData.request_type === option.value" [attr.aria-selected]="formData.request_type === option.value" (click)="chooseRequestType(option.value, $event)">{{ option.label }}</button>
                        }
                      </div>
                    }
                  </div>
                </div>
                <div class="form-group"><label for="deadline">Deadline</label><input type="date" id="deadline" name="deadline" [(ngModel)]="formData.deadline" class="form-control" /></div>
              }

              @if (formData.form_type === 'sme') {
                <div class="form-group"><label for="industry">Industry sector *</label><input type="text" id="industry" name="industry" [(ngModel)]="formData.industry" required class="form-control" placeholder="e.g. Agriculture technology" /></div>
                <div class="form-group full-width"><label for="interest">Partnership interest *</label><input type="text" id="interest" name="interest" [(ngModel)]="formData.interest" required class="form-control" placeholder="How would you like to engage with BRIDGE-AI?" /></div>
              }

              <div class="form-group full-width">
                <label for="message">{{ formData.form_type === 'training' ? 'Additional message' : 'Message *' }}</label>
                <textarea id="message" name="message" [(ngModel)]="formData.message" [required]="formData.form_type !== 'training'" class="form-control" rows="5" placeholder="Tell us how we can help..."></textarea>
              </div>

              <div class="form-group full-width consent-group">
                <label class="consent-label">
                  <input type="checkbox" name="consent" [(ngModel)]="formData.consent" required />
                  I agree to the processing of my data for the purpose of this enquiry.
                </label>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-submit" [disabled]="isSubmitting()">
                  {{ isSubmitting() ? 'Sending...' : 'Send Message' }}
                </button>
              </div>
            </form>
          </div>

          <div class="contact-info">
            <div class="info-card">
              <h3 class="info-title">Contact JKUAT JHUB Smart Mushroom</h3>
              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <a href="mailto:info@jhubafrica.com">info@jhubafrica.com</a>
              </div>
              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>JKUAT Smart Farm Zone, Juja, Kenya</span>
              </div>
              <div class="info-item">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M5.2 3.5A2.4 2.4 0 1 1 .4 3.5a2.4 2.4 0 0 1 4.8 0ZM.7 8h4.5v13H.7V8Zm7.3 0h4.3v1.8h.1c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.5 3 5.5 6.9V21h-4.5v-5.9c0-1.4 0-3.3-2-3.3s-2.3 1.5-2.3 3.2V21H8V8Z" /></svg>
                  <a href="https://jhubafrica.com" target="_blank" rel="noopener noreferrer">JHUB Africa</a>
              </div>
            </div>

            <div class="info-card">
              <h3 class="info-title">Quick Links</h3>
              <ul class="quick-links">
                <li><a [routerLink]="['/smart-mushrooms']">Smart Mushroom Pilot</a></li>
                <li><a [routerLink]="['/activities']">Activities</a></li>
                <li><a [routerLink]="['/training-events']">Smart Mushroom training</a></li>
                <li><a [routerLink]="['/resources']">Resources</a></li>
                <li><a [routerLink]="['/partners']">Partners</a></li>
                <li><a [routerLink]="['/privacy-ethics']">Privacy &amp; Ethics</a></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      max-width: 100%;
      overflow-x: clip;
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
      min-width: 0;
    }
    .contact-form-wrapper, .info-card {
      min-width: 0;
      max-width: 100%;
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
    .contact-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; min-width: 0; }
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
      display: block;
      min-width: 0;
      max-width: 100%;
      width: 100%;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1.5px solid #e3dac2;
      background: #f9f5ee;
      color: #17241b;
      font: inherit;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .form-control:focus {
      outline: none;
      border-color: #26432b;
      box-shadow: 0 0 0 4px rgba(38, 67, 43, 0.08);
    }
    .select-field { position: relative; min-width: 0; }
    .select-trigger { display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; text-align: left; }
    .select-trigger span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .select-chevron { color: #26432b; font-size: 1.2rem; line-height: .7; transform: translateY(-2px); transition: transform .2s ease; }
    .select-field.is-open .select-chevron { transform: rotate(180deg) translateY(2px); }
    .select-menu { position: absolute; z-index: 20; top: calc(100% + 6px); left: 0; right: 0; max-width: 100%; max-height: 240px; overflow-y: auto; padding: 6px; border: 1px solid #cbd8ca; border-radius: 12px; background: #fffdf7; box-shadow: 0 14px 30px rgba(23, 36, 27, .16); }
    .select-option { display: block; width: 100%; padding: 10px 12px; border: 0; border-radius: 8px; background: transparent; color: #17241b; font: inherit; font-size: .92rem; text-align: left; cursor: pointer; }
    .select-option:hover, .select-option:focus-visible, .select-option.selected { background: #e4f0e4; color: #26432b; outline: none; }
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
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .info-item svg {
      color: #26432b;
      flex-shrink: 0;
    }

    .info-item a {
      min-width: 0;
      color: #26432b;
      overflow-wrap: anywhere;
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
    @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; } }
    @media (max-width: 640px) {
      .container { width: 100%; max-width: 100%; padding: 0 18px; }
      .contact-form { grid-template-columns: 1fr; }
      .contact-form-wrapper { padding: 20px 18px; }
      .form-group, .form-control, select.form-control, textarea.form-control { min-width: 0; max-width: 100%; }
      .select-menu { max-height: 200px; }
      .form-title { font-size: 1.6rem; }
      .hero-content { padding-top: 44px; padding-bottom: 44px; }
      .hero-content h1 { font-size: 2.2rem; }
      .btn-submit { width: 100%; }
      .form-actions { justify-content: stretch; }
    }
  `]
})
export class ContactComponent implements OnInit {
  protected pilotSite = LOCAL_CONTEXT.PILOT_SITE;
  protected isSubmitting = signal(false);
  protected openDropdown: 'form_type' | 'audience' | 'request_type' | null = null;
  protected readonly formTypeOptions = [
    { value: 'contact' as const, label: 'General enquiry' },
    { value: 'training' as const, label: 'Training interest' },
    { value: 'media' as const, label: 'Media request' },
    { value: 'sme' as const, label: 'SME partnership' }
  ];
  protected readonly audienceOptions = [
    { value: 'general', label: 'General Visitor' },
    { value: 'farmer', label: 'Farmer' },
    { value: 'student', label: 'Student' },
    { value: 'developer', label: 'Developer' },
    { value: 'sme', label: 'SME' },
    { value: 'researcher', label: 'Researcher' },
    { value: 'media', label: 'Media' },
    { value: 'partner', label: 'Partner' }
  ];
  protected readonly requestTypeOptions = [
    { value: 'interview', label: 'Interview' },
    { value: 'footage', label: 'Footage or images' },
    { value: 'statement', label: 'Statement' }
  ];

  protected formData: ContactFormData = {
    form_type: 'contact',
    name: '',
    email: '',
    organisation: '',
    audience: 'general',
    phone: '',
    county: '',
    training_interest: '',
    outlet: '',
    request_type: 'interview',
    deadline: '',
    industry: '',
    interest: '',
    message: '',
    consent: false
  };

  constructor(
    private submissionService: SubmissionService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const type = params.get('type');
      const validAudiences = ['general', 'farmer', 'student', 'developer', 'sme', 'researcher', 'media', 'partner'];
      const validMessageTypes: MessageType[] = ['contact', 'training', 'media', 'sme'];
      if (type && validMessageTypes.includes(type as MessageType)) {
        this.formData.form_type = type as MessageType;
      }
      if (type && validAudiences.includes(type)) {
        this.formData.audience = type;
      }
    });
  }

  @HostListener('document:click')
  closeDropdown(): void {
    this.openDropdown = null;
  }

  protected toggleDropdown(dropdown: 'form_type' | 'audience' | 'request_type', event: Event): void {
    event.stopPropagation();
    this.openDropdown = this.openDropdown === dropdown ? null : dropdown;
  }

  protected chooseFormType(value: MessageType, event: Event): void {
    event.stopPropagation();
    this.formData.form_type = value;
    this.openDropdown = null;
  }

  protected chooseAudience(value: string, event: Event): void {
    event.stopPropagation();
    this.formData.audience = value;
    this.openDropdown = null;
  }

  protected chooseRequestType(value: string, event: Event): void {
    event.stopPropagation();
    this.formData.request_type = value;
    this.openDropdown = null;
  }

  protected formTypeLabel(): string {
    return this.formTypeOptions.find(option => option.value === this.formData.form_type)?.label ?? 'Choose an enquiry type';
  }

  protected audienceLabel(): string {
    return this.audienceOptions.find(option => option.value === this.formData.audience)?.label ?? 'Choose an audience';
  }

  protected requestTypeLabel(): string {
    return this.requestTypeOptions.find(option => option.value === this.formData.request_type)?.label ?? 'Choose a request type';
  }

  onSubmit(): void {
    if (this.isSubmitting() || !this.formData.consent) {
      return;
    }

    this.isSubmitting.set(true);

    this.submitForm().pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: () => {
        this.notificationService.showSuccess('Your message has been sent successfully!');
        this.formData = {
          form_type: 'contact',
          name: '',
          email: '',
          organisation: '',
          audience: 'general',
          phone: '', county: '', training_interest: '', outlet: '', request_type: 'interview', deadline: '', industry: '', interest: '',
          message: '',
          consent: false
        };
      },
      error: () => {
        this.notificationService.showError('There was an error sending your message. Please try again.');
      }
    });
  }

  private submitForm(): Observable<Submission> {
    const base = { name: this.formData.name, email: this.formData.email, is_read: false as const };
    switch (this.formData.form_type) {
      case 'training':
        return this.submissionService.submitTrainingInterest({ ...base, phone: this.formData.phone, county: this.formData.county, audience: this.formData.audience, training_interest: this.formData.training_interest, message: this.formData.message, form_type: 'training' } satisfies TrainingInterestSubmission).pipe(map(value => value as Submission));
      case 'media':
        return this.submissionService.submitMediaRequest({ ...base, outlet: this.formData.outlet, request_type: this.formData.request_type, deadline: this.formData.deadline, audience: 'media', message: this.formData.message, form_type: 'media' } satisfies MediaRequestSubmission).pipe(map(value => value as Submission));
      case 'sme':
        return this.submissionService.submitSmeInterest({ ...base, organisation: this.formData.organisation, industry: this.formData.industry, interest: this.formData.interest, message: this.formData.message, form_type: 'sme' } satisfies SMESubmission).pipe(map(value => value as Submission));
      default:
        return this.submissionService.submitContactForm({ ...base, organisation: this.formData.organisation, audience: this.formData.audience, message: this.formData.message, form_type: 'contact' } satisfies ContactSubmission).pipe(map(value => value as Submission));
    }
  }
}