// ============================================================
// BRIDGE-AI Kenya - Gallery Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GalleryService } from '../../../../services/gallery.service';
import { GalleryAlbum } from '../../../core/models/gallery.model';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, EuFundingBannerComponent],
  template: `
    <div class="gallery-page">
      <section class="gallery-hero">
        <div class="hero-inner container">
          <span class="hero-badge">Gallery</span>
          <h1>Visual stories from BRIDGE-AI</h1>
          <p>See the field work, training moments, and community collaboration that are shaping the project across Kenya.</p>
        </div>
      </section>

      <div class="container page-wrap">
        <div class="gallery-toolbar">
          <span class="section-label">Featured moments</span>
          <h2>Project <span class="highlight">Gallery</span></h2>
        </div>

        <div class="gallery-grid" *ngIf="albums().length; else noAlbums">
          <article class="gallery-card" *ngFor="let album of albums()" [routerLink]="['/gallery', album.slug]">
            <div class="media">
              <img [src]="album.images?.[0]?.image_path || fallbackImage" [alt]="album.title" loading="lazy" />
            </div>
            <div class="content">
              <span class="tag">{{ album.tags?.[0] || 'Project' }}</span>
              <h3>{{ album.title }}</h3>
              <p>{{ album.description || 'Project album from BRIDGE-AI activities.' }}</p>
            </div>
          </article>
        </div>

        <ng-template #noAlbums>
          <div class="empty-state">No gallery albums available at this time.</div>
        </ng-template>

        <div class="eu-section">
          <app-eu-funding-banner></app-eu-funding-banner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #f7f2e6;
      color: #17241b;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    * { box-sizing: border-box; }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    .gallery-hero {
      background: linear-gradient(rgba(11, 17, 20, 0.72), rgba(11, 17, 20, 0.72)),
        url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
      min-height: 320px;
      display: flex;
      align-items: center;
    }
    .hero-inner { color: #fff; padding-top: 58px; padding-bottom: 58px; }
    .hero-badge {
      display: inline-block; padding: 6px 16px; border-radius: 6px;
      border: 1px solid rgba(212, 168, 67, 0.2); background: rgba(212, 168, 67, 0.12); color: #f5d77e; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.62rem; font-weight: 700;
    }
    .gallery-hero h1 {
      margin: 18px 0 12px;
      font-size: clamp(2.4rem, 5vw, 4.5rem);
      line-height: 1.08;
      letter-spacing: -0.04em;
      font-weight: 900;
    }
    .gallery-hero p {
      margin: 0;
      max-width: 700px;
      font-size: 1.08rem;
      line-height: 1.8;
      color: rgba(255,255,255,0.8);
    }
    .page-wrap { padding-top: 54px; padding-bottom: 64px; }
    .gallery-toolbar { margin-bottom: 28px; }
    .section-label {
      display: block; color: #be8a26; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    }
    .gallery-toolbar h2 {
      margin: 8px 0 0; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.1; letter-spacing: -0.03em;
    }
    .highlight { color: #26432b; }
    .gallery-grid {
      display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px;
    }
    .gallery-card {
      background: #fffdf7; border: 1px solid #e5d9b9; border-radius: 18px; overflow: hidden; box-shadow: 0 16px 36px rgba(0,0,0,0.04); cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .gallery-card:hover { transform: translateY(-2px); box-shadow: 0 20px 42px rgba(0,0,0,0.08); }
    .media { height: 220px; overflow: hidden; background: #dfe5dd; }
    .media img { width: 100%; height: 100%; object-fit: cover; }
    .content { padding: 18px 18px 20px; }
    .tag {
      display: inline-block; border-radius: 999px; padding: 4px 10px; background: rgba(38,67,43,0.08); color: #26432b; font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
    }
    .content h3 { margin: 12px 0 8px; font-size: 1.2rem; }
    .content p { margin: 0; color: #5b7165; line-height: 1.7; }
    .empty-state {
      text-align: center; padding: 64px 20px; background: #fffdf7; border: 1px dashed #decfa9; border-radius: 18px; color: #5b7165;
    }
    .eu-section { margin-top: 32px; }
    @media (max-width: 900px) { .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 640px) {
      .container { padding: 0 18px; }
      .gallery-grid { grid-template-columns: 1fr; }
      .gallery-hero h1 { font-size: 2.3rem; }
    }
  `]
})
export class GalleryComponent implements OnInit {
  protected albums = signal<GalleryAlbum[]>([]);
  protected readonly fallbackImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80';

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  private loadAlbums(): void {
    this.galleryService.getPublishedAlbums().subscribe({
      next: (albums) => this.albums.set(albums),
      error: () => this.albums.set([])
    });
  }
}