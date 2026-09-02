// ============================================================
// BRIDGE-AI Kenya - Admin SME Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChallengeService } from '../../../../services/challenge.service';
import { HackathonService } from '../../../../services/hackathon.service';
import { SuccessStoryService } from '../../../../services/success-story.service';
import { SmeSubmissionService } from '../../../../services/sme-submission.service';
import { Challenge } from '../../../core/models/challenge.model';
import { Hackathon } from '../../../core/models/hackathon.model';
import { SuccessStory } from '../../../core/models/success-story.model';
import { SMESubmission } from '../../../core/models/submission.model';
import { NotificationService } from '../../../core/services/notification.service';
import { AdminDetailsModalService } from '../../components/admin-layout/admin-layout.component';

interface Tab {
  id: string;
  label: string;
  count: number;
}

@Component({
  selector: 'app-admin-sme',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-sme-page">
      <div class="page-header">
        <h1 class="page-title">SME Management</h1>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          *ngFor="let tab of tabs"
          class="tab-btn"
          [class.active]="activeTab === tab.id"
          (click)="activeTab = tab.id"
        >
          {{ tab.label }}
          <span class="tab-count" *ngIf="tab.count > 0">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Challenges -->
      <div *ngIf="activeTab === 'challenges'" class="tab-content">
        <div class="content-header">
          <h2>Challenges</h2>
          <button class="btn-primary" (click)="openChallengeModal()">Add Challenge</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of challenges()">
                <td>{{ item.title }}</td>
                <td><span class="status-badge" [class]="item.status">{{ item.status }}</span></td>
                <td>{{ item.deadline | date:'dd MMM yyyy' }}</td>
                <td>
                  <span class="status-badge" [class.published]="item.is_published">
                    {{ item.is_published ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button class="btn-icon view" (click)="detailsModal.open(item)" title="View"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                  <button class="btn-icon edit" (click)="editChallenge(item)">✏️</button>
                  <button class="btn-icon delete" (click)="deleteChallenge(item.id)">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="challenges().length === 0">
                <td colspan="5" class="empty-state">No challenges found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Hackathons -->
      <div *ngIf="activeTab === 'hackathons'" class="tab-content">
        <div class="content-header">
          <h2>Hackathons</h2>
          <button class="btn-primary" (click)="openHackathonModal()">Add Hackathon</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of hackathons()">
                <td>{{ item.title }}</td>
                <td>{{ item.date | date:'dd MMM yyyy' }}</td>
                <td>{{ item.location }}</td>
                <td><span class="status-badge" [class]="item.status">{{ item.status }}</span></td>
                <td class="actions-cell">
                  <button class="btn-icon view" (click)="detailsModal.open(item)" title="View"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                  <button class="btn-icon edit" (click)="editHackathon(item)">✏️</button>
                  <button class="btn-icon delete" (click)="deleteHackathon(item.id)">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="hackathons().length === 0">
                <td colspan="5" class="empty-state">No hackathons found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Success Stories -->
      <div *ngIf="activeTab === 'stories'" class="tab-content">
        <div class="content-header">
          <h2>Success Stories</h2>
          <button class="btn-primary" (click)="openStoryModal()">Add Story</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>SME</th>
                <th>Title</th>
                <th>Industry</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of stories()">
                <td>{{ item.sme_name }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.industry }}</td>
                <td>
                  <span class="status-badge" [class.published]="item.is_published">
                    {{ item.is_published ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button class="btn-icon view" (click)="detailsModal.open(item)" title="View"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                  <button class="btn-icon edit" (click)="editStory(item)">✏️</button>
                  <button class="btn-icon delete" (click)="deleteStory(item.id)">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="stories().length === 0">
                <td colspan="5" class="empty-state">No success stories found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SME Submissions -->
      <div *ngIf="activeTab === 'submissions'" class="tab-content">
        <div class="content-header">
          <h2>SME Submissions</h2>
          <button class="btn-danger" (click)="clearSubmissions()">Clear All</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Organisation</th>
                <th>Industry</th>
                <th>Interest</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of submissions()">
                <td>{{ item.name }}</td>
                <td>{{ item.organisation }}</td>
                <td>{{ item.industry }}</td>
                <td>{{ item.interest }}</td>
                <td>
                  <span class="status-badge" [class.read]="item.is_read">
                    {{ item.is_read ? 'Read' : 'New' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button class="btn-icon view" (click)="viewSubmission(item)">👁️</button>
                  <button class="btn-icon read" (click)="viewSubmission(item)" title="Mark as read"><i class="fa-solid fa-check" aria-hidden="true"></i></button>
                  <button class="btn-icon delete" (click)="deleteSubmission(item.id)">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="submissions().length === 0">
                <td colspan="6" class="empty-state">No submissions found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-sme-page {
      padding: 0 0 32px 0;
    }

    .page-header {
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .tabs {
      display: flex;
      gap: 4px;
      background: #f8fafc;
      padding: 4px;
      border-radius: 10px;
      margin-bottom: 20px;
      border: 1px solid #f3f4f6;
    }

    .tab-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #6b7280;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .tab-btn:hover {
      background: #ffffff;
      color: #1f2937;
    }

    .tab-btn.active {
      background: #ffffff;
      color: #3b82f6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    }

    .tab-count {
      background: #e5e7eb;
      color: #6b7280;
      padding: 1px 8px;
      border-radius: 12px;
      font-size: 11px;
      margin-left: 4px;
    }

    .tab-btn.active .tab-count {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .tab-content {
      display: block;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .content-header h2 {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .btn-primary {
      padding: 8px 16px;
      background: #3b82f6;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-danger {
      padding: 8px 16px;
      background: #ef4444;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .table-container {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #f3f4f6;
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      padding: 10px 14px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: #f8fafc;
      border-bottom: 1px solid #f3f4f6;
    }

    .data-table td {
      padding: 10px 14px;
      font-size: 14px;
      color: #1f2937;
      border-bottom: 1px solid #f3f4f6;
    }

    .status-badge {
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.open {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.closed {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-badge.upcoming {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .status-badge.ongoing {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.completed {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-badge.published {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge:not(.published) {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-badge.read {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-badge:not(.read) {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .actions-cell {
      display: flex;
      gap: 4px;
    }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .btn-icon.edit {
      background: #eff6ff;
      color: #3b82f6;
    }

    .btn-icon.edit:hover {
      background: #dbeafe;
    }

    .btn-icon.delete {
      background: #fef2f2;
      color: #ef4444;
    }

    .btn-icon.delete:hover {
      background: #fee2e2;
    }

    .btn-icon.view {
      background: #f3f4f6;
      color: #6b7280;
    }

    .btn-icon.view:hover {
      background: #e5e7eb;
    }

    .empty-state {
      text-align: center;
      padding: 24px 0;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .tabs {
        flex-wrap: wrap;
      }

      .tab-btn {
        font-size: 12px;
        padding: 6px 12px;
      }

      .data-table {
        font-size: 13px;
      }

      .data-table th,
      .data-table td {
        padding: 6px 10px;
      }
    }
  `]
})
export class AdminSmeComponent implements OnInit {
  protected tabs: Tab[] = [
    { id: 'challenges', label: 'Challenges', count: 0 },
    { id: 'hackathons', label: 'Hackathons', count: 0 },
    { id: 'stories', label: 'Success Stories', count: 0 },
    { id: 'submissions', label: 'Submissions', count: 0 }
  ];

  protected activeTab = 'challenges';

  protected challenges = signal<Challenge[]>([]);
  protected hackathons = signal<Hackathon[]>([]);
  protected stories = signal<SuccessStory[]>([]);
  protected submissions = signal<SMESubmission[]>([]);

  constructor(
    private challengeService: ChallengeService,
    private hackathonService: HackathonService,
    private storyService: SuccessStoryService,
    private submissionService: SmeSubmissionService,
    private notificationService: NotificationService,
    protected detailsModal: AdminDetailsModalService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.challengeService.getChallenges().subscribe({
      next: (data: Challenge[]) => {
        this.challenges.set(data);
        this.updateTabCounts();
      },
      error: () => {
        this.challenges.set([]);
        this.updateTabCounts();
      }
    });

    this.hackathonService.getHackathons().subscribe({
      next: (data: Hackathon[]) => {
        this.hackathons.set(data);
        this.updateTabCounts();
      },
      error: () => {
        this.hackathons.set([]);
        this.updateTabCounts();
      }
    });

    this.storyService.getStories().subscribe({
      next: (data: SuccessStory[]) => {
        this.stories.set(data);
        this.updateTabCounts();
      },
      error: () => {
        this.stories.set([]);
        this.updateTabCounts();
      }
    });

    this.submissionService.getSubmissions().subscribe({
      next: (data: SMESubmission[]) => {
        this.submissions.set(data);
        this.updateTabCounts();
      },
      error: () => {
        this.submissions.set([]);
        this.updateTabCounts();
      }
    });
  }

  private updateTabCounts(): void {
    this.tabs = this.tabs.map((tab: Tab) => {
      let count = 0;
      switch (tab.id) {
        case 'challenges':
          count = this.challenges().length;
          break;
        case 'hackathons':
          count = this.hackathons().length;
          break;
        case 'stories':
          count = this.stories().length;
          break;
        case 'submissions':
          count = this.submissions().filter((s: SMESubmission) => !s.is_read).length;
          break;
      }
      return { ...tab, count };
    });
  }

  openChallengeModal(): void {
    const title = prompt('Enter challenge title:');
    if (title) {
      const description = prompt('Enter challenge description:');
      if (description) {
        this.challengeService.createChallenge({
          title,
          description,
          status: 'open',
          is_published: true
        }).subscribe({
          next: () => {
            this.notificationService.showSuccess('Challenge created');
            this.loadData();
          },
          error: () => this.notificationService.showError('Failed to create challenge')
        });
      }
    }
  }

  editChallenge(item: Challenge): void {
    const newTitle = prompt('Edit title:', item.title);
    if (newTitle && newTitle !== item.title) {
      this.challengeService.updateChallenge(item.id!, { ...item, title: newTitle }).subscribe({
        next: () => {
          this.notificationService.showSuccess('Challenge updated');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to update challenge')
      });
    }
  }

  deleteChallenge(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this challenge?')) {
      this.challengeService.deleteChallenge(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Challenge deleted');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to delete challenge')
      });
    }
  }

  openHackathonModal(): void {
    const title = prompt('Enter hackathon title:');
    if (title) {
      const description = prompt('Enter hackathon description:');
      if (description) {
        const date = prompt('Enter date (YYYY-MM-DD):');
        if (date) {
          this.hackathonService.createHackathon({
            title,
            description,
            date,
            status: 'upcoming',
            is_published: true
          }).subscribe({
            next: () => {
              this.notificationService.showSuccess('Hackathon created');
              this.loadData();
            },
            error: () => this.notificationService.showError('Failed to create hackathon')
          });
        }
      }
    }
  }

  editHackathon(item: Hackathon): void {
    const newTitle = prompt('Edit title:', item.title);
    if (newTitle && newTitle !== item.title) {
      this.hackathonService.updateHackathon(item.id!, { ...item, title: newTitle }).subscribe({
        next: () => {
          this.notificationService.showSuccess('Hackathon updated');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to update hackathon')
      });
    }
  }

  deleteHackathon(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this hackathon?')) {
      this.hackathonService.deleteHackathon(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Hackathon deleted');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to delete hackathon')
      });
    }
  }

  openStoryModal(): void {
    const smeName = prompt('Enter SME name:');
    if (smeName) {
      const title = prompt('Enter story title:');
      if (title) {
        const story = prompt('Enter story content:');
        if (story) {
          this.storyService.createStoryJson({
            sme_name: smeName,
            title,
            story,
            is_published: true
          }).subscribe({
            next: () => {
              this.notificationService.showSuccess('Success story created');
              this.loadData();
            },
            error: () => this.notificationService.showError('Failed to create success story')
          });
        }
      }
    }
  }

  editStory(item: SuccessStory): void {
    const newTitle = prompt('Edit title:', item.title);
    if (newTitle && newTitle !== item.title) {
      this.storyService.updateStoryJson(item.id!, { ...item, title: newTitle }).subscribe({
        next: () => {
          this.notificationService.showSuccess('Success story updated');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to update success story')
      });
    }
  }

  deleteStory(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this success story?')) {
      this.storyService.deleteStory(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Success story deleted');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to delete success story')
      });
    }
  }

  viewSubmission(item: SMESubmission): void {
    if (!item.is_read) {
      this.submissionService.markAsRead(item.id!).subscribe();
      item.is_read = true;
      this.updateTabCounts();
    }
    this.detailsModal.open(item);
  }

  deleteSubmission(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this submission?')) {
      this.submissionService.deleteSubmission(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Submission deleted');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to delete submission')
      });
    }
  }

  clearSubmissions(): void {
    if (confirm('Delete ALL SME submissions?')) {
      this.submissionService.clearAllSubmissions().subscribe({
        next: () => {
          this.notificationService.showSuccess('All submissions cleared');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to clear submissions')
      });
    }
  }
}