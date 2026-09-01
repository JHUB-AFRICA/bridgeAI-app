// ============================================================
// BRIDGE-AI Kenya - Gallery Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../../../services/gallery.service';
import { GalleryAlbum } from '../../../core/models/gallery.model';
import { GalleryGridComponent } from '../../../shared/components/gallery-grid/gallery-grid.component';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, GalleryGridComponent, EuFundingBannerComponent],
  template: `
    <div class="gallery-page">
      <div class="container">
        <h1 class="page-title">Gallery</h1>
        <p class="page-subtitle">Explore photos from BRIDGE-AI Kenya activities</p>

        <div *ngIf="albums().length === 0" class="empty-state">
          <p>No gallery albums available at this time.</p>
        </div>

        <app-gallery-grid [albums]="albums()"></app-gallery-grid>

        <div class="eu-section">
          <app-eu-funding-banner></app-eu-funding-banner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gallery-page {
      padding: 48px 0 64px 0;
      background: #f8fafc;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 16px;
      color: #6b7280;
      margin: 0 0 24px 0;
    }

    .empty-state {
      padding: 48px 0;
      text-align: center;
      color: #6b7280;
    }

    .eu-section {
      margin-top: 32px;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }
    }
  `]
})
export class GalleryComponent implements OnInit {
  protected albums = signal<GalleryAlbum[]>([]);

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  private loadAlbums(): void {
    this.galleryService.getPublishedAlbums().subscribe({
      next: (albums) => {
        this.albums.set(albums);
      },
      error: () => {
        this.albums.set([]);
      }
    });
  }
}