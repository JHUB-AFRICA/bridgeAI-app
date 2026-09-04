// ============================================================
// BRIDGE-AI Kenya - Image Upload Component
// ============================================================

import { Component, EventEmitter, Output, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryService, CloudinaryUploadResult } from '../../../core/services/cloudinary.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MEDIA } from '../../../core/constants/app.constants';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, FileSizePipe],
  template: `
    <div class="image-upload-wrapper">
      <div
        class="image-drop-zone"
        [class.dragover]="isDragover"
        [class.has-image]="previewUrl"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
      >
        <div *ngIf="!previewUrl" class="drop-content">
          <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p class="drop-text">Upload an image</p>
          <p class="drop-subtext">or drag and drop</p>
          <p class="file-types">JPG, PNG, GIF, WEBP, SVG</p>
          <p class="file-size-limit">Max: {{ maxSize }}</p>
        </div>

        <div *ngIf="previewUrl" class="image-preview">
          <img [src]="previewUrl" alt="Image preview" class="preview-image" />
          <div class="preview-overlay">
            <span>Click to change</span>
          </div>
        </div>

        <input
          #fileInput
          type="file"
          accept="image/*"
          [multiple]="multiple"
          (change)="onFileSelected($event)"
          class="hidden-input"
          [disabled]="isUploading"
        />
      </div>

      <div *ngIf="selectedFile" class="file-info">
        <div class="file-details">
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">{{ selectedFile.size | fileSize }}</span>
        </div>
        <button
          (click)="removeFile()"
          class="remove-btn"
          [disabled]="isUploading"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div *ngIf="isUploading" class="upload-progress">
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="uploadProgress"></div>
        </div>
        <span class="progress-text">{{ uploadProgress }}%</span>
      </div>

      <div *ngIf="uploadResult" class="upload-result">
        <span class="result-icon success">✓</span>
        <span class="result-text">Image uploaded successfully</span>
      </div>

      <div *ngIf="uploadError" class="upload-error">
        <span class="result-icon error">✕</span>
        <span class="result-text">{{ uploadError }}</span>
      </div>

    </div>
  `,
  styles: [`
    .image-upload-wrapper {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    .image-drop-zone {
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #fafafa;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .image-drop-zone:hover {
      border-color: #3b82f6;
      background: #f0f4ff;
    }

    .image-drop-zone.dragover {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .image-drop-zone.has-image {
      padding: 4px;
      min-height: 150px;
    }

    .drop-content {
      pointer-events: none;
    }

    .upload-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 8px;
      color: #9ca3af;
      display: block;
    }

    .drop-text {
      font-size: 16px;
      font-weight: 500;
      color: #374151;
      margin: 0;
    }

    .drop-subtext {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 8px 0;
    }

    .file-types {
      font-size: 12px;
      color: #9ca3af;
      margin: 0;
    }

    .file-size-limit {
      font-size: 12px;
      color: #9ca3af;
      margin: 4px 0 0 0;
    }

    .hidden-input {
      display: none;
    }

    .image-preview {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .preview-image {
      max-width: 100%;
      max-height: 300px;
      border-radius: 8px;
      object-fit: contain;
    }

    .preview-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .preview-overlay span {
      color: #ffffff;
      font-size: 14px;
      font-weight: 500;
    }

    .image-preview:hover .preview-overlay {
      opacity: 1;
    }

    .file-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: #f3f4f6;
      border-radius: 8px;
      margin-top: 12px;
    }

    .file-details {
      display: flex;
      align-items: center;
      gap: 12px;
      overflow: hidden;
    }

    .file-name {
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .file-size {
      font-size: 12px;
      color: #6b7280;
      white-space: nowrap;
    }

    .remove-btn {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .remove-btn:hover {
      background: #fef2f2;
    }

    .remove-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .upload-progress {
      margin-top: 12px;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-text {
      display: block;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }

    .upload-result {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: #d1fae5;
      border-radius: 8px;
      margin-top: 12px;
    }

    .upload-error {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: #fee2e2;
      border-radius: 8px;
      margin-top: 12px;
    }

    .result-icon {
      font-weight: 700;
      font-size: 16px;
    }

    .result-icon.success {
      color: #065f46;
    }

    .result-icon.error {
      color: #991b1b;
    }

    .result-text {
      font-size: 14px;
    }

    .upload-result .result-text {
      color: #065f46;
    }

    .upload-error .result-text {
      color: #991b1b;
    }

    .upload-actions {
      margin-top: 12px;
      display: flex;
      justify-content: flex-end;
    }

    .upload-btn {
      padding: 10px 24px;
      background: #3b82f6;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .upload-btn:hover:not(:disabled) {
      background: #2563eb;
    }

    .upload-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ImageUploadComponent implements OnDestroy, OnChanges {
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() uploadComplete = new EventEmitter<{ url: string; publicId: string }>();
  @Output() imageRemoved = new EventEmitter<void>();

  @Input() maxFileSize: number = MEDIA.MAX_IMAGE_SIZE;
  @Input() folder = '';
  @Input() initialImage: string | null = null;
  @Input() multiple = false;

  selectedFile: File | null = null;
  private pendingFiles: File[] = [];
  previewUrl: string | null = null;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  uploadResult: string | null = null;
  uploadError: string | null = null;
  isDragover: boolean = false;

  constructor(
    private cloudinaryService: CloudinaryService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialImage'] && !this.selectedFile) {
      this.previewUrl = this.initialImage;
    }
  }

  get maxSize(): string {
    return this.formatFileSize(this.maxFileSize);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (this.multiple) {
        this.pendingFiles = [];
        Array.from(input.files).forEach(file => this.validateAndAddFile(file));
      } else {
        this.validateAndSetFile(input.files[0]);
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragover = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      if (this.multiple) {
        this.pendingFiles = [];
        Array.from(files).forEach(file => this.validateAndAddFile(file));
      } else {
        this.validateAndSetFile(files[0]);
      }
    }
  }

  private validateAndSetFile(file: File): void {
    this.pendingFiles = [];
    this.validateAndAddFile(file);
  }

  private validateAndAddFile(file: File): void {
    this.uploadError = null;
    this.uploadResult = null;

    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select an image file.';
      this.uploadError = errorMsg;
      this.notificationService.showError(errorMsg);
      return;
    }

    if (file.size > this.maxFileSize) {
      const errorMsg = `Image size exceeds maximum allowed (${this.formatFileSize(this.maxFileSize)})`;
      this.uploadError = errorMsg;
      this.notificationService.showError(errorMsg);
      return;
    }

    this.pendingFiles.push(file);
    this.selectedFile = this.pendingFiles[0];
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = URL.createObjectURL(this.selectedFile);
  }

  removeFile(): void {
    this.deleteStoredImage();
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.selectedFile = null;
    this.pendingFiles = [];
    this.previewUrl = null;
    this.uploadResult = null;
    this.uploadError = null;
    this.uploadProgress = 0;
    this.imageRemoved.emit();
  }

  uploadPending(): Observable<CloudinaryUploadResult | null> {
    return this.uploadPendingAll().pipe(map(responses => responses[0] || null));
  }

  uploadPendingAll(): Observable<CloudinaryUploadResult[]> {
    const files = this.pendingFiles.length > 0 ? this.pendingFiles : (this.selectedFile ? [this.selectedFile] : []);
    if (files.length === 0) return of([]);
    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadError = null;
    this.uploadResult = null;

    this.simulateProgress();

    return forkJoin(files.map(file => this.cloudinaryService.uploadFile(file, {
      resource_type: 'image',
      folder: this.folder || undefined,
      tags: ['bridge-ai', 'image']
    }))).pipe(
      tap((responses) => {
        this.isUploading = false;
        this.uploadProgress = 100;
        this.uploadResult = responses[0]?.secure_url || null;

        this.deleteStoredImage(false);
        this.initialImage = responses[0]?.secure_url || null;
        this.selectedFile = null;
        this.pendingFiles = [];

        responses.forEach(response => {
          this.imageUploaded.emit(response.secure_url);
          this.uploadComplete.emit({
            url: response.secure_url,
            publicId: response.public_id
          });
        });

      }),
      catchError((error) => {
        this.isUploading = false;
        this.uploadProgress = 0;
        const errorMsg = error.message || 'Upload failed. Please try again.';
        this.uploadError = errorMsg;
        return throwError(() => error);
      })
    );
  }

  startUpload(): void {
    this.uploadPending().subscribe({
      next: () => this.notificationService.showSuccess('Image uploaded successfully'),
      error: () => this.notificationService.showError(this.uploadError || 'Upload failed. Please try again.')
    });
  }

  private simulateProgress(): void {
    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 90 && !this.uploadResult && !this.uploadError) {
        progress += Math.random() * 10;
        if (progress > 90) {
          progress = 90;
        }
        this.uploadProgress = Math.round(progress);
      } else {
        clearInterval(interval);
      }
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
    }, 8000);
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private deleteStoredImage(showProgress = true): void {
    if (!this.initialImage || !this.initialImage.startsWith('http')) {
      return;
    }

    const publicId = this.cloudinaryService.extractPublicId(this.initialImage);
    if (publicId) {
      if (showProgress) {
        this.notificationService.showInfo('Deleting image...');
      }
      this.cloudinaryService.deleteFile(publicId).subscribe({
        next: () => {
          if (showProgress) {
            this.notificationService.showSuccess('Image deleted successfully');
          }
        },
        error: () => this.notificationService.showError('The image was removed from the form, but could not be deleted from Cloudinary')
      });
    }
  }

  ngOnDestroy(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.isUploading = false;
  }
}