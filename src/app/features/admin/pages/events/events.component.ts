// ============================================================
// BRIDGE-AI Kenya - Admin Events Component
// ============================================================

import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../../services/event.service';
import { Event } from '../../../core/models/event.model';
import { ImageUploadComponent } from '../../../shared/components/image-upload/image-upload.component';
import { NotificationService } from '../../../core/services/notification.service';
import { AdminDetailsModalService } from '../../components/admin-layout/admin-layout.component';
import { switchMap } from 'rxjs/operators';
import { CloudinaryService } from '../../../core/services/cloudinary.service';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ImageUploadComponent],
  template: `
    <div class="admin-events-page">
      <div class="page-header">
        <h1 class="page-title">Manage Events</h1>
        <button class="btn-primary" (click)="openCreateModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Event
        </button>
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
            <tr *ngFor="let event of events()">
              <td class="title-cell">{{ event.title }}</td>
              <td>{{ event.date | date:'dd MMM yyyy' }}</td>
              <td>{{ event.location }}</td>
              <td>
                <span class="status-badge" [class]="event.status">
                  {{ event.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-icon view" (click)="detailsModal.open(event)" title="View"><i class="fa-solid fa-eye" aria-hidden="true"></i></button>
                <button class="btn-icon edit" (click)="openEditModal(event)" title="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button class="btn-icon delete" (click)="deleteEvent(event.id)" title="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="events().length === 0">
              <td colspan="5" class="empty-state">No events found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingEvent ? 'Edit Event' : 'New Event' }}</h2>
            <button class="modal-close" (click)="closeModal()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveEvent()" #eventForm="ngForm">
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
                  <label>Time</label>
                  <input type="time" [(ngModel)]="formData.time" name="time" class="form-control" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Location</label>
                  <input type="text" [(ngModel)]="formData.location" name="location" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Venue</label>
                  <input type="text" [(ngModel)]="formData.venue" name="venue" class="form-control" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Audience</label>
                  <input type="text" [(ngModel)]="formData.audience" name="audience" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Capacity</label>
                  <input type="number" [(ngModel)]="formData.capacity" name="capacity" class="form-control" />
                </div>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="formData.description" name="description" class="form-control" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Agenda</label>
                <textarea [(ngModel)]="formData.agenda" name="agenda" class="form-control" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Speakers</label>
                <textarea [(ngModel)]="formData.speakers" name="speakers" class="form-control" rows="2"></textarea>
              </div>
              <div class="form-group">
                <label>Registration Link</label>
                <input type="url" [(ngModel)]="formData.registration_link" name="registration_link" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Status</label>
                  <select [(ngModel)]="formData.status" name="status" class="form-control">
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Post-Event Report</label>
                <textarea [(ngModel)]="formData.post_event_report" name="post_event_report" class="form-control" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label>Featured Image</label>
                <app-image-upload
                  [folder]="'events'"
                  [initialImage]="formData.featured_image || null"
                  (imageUploaded)="formData.featured_image = $event"
                  (imageRemoved)="formData.featured_image = ''"
                ></app-image-upload>
              </div>
              <div class="form-actions">
                <button type="button" class="btn-secondary" (click)="closeModal()">Cancel</button>
                <button type="submit" class="btn-primary" [disabled]="eventForm.invalid">
                  {{ editingEvent ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-events-page {
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

    .status-badge.cancelled {
      background: #fee2e2;
      color: #991b1b;
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
export class AdminEventsComponent implements OnInit {
  @ViewChild(ImageUploadComponent) imageUpload?: ImageUploadComponent;
  protected events = signal<Event[]>([]);
  protected showModal = false;
  protected editingEvent: Event | null = null;
  protected formData: any = {};

  constructor(
    private eventService: EventService,
    private notificationService: NotificationService,
    private cloudinaryService: CloudinaryService,
    protected detailsModal: AdminDetailsModalService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events.set(events);
      },
      error: () => {
        this.events.set([]);
        this.notificationService.showError('Failed to load events');
      }
    });
  }

  openCreateModal(): void {
    this.editingEvent = null;
    this.formData = {
      title: '',
      slug: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: '',
      venue: '',
      description: '',
      agenda: '',
      audience: '',
      capacity: null,
      speakers: '',
      registration_link: '',
      status: 'upcoming',
      post_event_report: '',
      featured_image: ''
    };
    this.showModal = true;
  }

  openEditModal(event: Event): void {
    this.editingEvent = event;
    this.formData = { ...event };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingEvent = null;
  }

  saveEvent(): void {
    const data = { ...this.formData };
    const isEditing = !!this.editingEvent;
    this.notificationService.showInfo(isEditing ? 'Updating event...' : 'Creating event...');

    this.imageUpload!.uploadPending().pipe(switchMap(upload => {
      if (upload) data.featured_image = upload.secure_url;
      return isEditing
        ? this.eventService.updateEventJson(this.editingEvent!.id!, data)
        : this.eventService.createEventJson(data);
    })).subscribe({
        next: () => {
          this.notificationService.showSuccess(isEditing ? 'Event updated successfully' : 'Event created successfully');
          this.loadEvents();
          this.closeModal();
        },
        error: () => {
          this.notificationService.showError(isEditing ? 'Failed to update event' : 'Failed to create event');
        }
      });
  }

  deleteEvent(id: number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this event?')) {
      const event = this.events().find(item => item.id === id);
      this.cloudinaryService.deleteUrls([event?.featured_image]).pipe(
        switchMap(() => this.eventService.deleteEvent(id))
      ).subscribe({
        next: () => {
          this.notificationService.showSuccess('Event deleted successfully');
          this.loadEvents();
        },
        error: () => {
          this.notificationService.showError('Failed to delete event and its image');
        }
      });
    }
  }
}