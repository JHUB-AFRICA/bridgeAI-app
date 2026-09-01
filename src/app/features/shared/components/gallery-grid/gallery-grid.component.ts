// ============================================================
// BRIDGE-AI Kenya - Gallery Grid Component
// ============================================================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GalleryAlbum } from '../../../core/models/gallery.model';
import { CloudinaryImageComponent } from '../cloudinary-image/cloudinary-image.component';

@Component({
  selector: 'app-gallery-grid',
  standalone: true,
  imports: [CommonModule, RouterModule, CloudinaryImageComponent],
  template: `
    <div class="gallery-grid">
      <div *ngFor="let album of albums" class="gallery-item">
        <a [routerLink]="['/gallery', album.slug]" class="gallery-link">
          <div class="gallery-image">
            <app-cloudinary-image
              *ngIf="album.images && album.images.length > 0"
              [publicId]="album.images[0].image_path"
              [alt]="album.title"
              [width]="400"
              [height]="300"
              crop="fill"
              quality="auto"
            ></app-cloudinary-image>
            <div *ngIf="!album.images || album.images.length === 0" class="image-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div class="image-overlay">
              <span class="image-count">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                {{ album.images?.length || 0 }} photos
              </span>
            </div>
          </div>
          <div class="gallery-info">
            <h3 class="gallery-title">{{ album.title }}</h3>
            <p *ngIf="album.date" class="gallery-date">{{ album.date | date:'dd MMM yyyy' }}</p>
          </div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .gallery-item {
      border-radius: 12px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      border: 1px solid #f3f4f6;
    }

    .gallery-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .gallery-link {
      text-decoration: none;
      display: block;
    }

    .gallery-image {
      position: relative;
      height: 220px;
      overflow: hidden;
      background: #f3f4f6;
    }

    .gallery-image app-cloudinary-image {
      width: 100%;
      height: 100%;
      display: block;
    }

    .image-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #9ca3af;
      background: #f3f4f6;
    }

    .image-placeholder svg {
      width: 48px;
      height: 48px;
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding: 12px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .gallery-item:hover .image-overlay {
      opacity: 1;
    }

    .image-count {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      border-radius: 20px;
      color: #ffffff;
      font-size: 12px;
      font-weight: 500;
    }

    .gallery-info {
      padding: 14px 16px;
    }

    .gallery-title {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .gallery-date {
      font-size: 12px;
      color: #9ca3af;
      margin: 0;
    }
  `]
})
export class GalleryGridComponent {
  @Input() albums: GalleryAlbum[] = [];
}