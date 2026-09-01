// ============================================================
// BRIDGE-AI Kenya - Cloudinary Video Component
// ============================================================

import { Component, Input, OnInit, OnChanges, SimpleChanges, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

export interface CloudinaryVideoTransformation {
  width?: number;
  height?: number;
  crop?: 'scale' | 'fill' | 'fit' | 'limit' | 'pad' | 'thumb';
  quality?: number | 'auto';
  format?: 'auto' | 'mp4' | 'webm' | 'ogv';
  bitRate?: number;
  startOffset?: number;
  duration?: number;
  aspectRatio?: string;
}

@Component({
  selector: 'app-cloudinary-video',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cloudinary-video-container" [class.loaded]="isLoaded()">
      <video
        #videoElement
        [src]="videoUrl()"
        [poster]="posterUrl()"
        [controls]="controls"
        [autoplay]="autoplay"
        [loop]="loop"
        [muted]="muted"
        playsinline
        [preload]="preload"
        [width]="width"
        [height]="height"
        (loadedmetadata)="onLoaded()"
        (error)="onError()"
        class="video-player"
        [class.rounded]="rounded"
        [class.rounded-full]="circle"
      ></video>

      <div *ngIf="!isLoaded() && !hasError()" class="loading-state">
        <div class="spinner"></div>
        <span>Loading video...</span>
      </div>

      <div *ngIf="hasError()" class="error-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Video unavailable</span>
      </div>
    </div>
  `,
  styles: [`
    .cloudinary-video-container {
      position: relative;
      overflow: hidden;
      background: #111827;
      width: 100%;
      height: 100%;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .video-player {
      width: 100%;
      height: 100%;
      background: #111827;
    }

    .video-player.rounded {
      border-radius: 8px;
    }

    .video-player.rounded-full {
      border-radius: 50%;
    }

    .loading-state {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      background: #1f2937;
      gap: 12px;
    }

    .loading-state .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #374151;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .loading-state span {
      font-size: 14px;
      color: #6b7280;
    }

    .error-state {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      background: #1f2937;
      gap: 8px;
    }

    .error-state svg {
      width: 32px;
      height: 32px;
    }

    .error-state span {
      font-size: 12px;
      color: #6b7280;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class CloudinaryVideoComponent implements OnInit, OnChanges {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  @Input() publicId!: string;
  @Input() posterPublicId?: string;
  @Input() controls: boolean = true;
  @Input() autoplay: boolean = false;
  @Input() loop: boolean = false;
  @Input() muted: boolean = false;
  @Input() preload: 'auto' | 'metadata' | 'none' = 'metadata';
  @Input() width: number | string = '100%';
  @Input() height: number | string = 'auto';
  @Input() crop: 'scale' | 'fill' | 'fit' | 'limit' | 'pad' | 'thumb' = 'fit';
  @Input() quality: number | 'auto' = 'auto';
  @Input() format: 'auto' | 'mp4' | 'webm' | 'ogv' = 'auto';
  @Input() bitRate?: number;
  @Input() startOffset?: number;
  @Input() duration?: number;
  @Input() aspectRatio?: string;
  @Input() rounded: boolean = false;
  @Input() circle: boolean = false;

  protected isLoaded = signal(false);
  protected hasError = signal(false);

  protected videoUrl = computed(() => {
    if (!this.publicId) {
      return '';
    }

    const cloudName = environment.cloudinary.cloudName;

    if (this.publicId.startsWith('http')) {
      return this.publicId;
    }

    const transformations: string[] = [];

    if (this.crop && this.crop !== 'fit') {
      transformations.push(`c_${this.crop}`);
    }

    if (this.width && this.width !== 'auto' && this.width !== '100%') {
      transformations.push(`w_${this.width}`);
    }

    if (this.height && this.height !== 'auto' && this.height !== '100%') {
      transformations.push(`h_${this.height}`);
    }

    if (this.quality && this.quality !== 'auto') {
      transformations.push(`q_${this.quality}`);
    }

    if (this.format && this.format !== 'auto') {
      transformations.push(`f_${this.format}`);
    }

    if (this.bitRate) {
      transformations.push(`br_${this.bitRate}`);
    }

    if (this.startOffset !== undefined) {
      transformations.push(`so_${this.startOffset}`);
    }

    if (this.duration) {
      transformations.push(`du_${this.duration}`);
    }

    if (this.aspectRatio) {
      transformations.push(`ar_${this.aspectRatio}`);
    }

    const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';

    return `https://res.cloudinary.com/${cloudName}/video/upload/${transformString}${this.publicId}`;
  });

  protected posterUrl = computed(() => {
    if (!this.posterPublicId) {
      return '';
    }

    const cloudName = environment.cloudinary.cloudName;

    if (this.posterPublicId.startsWith('http')) {
      return this.posterPublicId;
    }

    const transformations: string[] = [];

    if (this.width && this.width !== 'auto' && this.width !== '100%') {
      transformations.push(`w_${this.width}`);
    }

    if (this.height && this.height !== 'auto' && this.height !== '100%') {
      transformations.push(`h_${this.height}`);
    }

    if (this.quality && this.quality !== 'auto') {
      transformations.push(`q_${this.quality}`);
    }

    const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';

    return `https://res.cloudinary.com/${cloudName}/video/upload/${transformString}${this.posterPublicId}.jpg`;
  });

  ngOnInit(): void {
    this.isLoaded.set(false);
    this.hasError.set(false);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['publicId']) {
      this.isLoaded.set(false);
      this.hasError.set(false);
    }
  }

  protected onLoaded(): void {
    this.isLoaded.set(true);
    this.hasError.set(false);
  }

  protected onError(): void {
    this.isLoaded.set(false);
    this.hasError.set(true);
  }

  play(): void {
    this.videoElement?.nativeElement.play();
  }

  pause(): void {
    this.videoElement?.nativeElement.pause();
  }

  getVideoElement(): HTMLVideoElement | undefined {
    return this.videoElement?.nativeElement;
  }
}