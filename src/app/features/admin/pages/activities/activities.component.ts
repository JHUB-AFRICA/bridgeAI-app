// ============================================================
// BRIDGE-AI Kenya - Admin Activities Component
// ============================================================

import { Component, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { Activity } from '../../../core/models/activity.model';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { NotificationService } from '../../../core/services/notification.service';
import { WORK_PACKAGES } from '../../../core/constants/wp-constants';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-admin-activities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ImageUploadComponent,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService],
  template: `
    <div class="admin-activities-page">
      <div class="page-header">
        <h1 class="page-title">Manage Activities</h1>
        <button class="btn-primary" (click)="openCreateModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Activity
        </button>
      </div>

      <!-- Activity List -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>WP</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let activity of activities()">
              <td class="title-cell">{{ activity.title }}</td>
              <td><span class="wp-tag" [style.background]="getWpColor(activity.wp_tag)">{{ activity.wp_tag }}</span></td>
              <td>{{ activity.activity_type }}</td>
              <td>{{ activity.date | date:'dd MMM yyyy' }}</td>
              <td>
                <span class="status-badge" [class]="activity.evidence_status">
                  {{ activity.evidence_status }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-icon edit" (click)="openEditModal(activity)" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button class="btn-icon delete" (click)="deleteActivity(activity.id)" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="activities().length === 0">
              <td colspan="6" class="empty-state">No activities found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingActivity ? 'Edit Activity' : 'New Activity' }}</h2>
            <button class="modal-close" (click)="closeModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveActivity()" #activityForm="ngForm">
              <div class="form-group">
                <label>Title *</label>
                <input type="text" [(ngModel)]="formData.title" name="title" required class="form-control" />
              </div>
              <div class="form-group">
                <label>Slug</label>
                <input type="text" [(ngModel)]="formData.slug" name="slug" class="form-control" placeholder="auto-generated" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Date *</label>
                  <input type="date" [(ngModel)]="formData.date" name="date" required class="form-control" />
                </div>
                <div class="form-group">
                  <label>Work Package *</label>
                  <select [(ngModel)]="formData.wp_tag" name="wp_tag" required class="form-control">
                    <option value="">Select WP</option>
                    <option *ngFor="let wp of workPackages" [value]="wp.id">{{ wp.id }} - {{ wp.name }}</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Activity Type *</label>
                  <input type="text" [(ngModel)]="formData.activity_type" name="activity_type" required class="form-control" placeholder="training, workshop, etc." />
                </div>
                <div class="form-group">
                  <label>Audience</label>
                  <input type="text" [(ngModel)]="formData.audience" name="audience" class="form-control" placeholder="farmers, students, etc." />
                </div>
              </div>
              <div class="form-group">
                <label>Location</label>
                <input type="text" [(ngModel)]="formData.location" name="location" class="form-control" />
              </div>
              <div class="form-group">
                <label>Summary</label>
                <textarea [(ngModel)]="formData.summary" name="summary" class="form-control" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Body *</label>
                <textarea [(ngModel)]="formData.body" name="body" required class="form-control" rows="5"></textarea>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select [(ngModel)]="formData.evidence_status" name="evidence_status" class="form-control">
                  <option value="draft">Draft</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div class="form-group">
                <label>Featured Image</label>
                <app-image-upload (imageUploaded)="formData.featured_image = $event"></app-image-upload>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary" [disabled]="activityForm.invalid">
                  {{ editingActivity ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-activities-page {
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

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      background: #3b82f6;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-secondary {
      padding: 10px 20px;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
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
      padding: 12px 16px;
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
      padding: 12px 16px;
      font-size: 14px;
      color: #1f2937;
      border-bottom: 1px solid #f3f4f6;
    }

    .title-cell {
      font-weight: 500;
    }

    .wp-tag {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      color: #ffffff;
    }

    .status-badge {
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.draft {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-badge.reviewed {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.published {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.archived {
      background: #f3f4f6;
      color: #6b7280;
    }

    .actions-cell {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
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

    .empty-state {
      text-align: center;
      padding: 32px 0;
      color: #6b7280;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .modal {
      background: #ffffff;
      border-radius: 16px;
      max-width: 700px;
      width: 95%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #f3f4f6;
    }

    .modal-header h2 {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 4px;
    }

    .modal-close:hover {
      color: #1f2937;
    }

    .modal-body {
      padding: 24px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 4px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-control {
      width: 100%;
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
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #f3f4f6;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .data-table {
        font-size: 13px;
      }

      .data-table th,
      .data-table td {
        padding: 8px 12px;
      }
    }
  `]
})
export class AdminActivitiesComponent implements OnInit {
  @ViewChild('activityForm') activityForm: any;

  protected activities = signal<Activity[]>([]);
  protected showModal = false;
  protected editingActivity: Activity | null = null;
  protected formData: any = {};
  protected workPackages = WORK_PACKAGES;

  constructor(
    private activityService: ActivityService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  private loadActivities(): void {
    this.activityService.getActivities().subscribe({
      next: (activities) => {
        this.activities.set(activities);
      },
      error: () => {
        this.activities.set([]);
        this.notificationService.showError('Failed to load activities');
      }
    });
  }

  openCreateModal(): void {
    this.editingActivity = null;
    this.formData = {
      title: '',
      slug: '',
      date: new Date().toISOString().split('T')[0],
      wp_tag: '',
      activity_type: '',
      audience: '',
      location: '',
      summary: '',
      body: '',
      evidence_status: 'draft'
    };
    this.showModal = true;
  }

  openEditModal(activity: Activity): void {
    this.editingActivity = activity;
    this.formData = { ...activity };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingActivity = null;
  }

  saveActivity(): void {
    const data = this.formData;

    if (this.editingActivity) {
      this.activityService.updateActivityJson(this.editingActivity.id!, data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Activity updated successfully');
          this.loadActivities();
          this.closeModal();
        },
        error: () => {
          this.notificationService.showError('Failed to update activity');
        }
      });
    } else {
      this.activityService.createActivityJson(data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Activity created successfully');
          this.loadActivities();
          this.closeModal();
        },
        error: () => {
          this.notificationService.showError('Failed to create activity');
        }
      });
    }
  }

  deleteActivity(id: number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this activity?')) {
      this.activityService.deleteActivity(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Activity deleted successfully');
          this.loadActivities();
        },
        error: () => {
          this.notificationService.showError('Failed to delete activity');
        }
      });
    }
  }

  getWpColor(wpTag: string): string {
    const colors: Record<string, string> = {
      'WP1': '#3b82f6',
      'WP2': '#8b5cf6',
      'WP3': '#22c55e',
      'WP4': '#f59e0b',
      'WP5': '#ef4444',
      'WP6': '#06b6d4'
    };
    return colors[wpTag] || '#6b7280';
  }
}