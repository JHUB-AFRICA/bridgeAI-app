// ============================================================
// BRIDGE-AI Kenya - Gallery Album Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GalleryService } from '../../../../services/gallery.service';
import { GalleryAlbum } from '../../../core/models/gallery.model';
import { CloudinaryImageComponent } from '../../../shared/components/cloudinary-image/cloudinary-image.component';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-gallery-album',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CloudinaryImageComponent,
    EuFundingBannerComponent
  ],
  template: `
    <div class="gallery-album-page">
      <div class="container">
        <div *ngIf="album() as currentAlbum; else loading">
          <div class="album-header">
            <h1 class="album-title">{{ currentAlbum.title }}</h1>
            <p *ngIf="currentAlbum.date" class="album-date">{{ currentAlbum.date | date:'dd MMMM yyyy' }}</p>
            <p *ngIf="currentAlbum.location" class="album-location">{{ currentAlbum.location }}</p>
            <p *ngIf="currentAlbum.description" class="album-description">{{ currentAlbum.description }}</p>
          </div>

          <div class="album-grid">
            <div *ngFor="let image of images()" class="album-image">
              <app-cloudinary-image
                [publicId]="image.image_path"
                [alt]="image.caption || currentAlbum.title"
                [width]="400"
                [height]="300"
                crop="fill"
                quality="auto"
              ></app-cloudinary-image>
              <p *ngIf="image.caption" class="image-caption">{{ image.caption }}</p>
            </div>
          </div>

          <div *ngIf="images().length === 0" class="empty-state">
            <p>No images in this album.</p>
          </div>

          <div class="back-link">
            <a [routerLink]="['/gallery']">← Back to Gallery</a>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading album...</p>
          </div>
        </ng-template>

        <div class="eu-section">
          <app-eu-funding-banner></app-eu-funding-banner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gallery-album-page {
      padding: 48px 0 64px 0;
      background: #f8fafc;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .album-header {
      margin-bottom: 32px;
    }

    .album-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .album-date,
    .album-location {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .album-description {
      font-size: 16px;
      color: #4b5563;
      margin: 8px 0 0 0;
      line-height: 1.6;
    }

    .album-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .album-image {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      background: #f3f4f6;
    }

    .album-image app-cloudinary-image {
      width: 100%;
      height: 250px;
      display: block;
    }

    .image-caption {
      font-size: 13px;
      color: #6b7280;
      padding: 8px 0;
      margin: 0;
    }

    .empty-state {
      text-align: center;
      padding: 48px 0;
      color: #6b7280;
    }

    .back-link {
      margin-top: 24px;
    }

    .back-link a {
      color: #3b82f6;
      text-decoration: none;
    }

    .back-link a:hover {
      text-decoration: underline;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 0;
      color: #6b7280;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }

    .eu-section {
      margin-top: 32px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .album-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .album-title {
        font-size: 26px;
      }

      .album-grid {
        grid-template-columns: 1fr;
      }

      .album-image app-cloudinary-image {
        height: 200px;
      }
    }
  `]
})
export class GalleryAlbumComponent implements OnInit {
  protected album = signal<GalleryAlbum | null>(null);
  protected images = signal<GalleryAlbum['images']>([]);

  constructor(
    private route: ActivatedRoute,
    private galleryService: GalleryService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadAlbum(slug);
    }
  }

  private loadAlbum(slug: string): void {
    this.galleryService.getAlbumBySlug(slug).subscribe({
      next: (album) => {
        this.album.set(album);
        const approvedImages = album.images?.filter(i => i.is_approved) || [];
        this.images.set(approvedImages);
      },
      error: () => {
        this.album.set(null);
        this.images.set([]);
      }
    });
  }
}