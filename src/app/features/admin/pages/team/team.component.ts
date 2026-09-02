// ============================================================
// BRIDGE-AI Kenya - Admin Team Component
// ============================================================

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TeamService } from '../../../../services/team.service';
import { TeamMember } from '../../../core/models/team.model';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { NotificationService } from '../../../core/services/notification.service';
import { AdminDetailsModalService } from '../../components/admin-layout/admin-layout.component';

@Component({
  selector: 'app-admin-team',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ImageUploadComponent],
  template: `
    <div class="admin-team-page">
      <div class="page-header">
        <h1 class="page-title">Manage Team</h1>
        <button class="btn-primary" (click)="openCreateModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Team Member
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Role</th>
              <th>Affiliation</th>
              <th>Visible</th>
              <th>Consent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let member of team()">
              <td>
                <div class="photo-preview" *ngIf="member.photo">
                  <img [src]="member.photo" [alt]="member.name" />
                </div>
                <div class="photo-placeholder" *ngIf="!member.photo">No Photo</div>
              </td>
              <td class="title-cell">{{ member.name }}</td>
              <td>{{ member.role }}</td>
              <td>{{ member.affiliation }}</td>
              <td>
                <span class="status-badge" [class.visible]="member.is_visible">
                  {{ member.is_visible ? 'Yes' : 'No' }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class.approved]="member.consent_status === 'approved'">
                  {{ member.consent_status }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-icon view" (click)="detailsModal.open(member)" title="View"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                <button class="btn-icon edit" (click)="openEditModal(member)" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button class="btn-icon delete" (click)="deleteMember(member.id)" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="team().length === 0">
              <td colspan="7" class="empty-state">No team members found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingMember ? 'Edit Team Member' : 'New Team Member' }}</h2>
            <button class="modal-close" (click)="closeModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveMember()" #teamForm="ngForm">
              <div class="form-row">
                <div class="form-group">
                  <label>Name *</label>
                  <input type="text" [(ngModel)]="formData.name" name="name" required class="form-control" />
                </div>
                <div class="form-group">
                  <label>Role *</label>
                  <input type="text" [(ngModel)]="formData.role" name="role" required class="form-control" />
                </div>
              </div>
              <div class="form-group">
                <label>Affiliation</label>
                <input type="text" [(ngModel)]="formData.affiliation" name="affiliation" class="form-control" />
              </div>
              <div class="form-group">
                <label>Bio</label>
                <textarea [(ngModel)]="formData.bio" name="bio" class="form-control" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="formData.email" name="email" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Display Order</label>
                  <input type="number" [(ngModel)]="formData.display_order" name="display_order" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Is Visible</label>
                  <select [(ngModel)]="formData.is_visible" name="is_visible" class="form-control">
                    <option [value]="true">Yes</option>
                    <option [value]="false">No</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Consent Status</label>
                <select [(ngModel)]="formData.consent_status" name="consent_status" class="form-control">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>
              <div class="form-group">
                <label>Photo</label>
                <app-image-upload (imageUploaded)="formData.photo = $event"></app-image-upload>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary" [disabled]="teamForm.invalid">
                  {{ editingMember ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-team-page {
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

    .photo-preview {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background: #f8fafc;
    }

    .photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      color: #9ca3af;
      text-align: center;
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

    .status-badge.visible {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge:not(.visible) {
      background: #f3f4f6;
      color: #6b7280;
    }

    .status-badge.approved {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge:not(.approved) {
      background: #fef3c7;
      color: #92400e;
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
export class AdminTeamComponent implements OnInit {
  protected team = signal<TeamMember[]>([]);
  protected showModal = false;
  protected editingMember: TeamMember | null = null;
  protected formData: any = {};

  constructor(
    private teamService: TeamService,
    private notificationService: NotificationService
  ) {}

  protected detailsModal = inject(AdminDetailsModalService);

  ngOnInit(): void {
    this.loadTeam();
  }

  private loadTeam(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (members) => {
        this.team.set(members);
      },
      error: () => {
        this.team.set([]);
        this.notificationService.showError('Failed to load team members');
      }
    });
  }

  openCreateModal(): void {
    this.editingMember = null;
    this.formData = {
      name: '',
      role: '',
      affiliation: '',
      bio: '',
      email: '',
      display_order: 0,
      is_visible: true,
      consent_status: 'pending'
    };
    this.showModal = true;
  }

  openEditModal(member: TeamMember): void {
    this.editingMember = member;
    this.formData = { ...member };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingMember = null;
  }

  saveMember(): void {
    const data = this.formData;

    if (this.editingMember) {
      this.teamService.updateTeamMemberJson(this.editingMember.id!, data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Team member updated successfully');
          this.loadTeam();
          this.closeModal();
        },
        error: () => {
          this.notificationService.showError('Failed to update team member');
        }
      });
    } else {
      this.teamService.createTeamMemberJson(data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Team member created successfully');
          this.loadTeam();
          this.closeModal();
        },
        error: () => {
          this.notificationService.showError('Failed to create team member');
        }
      });
    }
  }

  deleteMember(id: number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this team member?')) {
      this.teamService.deleteTeamMember(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Team member deleted successfully');
          this.loadTeam();
        },
        error: () => {
          this.notificationService.showError('Failed to delete team member');
        }
      });
    }
  }
}