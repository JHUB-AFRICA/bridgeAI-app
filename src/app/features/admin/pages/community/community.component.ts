// ============================================================
// BRIDGE-AI Kenya - Admin Community Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RepositoryService } from '../../../../services/repository.service';
import { CommunityEventService } from '../../../../services/community-event.service';
import { CommunitySubmissionService } from '../../../../services/community-submission.service';
import { Repository } from '../../../core/models/repository.model';
import { CommunityEvent } from '../../../core/models/community-event.model';
import { CommunitySubmission } from '../../../core/models/submission.model';
import { NotificationService } from '../../../core/services/notification.service';
import { AdminDetailsModalService } from '../../components/admin-layout/admin-layout.component';

@Component({
  selector: 'app-admin-community',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-community-page">
      <div class="page-header">
        <h1 class="page-title">Community Management</h1>
      </div>

      <div class="tabs">
        <button 
          *ngFor="let tab of tabs" 
          class="tab-btn"
          [class.active]="activeTab === tab.id"
          (click)="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Repositories -->
      <div *ngIf="activeTab === 'repositories'" class="tab-content">
        <div class="content-header">
          <h2>Repositories</h2>
          <button class="btn-primary" (click)="openRepositoryModal()">Add Repository</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Language</th>
                <th>License</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of repositories()">
                <td><a [href]="item.url" target="_blank">{{ item.name }}</a></td>
                <td>{{ item.language }}</td>
                <td>{{ item.license }}</td>
                <td>
                  <span class="status-badge" [class.published]="item.is_published">
                    {{ item.is_published ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button class="btn-icon view" (click)="detailsModal.open(item)" title="View"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                  <button class="btn-icon edit" (click)="editRepository(item)">✏️</button>
                  <button class="btn-icon delete" (click)="deleteRepository(item.id)">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="repositories().length === 0">
                <td colspan="5" class="empty-state">No repositories found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Community Events -->
      <div *ngIf="activeTab === 'events'" class="tab-content">
        <div class="content-header">
          <h2>Community Events</h2>
          <button class="btn-primary" (click)="openEventModal()">Add Event</button>
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
              <tr *ngFor="let item of communityEvents()">
                <td>{{ item.title }}</td>
                <td>{{ item.date | date:'dd MMM yyyy' }}</td>
                <td>{{ item.location }}</td>
                <td><span class="status-badge" [class]="item.status">{{ item.status }}</span></td>
                <td class="actions-cell">
                  <button class="btn-icon view" (click)="detailsModal.open(item)" title="View"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                  <button class="btn-icon edit" (click)="editCommunityEvent(item)">✏️</button>
                  <button class="btn-icon delete" (click)="deleteCommunityEvent(item.id)">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="communityEvents().length === 0">
                <td colspan="5" class="empty-state">No community events found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Community Submissions -->
      <div *ngIf="activeTab === 'submissions'" class="tab-content">
        <div class="content-header">
          <h2>Community Join Requests</h2>
          <button class="btn-danger" (click)="clearSubmissions()">Clear All</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Interest</th>
                <th>GitHub</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of submissions()">
                <td>{{ item.name }}</td>
                <td>{{ item.role }}</td>
                <td>{{ item.interest }}</td>
                <td><a *ngIf="item.github" [href]="item.github" target="_blank">Link</a></td>
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
    .admin-community-page {
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

    .status-badge.published {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge:not(.published) {
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
export class AdminCommunityComponent implements OnInit {
  protected tabs = [
    { id: 'repositories', label: 'Repositories' },
    { id: 'events', label: 'Events' },
    { id: 'submissions', label: 'Join Requests' }
  ];
  
  protected activeTab = 'repositories';
  
  protected repositories = signal<Repository[]>([]);
  protected communityEvents = signal<CommunityEvent[]>([]);
  protected submissions = signal<CommunitySubmission[]>([]);

  constructor(
    private repositoryService: RepositoryService,
    private communityEventService: CommunityEventService,
    private submissionService: CommunitySubmissionService,
    private notificationService: NotificationService,
    protected detailsModal: AdminDetailsModalService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.repositoryService.getRepositories().subscribe({
      next: (data) => this.repositories.set(data),
      error: () => this.repositories.set([])
    });

    this.communityEventService.getEvents().subscribe({
      next: (data) => this.communityEvents.set(data),
      error: () => this.communityEvents.set([])
    });

    this.submissionService.getSubmissions().subscribe({
      next: (data) => this.submissions.set(data),
      error: () => this.submissions.set([])
    });
  }

  openRepositoryModal(): void {
    const name = prompt('Enter repository name:');
    if (name) {
      const description = prompt('Enter description:');
      if (description) {
        const url = prompt('Enter repository URL:');
        if (url) {
          this.notificationService.showInfo('Creating repository...');
          this.repositoryService.createRepository({ 
            name, 
            description, 
            url,
            is_published: true 
          }).subscribe({
            next: () => {
              this.notificationService.showSuccess('Repository created');
              this.loadData();
            },
            error: () => this.notificationService.showError('Failed to create repository')
          });
        }
      }
    }
  }

  editRepository(item: Repository): void {
    const newName = prompt('Edit name:', item.name);
    if (newName && newName !== item.name) {
      this.notificationService.showInfo('Updating repository...');
      this.repositoryService.updateRepository(item.id!, { ...item, name: newName }).subscribe({
        next: () => {
          this.notificationService.showSuccess('Repository updated');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to update repository')
      });
    }
  }

  deleteRepository(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this repository?')) {
      this.repositoryService.deleteRepository(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Repository deleted');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to delete repository')
      });
    }
  }

  openEventModal(): void {
    const title = prompt('Enter event title:');
    if (title) {
      const description = prompt('Enter description:');
      if (description) {
        const date = prompt('Enter date (YYYY-MM-DD):');
        if (date) {
          this.notificationService.showInfo('Creating community event...');
          this.communityEventService.createEvent({ 
            title, 
            description, 
            date,
            type: 'meeting',
            status: 'upcoming' 
          }).subscribe({
            next: () => {
              this.notificationService.showSuccess('Community event created');
              this.loadData();
            },
            error: () => this.notificationService.showError('Failed to create community event')
          });
        }
      }
    }
  }

  editCommunityEvent(item: CommunityEvent): void {
    const newTitle = prompt('Edit title:', item.title);
    if (newTitle && newTitle !== item.title) {
      this.notificationService.showInfo('Updating community event...');
      this.communityEventService.updateEvent(item.id!, { ...item, title: newTitle }).subscribe({
        next: () => {
          this.notificationService.showSuccess('Community event updated');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to update community event')
      });
    }
  }

  deleteCommunityEvent(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this community event?')) {
      this.communityEventService.deleteEvent(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Community event deleted');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to delete community event')
      });
    }
  }

  viewSubmission(item: CommunitySubmission): void {
    if (!item.is_read) {
      this.submissionService.markAsRead(item.id!).subscribe();
      item.is_read = true;
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
    if (confirm('Delete ALL community join requests?')) {
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