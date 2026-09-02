// ============================================================
// BRIDGE-AI Kenya - Community of Practice Component
// ============================================================

import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RepositoryService } from '../../../../services/repository.service';
import { CommunityEventService } from '../../../../services/community-event.service';
import { CommunitySubmissionService } from '../../../../services/community-submission.service';
import { CommunityEvent } from '../../../core/models/community-event.model';
import { Repository } from '../../../core/models/repository.model';
import { NotificationService } from '../../../core/services/notification.service';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-community-practice',
  standalone: true,
  imports: [CommonModule, FormsModule, EuFundingBannerComponent],
  template: `
    <div class="community-practice-page">
      <section class="hero-section">
        <div class="hero-overlay"></div>
        <div class="container hero-inner">
          <span class="eyebrow">Community Network</span>
          <h1>Community of <span>Practice</span></h1>
          <p>
            Connect, learn, collaborate, and build practical solutions with farmers,
            researchers, innovators, and practitioners across the BRIDGE-AI ecosystem.
          </p>
          <div class="hero-actions">
            <a href="#join-community" class="primary-btn">Join now</a>
            <a href="#repositories" class="secondary-btn">Explore repositories</a>
          </div>
        </div>
      </section>

      <div class="container page-shell">
        <section class="info-strip">
          <div class="info-card">
            <span class="number">52</span>
            <p>Members</p>
          </div>
          <div class="info-card">
            <span class="number">{{ repositories().length }}</span>
            <p>Repositories</p>
          </div>
          <div class="info-card">
            <span class="number">{{ communityEvents().length }}</span>
            <p>Events</p>
          </div>
          <div class="info-card">
            <span class="number">8+</span>
            <p>Countries</p>
          </div>
        </section>

        <section class="panel-section" id="repositories">
          <div class="section-head">
            <span class="section-label">Open resources</span>
            <h2>Repositories</h2>
          </div>

          <div class="card-grid" *ngIf="repositories().length; else noRepositories">
            <article class="content-card repo-card" *ngFor="let repo of repositories()" (click)="openRepoModal(repo)">
              <span class="pill">{{ repo.language || 'Open Access' }}</span>
              <h3>{{ repo.name }}</h3>
              <p>{{ repo.description || 'No description available.' }}</p>
              <div class="card-footer">
                <span>{{ repo.license || 'General' }}</span>
                <span>Open</span>
              </div>
            </article>
          </div>

          <ng-template #noRepositories>
            <div class="empty-state">No repositories available at this time.</div>
          </ng-template>
        </section>

        <section class="panel-section">
          <div class="section-head">
            <span class="section-label">Upcoming</span>
            <h2>Community events</h2>
          </div>

          <div class="card-grid" *ngIf="communityEvents().length; else noEvents">
            <article class="content-card event-card" *ngFor="let event of communityEvents()" (click)="openEventModal(event)">
              <span class="pill status-pill">{{ event.status || 'upcoming' }}</span>
              <h3>{{ event.title }}</h3>
              <p>{{ event.description || 'No description available.' }}</p>
              <div class="event-meta">
                <span>{{ event.date || 'TBD' }}</span>
                <span>{{ event.location || 'Location TBD' }}</span>
              </div>
            </article>
          </div>

          <ng-template #noEvents>
            <div class="empty-state">No community events available at this time.</div>
          </ng-template>
        </section>

        <section class="panel-section join-section" id="join-community">
          <div class="section-head">
            <span class="section-label">Join us</span>
            <h2>Become a community member</h2>
          </div>

          <form class="join-form" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <label>
                <span>Full name</span>
                <input type="text" name="name" [(ngModel)]="formData.name" placeholder="Your full name" required />
              </label>

              <label>
                <span>Email</span>
                <input type="email" name="email" [(ngModel)]="formData.email" placeholder="your@email.com" required />
              </label>

              <label>
                <span>Role</span>
                <select name="role" [(ngModel)]="formData.role" required>
                  <option value="">Select a role</option>
                  <option value="developer">Developer</option>
                  <option value="researcher">Researcher</option>
                  <option value="farmer">Farmer</option>
                  <option value="student">Student</option>
                  <option value="sme">SME</option>
                  <option value="policy">Policy</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label>
                <span>GitHub</span>
                <input type="url" name="github" [(ngModel)]="formData.github" placeholder="https://github.com/username" />
              </label>

              <label class="full-width">
                <span>Area of interest</span>
                <select name="interest" [(ngModel)]="formData.interest" required>
                  <option value="">Select your interest</option>
                  <option value="agritech">Agritech innovation</option>
                  <option value="ai">AI & data science</option>
                  <option value="iot">IoT & smart systems</option>
                  <option value="training">Training & extension</option>
                  <option value="policy">Policy & scaling</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label class="full-width">
                <span>Message</span>
                <textarea rows="4" name="message" [(ngModel)]="formData.message" placeholder="Tell us about your interest and contribution"></textarea>
              </label>
            </div>

            <div class="submit-row">
              <button type="submit" [disabled]="isSubmitting">
                {{ isSubmitting ? 'Submitting...' : 'Join community' }}
              </button>
            </div>
          </form>
        </section>

        <div class="eu-section">
          <app-eu-funding-banner></app-eu-funding-banner>
        </div>
      </div>
    </div>

    <div class="modal-overlay" [class.active]="modalOpen" (click)="closeModal()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div>
            <span class="section-label">{{ modalKind === 'repository' ? 'Repository' : 'Event' }}</span>
            <h3>{{ modalTitle }}</h3>
          </div>
          <button type="button" class="close-btn" (click)="closeModal()">×</button>
        </div>

        <div class="modal-body" *ngIf="modalKind === 'repository' && modalRepository as repo">
          <p>{{ repo.description || 'No description available.' }}</p>
          <div class="modal-meta">
            <span><strong>Language:</strong> {{ repo.language || 'General' }}</span>
            <span><strong>License:</strong> {{ repo.license || 'N/A' }}</span>
          </div>
          <a [href]="repo.url" target="_blank" rel="noopener" class="modal-link">Open repository</a>
        </div>

        <div class="modal-body" *ngIf="modalKind === 'event' && modalEvent as event">
          <p>{{ event.description || 'No description available.' }}</p>
          <div class="modal-meta">
            <span><strong>Date:</strong> {{ event.date || 'TBD' }}</span>
            <span><strong>Status:</strong> {{ event.status || 'upcoming' }}</span>
          </div>
          <div class="modal-meta" *ngIf="event.location">
            <span><strong>Location:</strong> {{ event.location }}</span>
            <span><strong>Type:</strong> {{ event.type || 'general' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: #f7f2e6;
        color: #15231d;
        font-family: 'Inter', 'Segoe UI', sans-serif;
      }

      * { box-sizing: border-box; }
      .container { max-width: 1180px; margin: 0 auto; padding: 0 22px; }
      .hero-section {
        position: relative;
        min-height: 420px;
        display: flex;
        align-items: center;
        background: linear-gradient(rgba(14, 25, 20, 0.68), rgba(14, 25, 20, 0.68)),
          url('https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
        overflow: hidden;
      }
      .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgba(18, 29, 24, 0.82), rgba(18, 29, 24, 0.42));
      }
      .hero-inner {
        position: relative; z-index: 1;
        color: #fff;
        padding-top: 56px;
        padding-bottom: 56px;
      }
      .eyebrow, .section-label {
        display: inline-block;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-size: 0.68rem;
        font-weight: 700;
        color: #d8b35d;
      }
      .hero-section h1 {
        margin: 18px 0 14px;
        font-size: clamp(2.6rem, 5vw, 4.5rem);
        line-height: 1.06;
        letter-spacing: -0.05em;
        font-weight: 900;
      }
      .hero-section h1 span { color: #f5d77e; }
      .hero-section p {
        margin: 0;
        max-width: 700px;
        color: rgba(255,255,255,0.85);
        font-size: 1.12rem;
        line-height: 1.8;
      }
      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-top: 26px;
      }
      .primary-btn, .secondary-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        padding: 13px 23px;
        text-decoration: none;
        font-weight: 700;
        transition: transform 0.2s ease;
      }
      .primary-btn {
        background: #d8b35d;
        color: #132117;
      }
      .secondary-btn {
        border: 1px solid rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.06);
        color: white;
      }
      .primary-btn:hover, .secondary-btn:hover { transform: translateY(-1px); }
      .page-shell { padding-top: 36px; padding-bottom: 64px; }
      .info-strip {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 18px;
        margin-bottom: 30px;
      }
      .info-card {
        background: #fffdf9;
        border: 1px solid #e8dcc2;
        border-radius: 18px;
        padding: 22px 18px;
        text-align: center;
        box-shadow: 0 12px 28px rgba(0,0,0,0.04);
      }
      .number {
        display: block;
        font-size: clamp(2rem, 3vw, 2.5rem);
        font-weight: 800;
        color: #1f3a2d;
        margin-bottom: 8px;
      }
      .info-card p { margin: 0; color: #556a5d; }
      .panel-section {
        margin-top: 30px;
        background: rgba(255,255,255,0.64);
        border: 1px solid rgba(22, 39, 31, 0.08);
        border-radius: 22px;
        padding: 28px 24px;
        box-shadow: 0 18px 42px rgba(18,28,24,0.04);
      }
      .section-head { margin-bottom: 18px; }
      .section-head h2 {
        margin: 10px 0 0;
        font-size: clamp(1.8rem, 3vw, 2.5rem);
        letter-spacing: -0.03em;
      }
      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
      }
      .content-card {
        background: #fffdf9;
        border: 1px solid #eadfc4;
        border-radius: 18px;
        padding: 18px 18px 16px;
        box-shadow: 0 10px 24px rgba(18,28,24,0.03);
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .content-card:hover { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(18,28,24,0.06); }
      .pill {
        display: inline-block;
        border-radius: 999px;
        background: rgba(38,67,43,0.08);
        color: #1f3a2d;
        padding: 6px 10px;
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .status-pill { background: rgba(216,179,93,0.14); color: #7b5a13; }
      .content-card h3 {
        margin: 14px 0 10px;
        font-size: 1.1rem;
        line-height: 1.4;
      }
      .content-card p {
        margin: 0;
        color: #53655c;
        line-height: 1.7;
        font-size: 0.96rem;
      }
      .card-footer, .event-meta {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 18px;
        font-size: 0.74rem;
        color: #66786f;
        flex-wrap: wrap;
      }
      .join-form { margin-top: 8px; }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }
      label {
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: #31413b;
        font-weight: 600;
        font-size: 0.88rem;
      }
      .full-width { grid-column: 1 / -1; }
      input, select, textarea {
        width: 100%;
        border: 1.5px solid #e3dac2;
        border-radius: 12px;
        background: #fffdf9;
        padding: 12px 14px;
        font: inherit;
        color: #18261f;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }
      input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #23483a;
        box-shadow: 0 0 0 4px rgba(35, 72, 58, 0.08);
      }
      textarea { min-height: 120px; resize: vertical; }
      .submit-row {
        margin-top: 22px;
        display: flex;
        justify-content: flex-end;
      }
      button[type='submit'] {
        border: none;
        background: #204832;
        color: white;
        border-radius: 999px;
        padding: 14px 26px;
        font-weight: 700;
        cursor: pointer;
      }
      .empty-state {
        background: #fffdf9;
        border: 1px dashed #d8cba5;
        border-radius: 16px;
        padding: 28px 16px;
        text-align: center;
        color: #5f6f67;
      }
      .eu-section { margin-top: 30px; }
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 19, 0.55);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
        z-index: 1000;
      }
      .modal-overlay.active { display: flex; }
      .modal-card {
        width: min(560px, 100%);
        background: white;
        border-radius: 20px;
        padding: 22px 20px;
        box-shadow: 0 22px 52px rgba(0,0,0,0.12);
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        align-items: center;
        margin-bottom: 12px;
      }
      .modal-header h3 { margin: 8px 0 0; font-size: 1.5rem; }
      .close-btn {
        width: 38px; height: 38px;
        display: grid; place-items: center;
        border: none; border-radius: 50%;
        background: #f4efe4; color: #1f3a2d; font-size: 1.5rem; cursor: pointer;
      }
      .modal-body {
        color: #53655c;
        line-height: 1.8;
      }
      .modal-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 16px 28px;
        margin-top: 14px;
        color: #1d2d28;
        font-size: 0.88rem;
      }
      .modal-link {
        display: inline-block;
        margin-top: 18px;
        color: #1b4b34;
        font-weight: 700;
        text-decoration: none;
      }
      @media (max-width: 820px) { .info-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
      @media (max-width: 640px) {
        .container { padding: 0 18px; }
        .form-grid { grid-template-columns: 1fr; }
        .info-strip { grid-template-columns: 1fr; }
        .panel-section { padding: 22px 18px; }
        .submit-row { justify-content: stretch; }
        button[type='submit'] { width: 100%; }
      }
    `
  ]
})
export class CommunityPracticeComponent implements OnInit {
  protected repositories = signal<Repository[]>([]);
  protected communityEvents = signal<CommunityEvent[]>([]);
  protected isSubmitting = false;
  protected modalOpen = false;
  protected modalKind: 'repository' | 'event' | null = null;
  protected modalTitle = '';
  protected modalRepository: Repository | null = null;
  protected modalEvent: CommunityEvent | null = null;

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
      next: (repos) => this.repositories.set(repos),
      error: () => this.repositories.set([])
    });

    this.communityEventService.getUpcomingEvents().subscribe({
      next: (events) => this.communityEvents.set(events),
      error: () => this.communityEvents.set([])
    });
  }

  openRepoModal(repository: Repository): void {
    this.modalKind = 'repository';
    this.modalTitle = repository.name;
    this.modalRepository = repository;
    this.modalEvent = null;
    this.modalOpen = true;
  }

  openEventModal(event: CommunityEvent): void {
    this.modalKind = 'event';
    this.modalTitle = event.title;
    this.modalEvent = event;
    this.modalRepository = null;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
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
        this.notificationService.showSuccess('Your community application has been submitted successfully.');
        this.formData = { name: '', email: '', role: '', interest: '', github: '', message: '' };
      },
      error: () => {
        this.isSubmitting = false;
        this.notificationService.showError('There was an error submitting your application. Please try again.');
      }
    });
  }
}



































































































































