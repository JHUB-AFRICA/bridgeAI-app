// ============================================================
// BRIDGE-AI Kenya - Admin Submissions Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { SubmissionService } from '../../../../services/submission.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AdminDetailsModalService } from '../../components/admin-layout/admin-layout.component';

@Component({
  selector: 'app-admin-submissions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-submissions-page">
      <div class="page-header">
        <h1 class="page-title">Form Submissions</h1>
        <button class="btn-danger" (click)="clearAll()" [disabled]="isClearing() || allSubmissions.length === 0">
          {{ isClearing() ? 'Clearing...' : 'Clear All' }}
        </button>
      </div>

      <div class="tabs">
        <button 
          *ngFor="let tab of tabs" 
          class="tab-btn"
          [class.active]="activeTab === tab.id"
          (click)="selectTab(tab.id)"
        >
          {{ tab.label }}
          <span class="tab-count" *ngIf="getTabCount(tab.id) > 0">{{ getTabCount(tab.id) }}</span>
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredSubmissions()">
              <td>{{ item.name }}</td>
              <td><a [href]="'mailto:' + item.email">{{ item.email }}</a></td>
              <td>{{ getSubmissionDetails(item) }}</td>
              <td>
                <div class="status-list">
                  <span class="status-badge" [class.read]="item.is_read">{{ item.is_read ? 'Read' : 'New' }}</span>
                  <span class="status-badge responded" *ngIf="item.is_responded">Responded</span>
                </div>
              </td>
              <td class="actions-cell">
                <button class="btn-icon view" (click)="viewSubmission(item)" title="View submission" aria-label="View submission"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                <button class="btn-icon read" (click)="markSubmissionRead(item)" [disabled]="item.is_read" title="Mark as read" aria-label="Mark as read"><i class="fa-solid fa-check" aria-hidden="true"></i></button>
                <button class="btn-icon respond" (click)="markSubmissionResponded(item)" [disabled]="item.is_responded" title="Mark as responded" aria-label="Mark as responded"><i class="fa-solid fa-reply" aria-hidden="true"></i></button>
                <button class="btn-icon delete" (click)="deleteSubmission(item.id)" [disabled]="deletingId() === item.id" title="Delete submission" aria-label="Delete submission"><i class="fa-solid fa-trash" aria-hidden="true"></i></button>
              </td>
            </tr>
            <tr *ngIf="filteredSubmissions().length === 0">
              <td colspan="10" class="empty-state">No submissions found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .admin-submissions-page {
      padding: 0 0 32px 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
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

    .btn-danger:disabled { cursor: not-allowed; opacity: .6; }

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

    .status-badge.read {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-badge:not(.read) {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .status-list { display: flex; flex-wrap: wrap; gap: 4px; }
    .status-badge.responded { background: #dcfce7; color: #166534; }
    .data-table td a { color: #2563eb; text-decoration: none; }
    .data-table td a:hover { text-decoration: underline; }

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

    .btn-icon.view {
      background: #f3f4f6;
      color: #6b7280;
    }

    .btn-icon.view:hover {
      background: #e5e7eb;
    }

    .btn-icon.delete {
      background: #fef2f2;
      color: #ef4444;
    }

    .btn-icon.delete:hover {
      background: #fee2e2;
    }

    .btn-icon.respond { background: #eff6ff; color: #2563eb; }
    .btn-icon.respond:hover { background: #dbeafe; }
    .btn-icon:disabled { cursor: not-allowed; opacity: .45; }

    .empty-state {
      text-align: center;
      padding: 24px 0;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

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
export class AdminSubmissionsComponent implements OnInit {
  protected tabs = [
    { id: 'contact', label: 'Contact' },
    { id: 'training', label: 'Training' },
    { id: 'media', label: 'Media' },
    { id: 'sme', label: 'SME' }
  ];
  
  protected activeTab = 'contact';
  protected allSubmissions: any[] = [];
  protected filteredSubmissions = signal<any[]>([]);
  protected isLoading = signal(false);
  protected isClearing = signal(false);
  protected deletingId = signal<number | null>(null);

  constructor(
    private submissionService: SubmissionService,
    private notificationService: NotificationService,
    protected detailsModal: AdminDetailsModalService
  ) {}

  ngOnInit(): void {
    this.loadSubmissions();
  }

  private loadSubmissions(): void {
    this.isLoading.set(true);
    this.submissionService.getSubmissions().pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: (data) => {
        this.allSubmissions = data;
        this.applyFilter();
      },
      error: () => {
        this.allSubmissions = [];
        this.filteredSubmissions.set([]);
        this.notificationService.showError('Failed to load submissions');
      }
    });
  }

  getTabCount(tabId: string): number {
    const filtered = this.allSubmissions.filter(s => s.form_type === tabId);
    return filtered.filter(s => !s.is_read).length;
  }

  selectTab(tabId: string): void {
    this.activeTab = tabId;
    this.applyFilter();
  }

  private applyFilter(): void {
    const filtered = this.allSubmissions.filter(s => s.form_type === this.activeTab);
    const sorted = filtered.sort((a, b) => {
      if (a.is_read && !b.is_read) return 1;
      if (!a.is_read && b.is_read) return -1;
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    });
    this.filteredSubmissions.set(sorted);
  }

  getSubmissionDetails(item: any): string {
    switch (item.form_type) {
      case 'training':
        return `${item.training_interest || 'Training enquiry'}${item.county ? ` · ${item.county}` : ''}`;
      case 'media':
        return `${item.outlet || 'Media enquiry'}${item.request_type ? ` · ${item.request_type}` : ''}`;
      case 'sme':
        return `${item.organisation || 'SME enquiry'}${item.industry ? ` · ${item.industry}` : ''}`;
      default:
        return item.organisation || item.audience || 'General enquiry';
    }
  }

  viewSubmission(item: any): void {
    if (!item.is_read) {
      this.submissionService.markAsRead(item.id).subscribe();
      item.is_read = true;
    }

    this.detailsModal.open(item);
  }

  markSubmissionRead(item: any): void {
    if (!item.is_read) {
      this.submissionService.markAsRead(item.id).subscribe();
      item.is_read = true;
    }
  }

  markSubmissionResponded(item: any): void {
    if (item.is_responded) return;
    this.submissionService.markAsResponded(item.id).subscribe({
      next: () => {
        item.is_responded = true;
        this.notificationService.showSuccess('Submission marked as responded');
      },
      error: () => this.notificationService.showError('Failed to update submission status')
    });
  }

  deleteSubmission(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this submission?')) {
      this.deletingId.set(id);
      this.submissionService.deleteSubmission(id).pipe(finalize(() => this.deletingId.set(null))).subscribe({
        next: () => {
          this.notificationService.showSuccess('Submission deleted');
          this.loadSubmissions();
        },
        error: () => this.notificationService.showError('Failed to delete submission')
      });
    }
  }

  clearAll(): void {
    if (confirm('Delete ALL submissions?')) {
      this.isClearing.set(true);
      this.submissionService.clearAllSubmissions().pipe(finalize(() => this.isClearing.set(false))).subscribe({
        next: () => {
          this.notificationService.showSuccess('All submissions cleared');
          this.loadSubmissions();
        },
        error: () => this.notificationService.showError('Failed to clear submissions')
      });
    }
  }
}