// ============================================================
// BRIDGE-AI Kenya - Cloudinary Image Component
// ============================================================

import { Component, Input, OnInit, OnChanges, SimpleChanges, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

export interface CloudinaryImageTransformation {
  width?: number;
  height?: number;
  crop?: 'scale' | 'fill' | 'fit' | 'limit' | 'pad' | 'thumb';
  quality?: number | 'auto';
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'gif';
  gravity?: 'center' | 'north' | 'south' | 'east' | 'west' | 'face' | 'faces';
  radius?: number;
  effect?: string;
  dpr?: number;
}

@Component({
  selector: 'app-cloudinary-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cloudinary-image-container" [class.loaded]="isLoaded()" [class.rounded-full]="circle">
      <img
        [src]="imageUrl()"
        [alt]="alt"
        [title]="title"
        [width]="width"
        [height]="height"
        [class.circle]="circle"
        [class.object-cover]="cover"
        [class.object-contain]="!cover"
        (load)="onLoad()"
        (error)="onError()"
        [class.loaded]="isLoaded()"
        [class.error]="hasError()"
        [class.placeholder]="showPlaceholder"
        appLazyLoad
      />
      <div *ngIf="showPlaceholder && !isLoaded() && !hasError()" class="placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <div *ngIf="hasError()" class="error-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>Image unavailable</span>
      </div>
    </div>
  `,
  styles: [`
    .cloudinary-image-container {
      position: relative;
      overflow: hidden;
      background: #f3f4f6;
      width: 100%;
      height: 100%;
    }

    .cloudinary-image-container img {
      width: 100%;
      height: 100%;
      transition: opacity 0.3s ease;
      opacity: 0;
      display: block;
    }

    .cloudinary-image-container img.loaded {
      opacity: 1;
    }

    .cloudinary-image-container img.error {
      opacity: 0;
    }

    .cloudinary-image-container img.circle {
      border-radius: 50%;
    }

    .cloudinary-image-container img.object-cover {
      object-fit: cover;
    }

    .cloudinary-image-container img.object-contain {
      object-fit: contain;
    }

    .placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      background: #f3f4f6;
    }

    .placeholder svg {
      width: 48px;
      height: 48px;
    }

    .error-state {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      background: #f9fafb;
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

    .cloudinary-image-container.rounded-full {
      border-radius: 50%;
    }
  `]
})
export class CloudinaryImageComponent implements OnInit, OnChanges {
  @Input() publicId!: string;
  @Input() alt: string = 'Image';
  @Input() title: string = '';
  @Input() width: number | string = 'auto';
  @Input() height: number | string = 'auto';
  @Input() crop: 'scale' | 'fill' | 'fit' | 'limit' | 'pad' | 'thumb' = 'fit';
  @Input() quality: number | 'auto' = 'auto';
  @Input() format: 'auto' | 'jpg' | 'png' | 'webp' | 'gif' = 'auto';
  @Input() gravity: 'center' | 'north' | 'south' | 'east' | 'west' | 'face' | 'faces' = 'center';
  @Input() radius: number = 0;
  @Input() effect: string = '';
  @Input() circle: boolean = false;
  @Input() cover: boolean = true;
  @Input() dpr: number = 1;
  @Input() showPlaceholder: boolean = true;

  protected isLoaded = signal(false);
  protected hasError = signal(false);

  protected imageUrl = computed(() => {
    if (!this.publicId) {
      return '';
    }

    const cloudName = environment.cloudinary.cloudName;

    if (this.publicId.startsWith('http')) {
      return this.publicId;
    }

    const transformations: string[] = [];

    if (this.crop) {
      transformations.push(`c_${this.crop}`);
    }

    if (this.width && this.width !== 'auto') {
      transformations.push(`w_${this.width}`);
    }

    if (this.height && this.height !== 'auto') {
      transformations.push(`h_${this.height}`);
    }

    if (this.quality && this.quality !== 'auto') {
      transformations.push(`q_${this.quality}`);
    }

    if (this.format && this.format !== 'auto') {
      transformations.push(`f_${this.format}`);
    }

    if (this.gravity && this.gravity !== 'center') {
      transformations.push(`g_${this.gravity}`);
    }

    if (this.radius > 0) {
      transformations.push(`r_${this.radius}`);
    }

    if (this.effect) {
      transformations.push(`e_${this.effect}`);
    }

    if (this.dpr && this.dpr > 1) {
      transformations.push(`dpr_${this.dpr}`);
    }

    const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${this.publicId}`;
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

  protected onLoad(): void {
    this.isLoaded.set(true);
    this.hasError.set(false);
  }

  protected onError(): void {
    this.isLoaded.set(false);
    this.hasError.set(true);
  }

  getPublicIdFromUrl(url: string): string {
    if (!url) return '';

    try {
      const parts = url.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex === -1) return url;

      let publicId = parts.slice(uploadIndex + 2).join('/');
      const lastDot = publicId.lastIndexOf('.');
      if (lastDot > 0) {
        publicId = publicId.substring(0, lastDot);
      }

      return publicId;
    } catch {
      return url;
    }
  }
}