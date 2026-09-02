// ============================================================
// BRIDGE-AI Kenya - Admin Replication Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReplicationResourceService } from '../../../../services/replication-resource.service';
import { ReplicationTemplateService } from '../../../../services/replication-template.service';
import { ReplicationLessonService } from '../../../../services/replication-lesson.service';
import { ReplicationResource } from '../../../core/models/replication-resource.model';
import { ReplicationTemplate } from '../../../core/models/replication-template.model';
import { ReplicationLesson } from '../../../core/models/replication-lesson.model';
import { DocumentUploadComponent } from '../../../shared/components/document-upload/document-upload.component';
import { NotificationService } from '../../../core/services/notification.service';
import { AdminDetailsModalService } from '../../components/admin-layout/admin-layout.component';

@Component({
  selector: 'app-admin-replication',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DocumentUploadComponent],
  template: `
    <div class="admin-replication-page">
      <div class="page-header">
        <h1 class="page-title">Replication Toolkit Management</h1>
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

      <!-- Resources -->
      <div *ngIf="activeTab === 'resources'" class="tab-content">
        <div class="content-header">
          <h2>Replication Resources</h2>
          <button class="btn-primary" (click)="openResourceModal()">Add Resource</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of resources()">
                <td class="title-cell">{{ item.title }}</td>
                <td>{{ item.description }}</td>
                <td><a *ngIf="item.file_path" [href]="item.file_path" target="_blank">View</a></td>
                <td class="actions-cell">
                  <button class="btn-icon view" (click)="detailsModal.open(item)" title="View"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                  <button class="btn-icon edit" (click)="editResource(item)">✏️</button>
                  <button class="btn-icon delete" (click)="deleteResource(item.id)">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="resources().length === 0">
                <td colspan="4" class="empty-state">No replication resources found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Templates -->
      <div *ngIf="activeTab === 'templates'" class="tab-content">
        <div class="content-header">
          <h2>Replication Templates</h2>
          <button class="btn-primary" (click)="openTemplateModal()">Add Template</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of templates()">
                <td class="title-cell">{{ item.title }}</td>
                <td>{{ item.description }}</td>
                <td><a *ngIf="item.file_path" [href]="item.file_path" target="_blank">View</a></td>
                <td class="actions-cell">
                  <button class="btn-icon view" (click)="detailsModal.open(item)" title="View"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                  <button class="btn-icon edit" (click)="editTemplate(item)">✏️</button>
                  <button class="btn-icon delete" (click)="deleteTemplate(item.id)">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="templates().length === 0">
                <td colspan="4" class="empty-state">No replication templates found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Lessons -->
      <div *ngIf="activeTab === 'lessons'" class="tab-content">
        <div class="content-header">
          <h2>Lessons Learned</h2>
          <button class="btn-primary" (click)="openLessonModal()">Add Lesson</button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of lessons()">
                <td class="title-cell">{{ item.title }}</td>
                <td>{{ item.description }}</td>
                <td>
                  <span class="status-badge" [class.published]="item.is_published">
                    {{ item.is_published ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button class="btn-icon view" (click)="detailsModal.open(item)" title="View"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                  <button class="btn-icon edit" (click)="editLesson(item)">✏️</button>
                  <button class="btn-icon delete" (click)="deleteLesson(item.id)">🗑️</button>
                </td>
              </tr>
              <tr *ngIf="lessons().length === 0">
                <td colspan="4" class="empty-state">No lessons found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Resource Modal -->
      <div class="modal-overlay" *ngIf="showResourceModal" (click)="closeResourceModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingResource ? 'Edit Resource' : 'New Resource' }}</h2>
            <button class="modal-close" (click)="closeResourceModal()">×</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveResource()">
              <div class="form-group">
                <label>Title *</label>
                <input type="text" [(ngModel)]="resourceForm.title" name="resTitle" required class="form-control" />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="resourceForm.description" name="resDesc" class="form-control" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Upload File</label>
                <app-document-upload (documentUploaded)="resourceForm.file_path = $event"></app-document-upload>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-secondary" (click)="closeResourceModal()">Cancel</button>
                <button type="submit" class="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Template Modal -->
      <div class="modal-overlay" *ngIf="showTemplateModal" (click)="closeTemplateModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingTemplate ? 'Edit Template' : 'New Template' }}</h2>
            <button class="modal-close" (click)="closeTemplateModal()">×</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveTemplate()">
              <div class="form-group">
                <label>Title *</label>
                <input type="text" [(ngModel)]="templateForm.title" name="tplTitle" required class="form-control" />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="templateForm.description" name="tplDesc" class="form-control" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Upload File</label>
                <app-document-upload (documentUploaded)="templateForm.file_path = $event"></app-document-upload>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-secondary" (click)="closeTemplateModal()">Cancel</button>
                <button type="submit" class="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Lesson Modal -->
      <div class="modal-overlay" *ngIf="showLessonModal" (click)="closeLessonModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingLesson ? 'Edit Lesson' : 'New Lesson' }}</h2>
            <button class="modal-close" (click)="closeLessonModal()">×</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveLesson()">
              <div class="form-group">
                <label>Title *</label>
                <input type="text" [(ngModel)]="lessonForm.title" name="lsnTitle" required class="form-control" />
              </div>
              <div class="form-group">
                <label>Description *</label>
                <textarea [(ngModel)]="lessonForm.description" name="lsnDesc" required class="form-control" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Content (optional)</label>
                <textarea [(ngModel)]="lessonForm.content" name="lsnContent" class="form-control" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Is Published</label>
                <select [(ngModel)]="lessonForm.is_published" name="lsnPublished" class="form-control">
                  <option [value]="true">Yes</option>
                  <option [value]="false">No</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-secondary" (click)="closeLessonModal()">Cancel</button>
                <button type="submit" class="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-replication-page {
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

    .btn-secondary {
      padding: 8px 16px;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 13px;
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

    .title-cell {
      font-weight: 500;
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

    .empty-state {
      text-align: center;
      padding: 24px 0;
      color: #6b7280;
    }

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
      max-width: 600px;
      width: 95%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #f3f4f6;
    }

    .modal-header h2 {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #6b7280;
      cursor: pointer;
    }

    .modal-body {
      padding: 20px;
    }

    .form-group {
      margin-bottom: 14px;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 4px;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
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
      gap: 10px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #f3f4f6;
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
export class AdminReplicationComponent implements OnInit {
  protected tabs = [
    { id: 'resources', label: 'Resources' },
    { id: 'templates', label: 'Templates' },
    { id: 'lessons', label: 'Lessons' }
  ];
  
  protected activeTab = 'resources';
  
  protected resources = signal<ReplicationResource[]>([]);
  protected templates = signal<ReplicationTemplate[]>([]);
  protected lessons = signal<ReplicationLesson[]>([]);

  protected showResourceModal = false;
  protected showTemplateModal = false;
  protected showLessonModal = false;
  
  protected editingResource: ReplicationResource | null = null;
  protected editingTemplate: ReplicationTemplate | null = null;
  protected editingLesson: ReplicationLesson | null = null;
  
  protected resourceForm: any = { title: '', description: '', file_path: '' };
  protected templateForm: any = { title: '', description: '', file_path: '' };
  protected lessonForm: any = { title: '', description: '', content: '', is_published: true };

  constructor(
    private resourceService: ReplicationResourceService,
    private templateService: ReplicationTemplateService,
    private lessonService: ReplicationLessonService,
    private notificationService: NotificationService,
    protected detailsModal: AdminDetailsModalService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.resourceService.getResources().subscribe({
      next: (data) => this.resources.set(data),
      error: () => this.resources.set([])
    });

    this.templateService.getTemplates().subscribe({
      next: (data) => this.templates.set(data),
      error: () => this.templates.set([])
    });

    this.lessonService.getLessons().subscribe({
      next: (data) => this.lessons.set(data),
      error: () => this.lessons.set([])
    });
  }

  openResourceModal(): void {
    this.editingResource = null;
    this.resourceForm = { title: '', description: '', file_path: '' };
    this.showResourceModal = true;
  }

  closeResourceModal(): void {
    this.showResourceModal = false;
    this.editingResource = null;
  }

  editResource(item: ReplicationResource): void {
    this.editingResource = item;
    this.resourceForm = { ...item };
    this.showResourceModal = true;
  }

  saveResource(): void {
    if (this.editingResource) {
      this.resourceService.updateResourceJson(this.editingResource.id!, this.resourceForm).subscribe({
        next: () => {
          this.notificationService.showSuccess('Resource updated');
          this.loadData();
          this.closeResourceModal();
        },
        error: () => this.notificationService.showError('Failed to update resource')
      });
    } else {
      this.resourceService.createResourceJson(this.resourceForm).subscribe({
        next: () => {
          this.notificationService.showSuccess('Resource created');
          this.loadData();
          this.closeResourceModal();
        },
        error: () => this.notificationService.showError('Failed to create resource')
      });
    }
  }

  deleteResource(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this resource?')) {
      this.resourceService.deleteResource(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Resource deleted');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to delete resource')
      });
    }
  }

  openTemplateModal(): void {
    this.editingTemplate = null;
    this.templateForm = { title: '', description: '', file_path: '' };
    this.showTemplateModal = true;
  }

  closeTemplateModal(): void {
    this.showTemplateModal = false;
    this.editingTemplate = null;
  }

  editTemplate(item: ReplicationTemplate): void {
    this.editingTemplate = item;
    this.templateForm = { ...item };
    this.showTemplateModal = true;
  }

  saveTemplate(): void {
    if (this.editingTemplate) {
      this.templateService.updateTemplateJson(this.editingTemplate.id!, this.templateForm).subscribe({
        next: () => {
          this.notificationService.showSuccess('Template updated');
          this.loadData();
          this.closeTemplateModal();
        },
        error: () => this.notificationService.showError('Failed to update template')
      });
    } else {
      this.templateService.createTemplateJson(this.templateForm).subscribe({
        next: () => {
          this.notificationService.showSuccess('Template created');
          this.loadData();
          this.closeTemplateModal();
        },
        error: () => this.notificationService.showError('Failed to create template')
      });
    }
  }

  deleteTemplate(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this template?')) {
      this.templateService.deleteTemplate(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Template deleted');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to delete template')
      });
    }
  }

  openLessonModal(): void {
    this.editingLesson = null;
    this.lessonForm = { title: '', description: '', content: '', is_published: true };
    this.showLessonModal = true;
  }

  closeLessonModal(): void {
    this.showLessonModal = false;
    this.editingLesson = null;
  }

  editLesson(item: ReplicationLesson): void {
    this.editingLesson = item;
    this.lessonForm = { ...item };
    this.showLessonModal = true;
  }

  saveLesson(): void {
    if (this.editingLesson) {
      this.lessonService.updateLesson(this.editingLesson.id!, this.lessonForm).subscribe({
        next: () => {
          this.notificationService.showSuccess('Lesson updated');
          this.loadData();
          this.closeLessonModal();
        },
        error: () => this.notificationService.showError('Failed to update lesson')
      });
    } else {
      this.lessonService.createLesson(this.lessonForm).subscribe({
        next: () => {
          this.notificationService.showSuccess('Lesson created');
          this.loadData();
          this.closeLessonModal();
        },
        error: () => this.notificationService.showError('Failed to create lesson')
      });
    }
  }

  deleteLesson(id: number | undefined): void {
    if (!id) return;
    if (confirm('Delete this lesson?')) {
      this.lessonService.deleteLesson(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Lesson deleted');
          this.loadData();
        },
        error: () => this.notificationService.showError('Failed to delete lesson')
      });
    }
  }
}