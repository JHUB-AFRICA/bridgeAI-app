// ============================================================
// BRIDGE-AI Kenya - Community of Practice Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RepositoryService } from '../../../../services/repository.service';
import { CommunityEventService } from '../../../../services/community-event.service';
import { CommunitySubmissionService } from '../../../../services/community-submission.service';
import { Repository } from '../../../core/models/repository.model';
import { CommunityEvent } from '../../../core/models/community-event.model';
import { NotificationService } from '../../../core/services/notification.service';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-community-practice',
  standalone: true,
  imports: [CommonModule, FormsModule, EuFundingBannerComponent],
  template: `
    <div class="community-practice-page">
      <div class="container">
        <h1 class="page-title">Community of Practice</h1>

        <!-- Repositories -->
        <section class="section">
          <h2 class="section-heading">Repositories</h2>
          <div *ngIf="repositories().length === 0" class="empty-state">
            <p>No repositories available at this time.</p>
          </div>
          <div class="repositories-grid">
            <div *ngFor="let repo of repositories()" class="repo-card">
              <h3 class="repo-title">
                <a [href]="repo.url" target="_blank" rel="noopener">
                  {{ repo.name }}
                </a>
              </h3>
              <p class="repo-description">{{ repo.description }}</p>
              <div class="repo-meta">
                <span *ngIf="repo.language" class="repo-language">{{ repo.language }}</span>
                <span *ngIf="repo.license" class="repo-license">{{ repo.license }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Community Events -->
        <section class="section">
          <h2 class="section-heading">Upcoming Community Events</h2>
          <div *ngIf="communityEvents().length === 0" class="empty-state">
            <p>No upcoming community events at this time.</p>
          </div>
          <div class="events-grid">
            <div *ngFor="let event of communityEvents()" class="event-card">
              <h3 class="event-title">{{ event.title }}</h3>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-meta">
                <span class="event-date">{{ event.date | date:'dd MMM yyyy' }}</span>
                <span *ngIf="event.location" class="event-location">{{ event.location }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Join Form -->
        <section class="section form-section">
          <h2 class="section-heading">Join the Community</h2>
          <form (ngSubmit)="onSubmit()" #joinForm="ngForm" class="join-form">
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
                <label for="role">Role *</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  [(ngModel)]="formData.role"
                  required
                  class="form-control"
                  placeholder="e.g., Developer, Researcher, Farmer"
                />
              </div>
              <div class="form-group">
                <label for="github">GitHub Profile</label>
                <input
                  type="text"
                  id="github"
                  name="github"
                  [(ngModel)]="formData.github"
                  class="form-control"
                  placeholder="https://github.com/username"
                />
              </div>
              <div class="form-group full-width">
                <label for="interest">Interest Area *</label>
                <textarea
                  id="interest"
                  name="interest"
                  [(ngModel)]="formData.interest"
                  required
                  class="form-control"
                  rows="3"
                  placeholder="Tell us about your interests and what you hope to contribute..."
                ></textarea>
              </div>
              <div class="form-group full-width">
                <label for="message">Additional Message</label>
                <textarea
                  id="message"
                  name="message"
                  [(ngModel)]="formData.message"
                  class="form-control"
                  rows="2"
                  placeholder="Any additional information..."
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-submit" [disabled]="isSubmitting">
                {{ isSubmitting ? 'Submitting...' : 'Join Community' }}
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
    .community-practice-page {
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

    .repositories-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .repo-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px 24px;
      border: 1px solid #f3f4f6;
      transition: box-shadow 0.3s ease;
    }

    .repo-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .repo-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .repo-title a {
      color: #1f2937;
      text-decoration: none;
    }

    .repo-title a:hover {
      color: #3b82f6;
    }

    .repo-description {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
      margin: 0 0 12px 0;
    }

    .repo-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #9ca3af;
    }

    .repo-language {
      padding: 2px 8px;
      background: #f3f4f6;
      border-radius: 4px;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .event-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 20px 24px;
      border: 1px solid #f3f4f6;
      transition: box-shadow 0.3s ease;
    }

    .event-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .event-title {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 8px 0;
    }

    .event-description {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
      margin: 0 0 12px 0;
    }

    .event-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #9ca3af;
    }

    .form-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 28px;
      border: 1px solid #f3f4f6;
    }

    .join-form {
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
      .repositories-grid,
      .events-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .repositories-grid,
      .events-grid {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CommunityPracticeComponent implements OnInit {
  protected repositories = signal<Repository[]>([]);
  protected communityEvents = signal<CommunityEvent[]>([]);
  protected isSubmitting = false;

  protected formData = {
    name: '',
    email: '',
    role: '',
    interest: '',
    github: '',
    message: ''
  };

  constructor(
    private repositoryService: RepositoryService,
    private communityEventService: CommunityEventService,
    private submissionService: CommunitySubmissionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.repositoryService.getPublishedRepositories().subscribe({
      next: (repos) => {
        this.repositories.set(repos);
      },
      error: () => {
        this.repositories.set([]);
      }
    });

    this.communityEventService.getUpcomingEvents().subscribe({
      next: (events) => {
        this.communityEvents.set(events);
      },
      error: () => {
        this.communityEvents.set([]);
      }
    });
  }

  onSubmit(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.submissionService.submitCommunityInterest({
      name: this.formData.name,
      email: this.formData.email,
      role: this.formData.role,
      interest: this.formData.interest,
      github: this.formData.github,
      message: this.formData.message,
      is_read: false,
      form_type: 'community'
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notificationService.showSuccess('Your request has been submitted successfully!');
        this.formData = {
          name: '',
          email: '',
          role: '',
          interest: '',
          github: '',
          message: ''
        };
      },
      error: () => {
        this.isSubmitting = false;
        this.notificationService.showError('There was an error submitting your request. Please try again.');
      }
    });
  }
}