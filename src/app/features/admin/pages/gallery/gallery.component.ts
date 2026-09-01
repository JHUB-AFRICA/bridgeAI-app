// ============================================================
// BRIDGE-AI Kenya - Admin Gallery Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GalleryService } from '../../../../services/gallery.service';
import { GalleryAlbum } from '../../../core/models/gallery.model';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ImageUploadComponent],
  template: `
    <div class="admin-gallery-page">
      <div class="page-header">
        <h1 class="page-title">Manage Gallery</h1>
        <button class="btn-primary" (click)="openCreateModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Album
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Images</th>
              <th>Date</th>
              <th>Published</th>
              <th>Consent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let album of albums()">
              <td class="title-cell">{{ album.title }}</td>
              <td>{{ album.images?.length || 0 }}</td>
              <td>{{ album.date | date:'dd MMM yyyy' }}</td>
              <td>
                <span class="status-badge" [class.published]="album.is_published">
                  {{ album.is_published ? 'Yes' : 'No' }}
                </span>
              </td>
              <td>
                <span class="status-badge" [class.approved]="album.consent_confirmed">
                  {{ album.consent_confirmed ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-icon edit" (click)="openEditModal(album)" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button class="btn-icon delete" (click)="deleteAlbum(album.id)" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="albums().length === 0">
              <td colspan="6" class="empty-state">No albums found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingAlbum ? 'Edit Album' : 'New Album' }}</h2>
            <button class="modal-close" (click)="closeModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveAlbum()" #galleryForm="ngForm">
              <div class="form-group">
                <label>Album Title *</label>
                <input type="text" [(ngModel)]="formData.title" name="title" required class="form-control" />
              </div>
              <div class="form-group">
                <label>Slug</label>
                <input type="text" [(ngModel)]="formData.slug" name="slug" class="form-control" placeholder="auto-generated" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Date</label>
                  <input type="date" [(ngModel)]="formData.date" name="date" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Location</label>
                  <input type="text" [(ngModel)]="formData.location" name="location" class="form-control" />
                </div>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="formData.description" name="description" class="form-control" rows="2"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Is Published</label>
                  <select [(ngModel)]="formData.is_published" name="is_published" class="form-control">
                    <option [value]="true">Yes</option>
                    <option [value]="false">No</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Consent Confirmed</label>
                  <select [(ngModel)]="formData.consent_confirmed" name="consent_confirmed" class="form-control">
                    <option [value]="true">Yes</option>
                    <option [value]="false">No</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Tags (comma separated)</label>
                <input type="text" [(ngModel)]="formData.tags_string" name="tags_string" class="form-control" placeholder="mushroom, training, workshop" />
              </div>
              <div class="form-group">
                <label>Add Images</label>
                <app-image-upload (imageUploaded)="addImage($event)"></app-image-upload>
                <div *ngIf="formData.images && formData.images.length > 0" class="image-list">
                  <div *ngFor="let img of formData.images; let i = index" class="image-item">
                    <img [src]="img.image_path" [alt]="img.caption || 'Image'" />
                    <button type="button" class="remove-image" (click)="removeImage(i)">×</button>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary" [disabled]="galleryForm.invalid">
                  {{ editingAlbum ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-gallery-page {
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

    .status-badge.approved {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge:not(.approved) {
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

    .image-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    .image-item {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }

    .image-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-image {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 20px;
      height: 20px;
      border: none;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.9);
      color: #ffffff;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-image:hover {
      background: #ef4444;
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
export class AdminGalleryComponent implements OnInit {
  protected albums = signal<GalleryAlbum[]>([]);
  protected showModal = false;
  protected editingAlbum: GalleryAlbum | null = null;
  protected formData: any = {};

  constructor(
    private galleryService: GalleryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  private loadAlbums(): void {
    this.galleryService.getAlbums().subscribe({
      next: (albums) => {
        this.albums.set(albums);
      },
      error: () => {
        this.albums.set([]);
        this.notificationService.showError('Failed to load albums');
      }
    });
  }

  openCreateModal(): void {
    this.editingAlbum = null;
    this.formData = {
      title: '',
      slug: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      description: '',
      is_published: true,
      consent_confirmed: false,
      tags_string: '',
      images: []
    };
    this.showModal = true;
  }

  openEditModal(album: GalleryAlbum): void {
    this.editingAlbum = album;
    this.formData = { 
      ...album, 
      tags_string: album.tags ? album.tags.join(', ') : '' 
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingAlbum = null;
  }

  addImage(imageUrl: string): void {
    if (!this.formData.images) {
      this.formData.images = [];
    }
    this.formData.images.push({
      image_path: imageUrl,
      is_approved: true,
      display_order: this.formData.images.length
    });
  }

  removeImage(index: number): void {
    this.formData.images.splice(index, 1);
  }

  saveAlbum(): void {
    const data = { ...this.formData };
    if (data.tags_string) {
      data.tags = data.tags_string.split(',').map((t: string) => t.trim()).filter(Boolean);
    } else {
      data.tags = [];
    }
    delete data.tags_string;

    if (this.editingAlbum) {
      this.galleryService.updateAlbumJson(this.editingAlbum.id!, data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Album updated successfully');
          this.loadAlbums();
          this.closeModal();
        },
        error: () => {
          this.notificationService.showError('Failed to update album');
        }
      });
    } else {
      this.galleryService.createAlbumJson(data).subscribe({
        next: () => {
          this.notificationService.showSuccess('Album created successfully');
          this.loadAlbums();
          this.closeModal();
        },
        error: () => {
          this.notificationService.showError('Failed to create album');
        }
      });
    }
  }

  deleteAlbum(id: number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this album?')) {
      this.galleryService.deleteAlbum(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Album deleted successfully');
          this.loadAlbums();
        },
        error: () => {
          this.notificationService.showError('Failed to delete album');
        }
      });
    }
  }
}