// ============================================================
// BRIDGE-AI Kenya - Document Upload Component
// ============================================================

import { Component, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryService, CloudinaryUploadResult } from '../../../core/services/cloudinary.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MEDIA } from '../../../core/constants/app.constants';
import { FileSizePipe } from '../../pipes/file-size.pipe';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface DocumentFileType {
  extension: string;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, FileSizePipe],
  template: `
    <div class="document-upload-wrapper">
      <div
        class="document-drop-zone"
        [class.dragover]="isDragover"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
      >
        <div class="drop-content">
          <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p class="drop-text">Upload a document</p>
          <p class="drop-subtext">or drag and drop</p>
          <p class="file-types">PDF, Word, Excel, PowerPoint, Text, ZIP</p>
          <p class="file-size-limit">Max: {{ maxSize }}</p>
        </div>
        <input
          #fileInput
          type="file"
          [accept]="acceptedTypes"
          (change)="onFileSelected($event)"
          class="hidden-input"
          [disabled]="isUploading"
        />
      </div>

      <div *ngIf="selectedFile" class="file-info">
        <div class="file-details">
          <span class="file-icon">{{ getFileIcon(selectedFile) }}</span>
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">{{ selectedFile.size | fileSize }}</span>
          <span class="file-type">{{ getFileTypeLabel(selectedFile) }}</span>
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
        <span class="result-text">Document uploaded successfully</span>
      </div>

      <div *ngIf="uploadError" class="upload-error">
        <span class="result-icon error">✕</span>
        <span class="result-text">{{ uploadError }}</span>
      </div>

    </div>
  `,
  styles: [`
    .document-upload-wrapper {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    .document-drop-zone {
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #fafafa;
    }

    .document-drop-zone:hover {
      border-color: #3b82f6;
      background: #f0f4ff;
    }

    .document-drop-zone.dragover {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .drop-content {
      pointer-events: none;
    }

    .upload-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 12px;
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

    .file-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #f3f4f6;
      border-radius: 8px;
      margin-top: 12px;
    }

    .file-details {
      display: flex;
      align-items: center;
      gap: 12px;
      overflow: hidden;
      flex-wrap: wrap;
    }

    .file-icon {
      font-size: 20px;
    }

    .file-name {
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 150px;
    }

    .file-size {
      font-size: 12px;
      color: #6b7280;
      white-space: nowrap;
    }

    .file-type {
      font-size: 11px;
      padding: 2px 8px;
      background: #e5e7eb;
      border-radius: 4px;
      color: #4b5563;
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
      height: 8px;
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
      padding: 12px 16px;
      background: #d1fae5;
      border-radius: 8px;
      margin-top: 12px;
    }

    .upload-error {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
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
export class DocumentUploadComponent implements OnDestroy {
  @Output() documentUploaded = new EventEmitter<string>();
  @Output() uploadComplete = new EventEmitter<{ url: string; publicId: string }>();

  @Input() acceptedTypes: string = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.txt,.csv,.json,.xml';
  @Input() maxFileSize: number = MEDIA.MAX_FILE_SIZE;
  @Input() folder = '';

  selectedFile: File | null = null;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  uploadResult: string | null = null;
  uploadError: string | null = null;
  isDragover: boolean = false;

  private documentTypeMap: Record<string, DocumentFileType> = {
    'pdf': { extension: 'pdf', label: 'PDF', icon: '📄', color: '#ef4444' },
    'doc': { extension: 'doc', label: 'Word', icon: '📝', color: '#3b82f6' },
    'docx': { extension: 'docx', label: 'Word', icon: '📝', color: '#3b82f6' },
    'ppt': { extension: 'ppt', label: 'PowerPoint', icon: '📊', color: '#f59e0b' },
    'pptx': { extension: 'pptx', label: 'PowerPoint', icon: '📊', color: '#f59e0b' },
    'xls': { extension: 'xls', label: 'Excel', icon: '📈', color: '#22c55e' },
    'xlsx': { extension: 'xlsx', label: 'Excel', icon: '📈', color: '#22c55e' },
    'zip': { extension: 'zip', label: 'Archive', icon: '📦', color: '#8b5cf6' },
    'rar': { extension: 'rar', label: 'Archive', icon: '📦', color: '#8b5cf6' },
    'txt': { extension: 'txt', label: 'Text', icon: '📃', color: '#6b7280' },
    'csv': { extension: 'csv', label: 'CSV', icon: '📊', color: '#06b6d4' },
    'json': { extension: 'json', label: 'JSON', icon: '📋', color: '#f59e0b' },
    'xml': { extension: 'xml', label: 'XML', icon: '📋', color: '#f59e0b' }
  };

  constructor(
    private cloudinaryService: CloudinaryService,
    private notificationService: NotificationService
  ) {}

  get maxSize(): string {
    return this.formatFileSize(this.maxFileSize);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateAndSetFile(input.files[0]);
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
      this.validateAndSetFile(files[0]);
    }
  }

  private validateAndSetFile(file: File): void {
    this.uploadError = null;
    this.uploadResult = null;

    const extension = this.getFileExtension(file.name);

    if (!this.isValidDocument(extension)) {
      const errorMsg = 'Invalid file type. Please upload a supported document format.';
      this.uploadError = errorMsg;
      this.notificationService.showError(errorMsg);
      return;
    }

    if (file.size > this.maxFileSize) {
      const errorMsg = `File size exceeds maximum allowed (${this.formatFileSize(this.maxFileSize)})`;
      this.uploadError = errorMsg;
      this.notificationService.showError(errorMsg);
      return;
    }

    this.selectedFile = file;
  }

  removeFile(): void {
    this.selectedFile = null;
    this.uploadResult = null;
    this.uploadError = null;
    this.uploadProgress = 0;
  }

  uploadPending(): Observable<CloudinaryUploadResult | null> {
    if (!this.selectedFile) return of(null);
    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadError = null;
    this.uploadResult = null;

    const file = this.selectedFile;

    this.simulateProgress();

    return this.cloudinaryService.uploadDocument(file, this.folder || undefined).pipe(
      tap((response) => {
        this.isUploading = false;
        this.uploadProgress = 100;
        this.uploadResult = response.secure_url;
        this.selectedFile = null;

        this.documentUploaded.emit(response.secure_url);
        this.uploadComplete.emit({
          url: response.secure_url,
          publicId: response.public_id
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
      next: () => this.notificationService.showSuccess('Document uploaded successfully'),
      error: () => this.notificationService.showError(this.uploadError || 'Upload failed. Please try again.')
    });
  }

  getFileIcon(file: File): string {
    const extension = this.getFileExtension(file.name);
    const docType = this.documentTypeMap[extension];
    return docType?.icon || '📄';
  }

  getFileTypeLabel(file: File): string {
    const extension = this.getFileExtension(file.name);
    const docType = this.documentTypeMap[extension];
    return docType?.label || extension.toUpperCase();
  }

  getFileColor(file: File): string {
    const extension = this.getFileExtension(file.name);
    const docType = this.documentTypeMap[extension];
    return docType?.color || '#6b7280';
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  private isValidDocument(extension: string): boolean {
    return extension in this.documentTypeMap;
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

  ngOnDestroy(): void {
    this.isUploading = false;
  }
}