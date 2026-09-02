// ============================================================
// BRIDGE-AI Kenya - SME Mentoring Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChallengeService } from '../../../../services/challenge.service';
import { HackathonService } from '../../../../services/hackathon.service';
import { SuccessStoryService } from '../../../../services/success-story.service';
import { SmeSubmissionService } from '../../../../services/sme-submission.service';
import { Challenge } from '../../../core/models/challenge.model';
import { Hackathon } from '../../../core/models/hackathon.model';
import { SuccessStory } from '../../../core/models/success-story.model';
import { NotificationService } from '../../../core/services/notification.service';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-sme-mentoring',
  imports: [CommonModule, FormsModule, EuFundingBannerComponent],
  templateUrl: './sme-mentoring.component.html',
  styleUrl: './sme-mentoring.component.css'
  /* template: `
    <div class="sme-mentoring-page">
      <div class="container">
        <h1 class="page-title">SME Mentoring</h1>

        <!-- Challenges -->
        <section class="section">
          <h2 class="section-heading">Open Challenges</h2>
          <div *ngIf="challenges().length === 0" class="empty-state">
            <p>No open challenges at this time.</p>
          </div>
        template: `
        </section>

        <!-- Hackathons -->
        <section class="section">
          <h2 class="section-heading">Upcoming Hackathons</h2>
          <div *ngIf="hackathons().length === 0" class="empty-state">
            <p>No upcoming hackathons at this time.</p>
          </div>
          <div class="hackathons-grid">
            <div *ngFor="let hackathon of hackathons()" class="hackathon-card">
              <h3 class="hackathon-title">{{ hackathon.title }}</h3>
              <p class="hackathon-description">{{ hackathon.description }}</p>
              <div class="hackathon-meta">
                <span class="hackathon-date">{{ hackathon.date | date:'dd MMM yyyy' }}</span>
                <span *ngIf="hackathon.location" class="hackathon-location">{{ hackathon.location }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Success Stories -->
        <section class="section">
          <h2 class="section-heading">Success Stories</h2>
          <div *ngIf="stories().length === 0" class="empty-state">
            <p>No success stories available yet.</p>
          </div>
          <div class="stories-grid">
            <div *ngFor="let story of stories()" class="story-card">
              <div class="story-header">
                <div class="story-avatar">
                  <span>{{ getStoryInitials(story) }}</span>
                </div>
                <div>
                  <h4 class="story-name">{{ story.sme_name }}</h4>
                  <p *ngIf="story.industry" class="story-industry">{{ story.industry }}</p>
                </div>
              </div>
              <p class="story-content">{{ story.story }}</p>
            </div>
          </div>
        </section>

        <!-- Interest Form -->
        <section class="section form-section">
          <h2 class="section-heading">Express Your Interest</h2>
          <form (ngSubmit)="onSubmit()" #interestForm="ngForm" class="interest-form">
            <div class="form-grid">
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
                <label for="organisation">Organisation *</label>
                <input
                  type="text"
                  id="organisation"
                  name="organisation"
                  [(ngModel)]="formData.organisation"
                  required
                  class="form-control"
                  placeholder="Your organisation name"
                />
              </div>
              <div class="form-group">
                <label for="industry">Industry *</label>
                <select
                  id="industry"
                  name="industry"
                  [(ngModel)]="formData.industry"
                  required
                  class="form-control"
                >
                  <option value="">Select an industry</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="technology">Technology</option>
                  <option value="agritech">Agritech</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="services">Services</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label for="interest">Interest Area *</label>
                <select
                  id="interest"
                  name="interest"
                  [(ngModel)]="formData.interest"
                  required
                  class="form-control"
                >
                  <option value="">Select your interest</option>
                  <option value="mentoring">Mentoring</option>
                  <option value="funding">Funding Opportunities</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="training">Training</option>
                  <option value="pilot">Pilot Participation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  [(ngModel)]="formData.message"
                  class="form-control"
                  rows="4"
                  placeholder="Tell us more about your interest..."
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-submit" [disabled]="isSubmitting">
                {{ isSubmitting ? 'Submitting...' : 'Submit Interest' }}
              </button>
            </div>
          </form>
        </section>

        <div class="eu-section">
          <app-eu-funding-banner></app-eu-funding-banner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sme-mentoring-page {
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

    .empty-state {
      padding: 24px;
      background: #ffffff;
      border-radius: 8px;
      text-align: center;
      color: #6b7280;
    }

    .challenges-grid,
    .hackathons-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .challenge-card,
    .hackathon-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px 24px;
      border: 1px solid #f3f4f6;
      transition: box-shadow 0.3s ease;
    }

    .challenge-card:hover,
    .hackathon-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .challenge-title,
    .hackathon-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    .challenge-description,
    .hackathon-description {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
      margin: 0 0 12px 0;
    }

    .challenge-meta,
    .hackathon-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #9ca3af;
    }

    .stories-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .story-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px 24px;
      border: 1px solid #f3f4f6;
    }

    .story-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .story-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 700;
      font-size: 14px;
      flex-shrink: 0;
    }

    .story-name {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .story-industry {
      font-size: 12px;
      color: #9ca3af;
      margin: 0;
    }

    .story-content {
      font-size: 14px;
      color: #4b5563;
      line-height: 1.6;
      margin: 0;
    }

    .form-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 28px;
      border: 1px solid #f3f4f6;
    }

    .interest-form {
      margin-top: 16px;
    }

    .form-grid {
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

    .form-control.ng-invalid.ng-touched {
      border-color: #ef4444;
    }

    .form-actions {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
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

    .eu-section {
      margin-top: 32px;
    }

    @media (max-width: 1024px) {
      .challenges-grid,
      .hackathons-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .challenges-grid,
      .hackathons-grid {
        grid-template-columns: 1fr;
      }

      .stories-grid {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]*/
})
export class SmeMentoringComponent implements OnInit {
  protected challenges = signal<Challenge[]>([]);
  protected hackathons = signal<Hackathon[]>([]);
  protected stories = signal<SuccessStory[]>([]);
  protected isSubmitting = false;

  protected formData = {
    name: '',
    email: '',
    organisation: '',
    industry: '',
    interest: '',
    message: ''
  };

  constructor(
    private challengeService: ChallengeService,
    private hackathonService: HackathonService,
    private storyService: SuccessStoryService,
    private submissionService: SmeSubmissionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  protected getStoryInitials(story: SuccessStory): string {
    const name = (story?.sme_name || '').trim();
    if (!name) {
      return '?';
    }

    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('') || '?';
  }

  private loadData(): void {
    this.challengeService.getOpenChallenges().subscribe({
      next: (challenges) => {
        this.challenges.set(challenges);
      },
      error: () => {
        this.challenges.set([]);
      }
    });

    this.hackathonService.getUpcomingHackathons().subscribe({
      next: (hackathons) => {
        this.hackathons.set(hackathons);
      },
      error: () => {
        this.hackathons.set([]);
      }
    });

    this.storyService.getPublishedStories().subscribe({
      next: (stories) => {
        this.stories.set(stories);
      },
      error: () => {
        this.stories.set([]);
      }
    });
  }

  onSubmit(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.submissionService.submitSMEInterest({
      name: this.formData.name,
      email: this.formData.email,
      organisation: this.formData.organisation,
      industry: this.formData.industry,
      interest: this.formData.interest,
      message: this.formData.message,
      is_read: false,
      form_type: 'sme'
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notificationService.showSuccess('Your interest has been submitted successfully!');
        this.formData = {
          name: '',
          email: '',
          organisation: '',
          industry: '',
          interest: '',
          message: ''
        };
      },
      error: () => {
        this.isSubmitting = false;
        this.notificationService.showError('There was an error submitting your interest. Please try again.');
      }
    });
  }
}