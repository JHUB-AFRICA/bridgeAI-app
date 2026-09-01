// ============================================================
// BRIDGE-AI Kenya - Admin Submissions Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SubmissionService } from '../../../../services/submission.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-submissions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-submissions-page">
      <div class="page-header">
        <h1 class="page-title">Form Submissions</h1>
        <button class="btn-danger" (click)="clearAll()">Clear All</button>
      </div>

      <div class="tabs">
        <button 
          *ngFor="let tab of tabs" 
          class="tab-btn"
          [class.active]="activeTab === tab.id"
          (click)="activeTab = tab.id"
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
              <th *ngIf="activeTab === 'contact'">Email</th>
              <th *ngIf="activeTab === 'contact'">Organisation</th>
              <th *ngIf="activeTab === 'training'">Email</th>
              <th *ngIf="activeTab === 'training'">Training Interest</th>
              <th *ngIf="activeTab === 'media'">Outlet</th>
              <th *ngIf="activeTab === 'media'">Request Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredSubmissions()">
              <td>{{ item.name }}</td>
              <td *ngIf="activeTab === 'contact'">{{ item.email }}</td>
              <td *ngIf="activeTab === 'contact'">{{ item.organisation || 'N/A' }}</td>
              <td *ngIf="activeTab === 'training'">{{ item.email }}</td>
              <td *ngIf="activeTab === 'training'">{{ item.training_interest }}</td>
              <td *ngIf="activeTab === 'media'">{{ item.outlet }}</td>
              <td *ngIf="activeTab === 'media'">{{ item.request_type }}</td>
              <td>
                <span class="status-badge" [class.read]="item.is_read">
                  {{ item.is_read ? 'Read' : 'New' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-icon view" (click)="viewSubmission(item)">👁️</button>
                <button class="btn-icon delete" (click)="deleteSubmission(item.id)">🗑️</button>
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

  constructor(
    private submissionService: SubmissionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadSubmissions();
  }

  private loadSubmissions(): void {
    this.submissionService.getSubmissions().subscribe({
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

  private applyFilter(): void {
    const filtered = this.allSubmissions.filter(s => s.form_type === this.activeTab);
    const sorted = filtered.sort((a, b) => {
      if (a.is_read && !b.is_read) return 1;
      if (!a.is_read && b.is_read) return -1;
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
    });
    this.filteredSubmissions.set(sorted);
  }

  viewSubmission(item: any): void {
    if (!item.is_read) {
      this.submissionService.markAsRead(item.id).subscribe();
      item.is_read = true;
    }

    let details = `Name: ${item.name}\nEmail: ${item.email}\nType: ${item.form_type}\nSubmitted: ${new Date(item.submitted_at).toLocaleString()}\n\n`;

    if (item.form_type === 'contact') {
      details += `Organisation: ${item.organisation || 'N/A'}\nAudience: ${item.audience}\nMessage: ${item.message}`;
    } else if (item.form_type === 'training') {
      details += `Phone: ${item.phone || 'N/A'}\nCounty: ${item.county || 'N/A'}\nTraining Interest: ${item.training_interest}\nMessage: ${item.message || 'N/A'}`;
    } else if (item.form_type === 'media') {
      details += `Outlet: ${item.outlet}\nRequest Type: ${item.request_type}\nDeadline: ${item.deadline || 'N/A'}\nMessage: ${item.message}`;
    } else if (item.form_type === 'sme') {
      details += `Organisation: ${item.organisation}\nIndustry: ${item.industry}\nInterest: ${item.interest}\nMessage: ${item.message || 'N/A'}`;
    }

    alert(details);
  }

  deleteSubmission(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this submission?')) {
      this.submissionService.deleteSubmission(id).subscribe({
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
      this.submissionService.clearAllSubmissions().subscribe({
        next: () => {
          this.notificationService.showSuccess('All submissions cleared');
          this.loadSubmissions();
        },
        error: () => this.notificationService.showError('Failed to clear submissions')
      });
    }
  }
}