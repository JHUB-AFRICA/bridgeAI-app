// ============================================================
// BRIDGE-AI Kenya - Event Detail Component
// ============================================================

import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventService } from '../../../../services/event.service';
import { Event } from '../../../core/models/event.model';
import { SafeHtmlPipe } from '../../../shared/pipes/safe-html.pipe';
import { CloudinaryImageComponent } from '../../../shared/components/cloudinary-image/cloudinary-image.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SafeHtmlPipe, CloudinaryImageComponent],
  template: `
    <div class="event-detail-page">
      @if (event(); as currentEvent) {
        <nav class="breadcrumb-bar" aria-label="Breadcrumb">
          <div class="container breadcrumb-inner">
            <a routerLink="/">Home</a><span aria-hidden="true">/</span>
            <a routerLink="/training-events">Training Events</a><span aria-hidden="true">/</span>
            <span class="breadcrumb-current" aria-current="page">{{ currentEvent.title }}</span>
          </div>
        </nav>

        <section class="detail-hero" [style.background-image]="'linear-gradient(rgba(22,40,26,.58), rgba(22,40,26,.58)), url(' + (currentEvent.featured_image || fallbackHeroImage) + ')'">
          <div class="hero-inner container">
            <div class="event-meta">
              <span class="status-tag" [class]="currentEvent.status || 'upcoming'">{{ (currentEvent.status || 'Upcoming') | titlecase }}</span>
              <span class="event-date">{{ currentEvent.date | date:'dd MMMM yyyy' }}</span>
              <span *ngIf="currentEvent.time" class="event-time">{{ currentEvent.time }}</span>
            </div>
            <h1>{{ currentEvent.title }}</h1>
            <div class="event-location-info">
              <span *ngIf="currentEvent.location" class="event-location"><i class="fas fa-map-pin"></i> {{ currentEvent.location }}</span>
              <span *ngIf="currentEvent.venue" class="event-venue">{{ currentEvent.venue }}</span>
            </div>
          </div>
        </section>

        <div class="container detail-shell">
          <div class="event-details-grid">
            <div class="event-main">
              @if (getEventImages(currentEvent).length > 0) {
                <section class="event-image-carousel" aria-label="Event images">
                  <div class="carousel-stage">
                    @for (image of getEventImages(currentEvent); track image.path; let index = $index) {
                      <div class="carousel-slide" [class.active]="index === activeImageIndex()" [attr.aria-hidden]="index !== activeImageIndex()">
                        <app-cloudinary-image
                          [publicId]="image.path"
                          [alt]="image.alt"
                          [width]="1200"
                          [height]="520"
                          crop="fill"
                          quality="auto"
                        ></app-cloudinary-image>
                        @if (image.caption) {
                          <p class="carousel-caption">{{ image.caption }}</p>
                        }
                      </div>
                    }
                    @if (getEventImages(currentEvent).length > 1) {
                      <button type="button" class="carousel-control previous" (click)="showPreviousImage(getEventImages(currentEvent).length)" aria-label="Show previous event image">&#8592;</button>
                      <button type="button" class="carousel-control next" (click)="showNextImage(getEventImages(currentEvent).length)" aria-label="Show next event image">&#8594;</button>
                    }
                  </div>
                  @if (getEventImages(currentEvent).length > 1) {
                    <div class="carousel-dots" aria-label="Choose event image">
                      @for (image of getEventImages(currentEvent); track image.path; let index = $index) {
                        <button type="button" class="carousel-dot" [class.active]="index === activeImageIndex()" (click)="showImage(index)" [attr.aria-label]="'Show event image ' + (index + 1)" [attr.aria-current]="index === activeImageIndex() ? 'true' : null"></button>
                      }
                    </div>
                  }
                </section>
              }

              <div class="content-card" *ngIf="currentEvent.description">
                <h2 class="section-heading">About This Event</h2>
                <div [innerHTML]="currentEvent.description | safeHtml"></div>
              </div>

              <div class="content-card agenda-card" id="agenda" *ngIf="currentEvent.agenda">
                <div class="section-kicker">Programme</div>
                <h2 class="section-heading">Agenda</h2>
                @if (isRichText(currentEvent.agenda)) {
                  <div class="agenda-rich" [innerHTML]="currentEvent.agenda | safeHtml"></div>
                } @else {
                  <ol class="agenda-list">
                    @for (item of agendaItems(currentEvent.agenda); track $index) {
                      <li><span class="agenda-time">{{ agendaTime(item) }}</span><span class="agenda-entry">{{ agendaLabel(item) }}</span></li>
                    }
                  </ol>
                }
              </div>

              <div class="content-card speakers-card" id="speakers" *ngIf="currentEvent.speakers">
                <div class="section-kicker">People you’ll hear from</div>
                <h2 class="section-heading">Speakers</h2>
                @if (isRichText(currentEvent.speakers)) {
                  <div [innerHTML]="currentEvent.speakers | safeHtml"></div>
                } @else {
                  <div class="speaker-grid">
                    @for (speaker of speakerItems(currentEvent.speakers); track speaker) {
                      <div class="speaker-item"><span class="speaker-mark" aria-hidden="true">✦</span><span>{{ speaker }}</span></div>
                    }
                  </div>
                }
              </div>

              <div class="content-card" *ngIf="currentEvent.post_event_report">
                <h2 class="section-heading">Post-Event Report</h2>
                <div [innerHTML]="currentEvent.post_event_report | safeHtml"></div>
              </div>
            </div>

            <aside class="event-sidebar">
              <div class="sidebar-card">
                <h3 class="sidebar-title">Event Details</h3>
                <div class="sidebar-item"><span class="item-label">Date</span><span class="item-value">{{ currentEvent.date | date:'dd MMMM yyyy' }}</span></div>
                <div *ngIf="currentEvent.time" class="sidebar-item"><span class="item-label">Time</span><span class="item-value">{{ currentEvent.time }}</span></div>
                <div *ngIf="currentEvent.location" class="sidebar-item"><span class="item-label">Location</span><span class="item-value">{{ currentEvent.location }}</span></div>
                <div *ngIf="currentEvent.venue" class="sidebar-item"><span class="item-label">Venue</span><span class="item-value">{{ currentEvent.venue }}</span></div>
                <div *ngIf="currentEvent.capacity" class="sidebar-item"><span class="item-label">Capacity</span><span class="item-value">{{ currentEvent.capacity }} participants</span></div>
                <div *ngIf="currentEvent.audience" class="sidebar-item"><span class="item-label">Audience</span><span class="item-value">{{ currentEvent.audience }}</span></div>
                <div *ngIf="currentEvent.registration_link" class="sidebar-actions">
                  <a [href]="currentEvent.registration_link" target="_blank" rel="noopener" class="btn-register">Register Now</a>
                </div>
              </div>

            </aside>
          </div>

        </div>
      } @else {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading event...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; background: #f7f2e6; color: #1f2a37; }
    * { box-sizing: border-box; }
    img { max-width: 100%; display: block; }
    .container { max-width: 1180px; margin: 0 auto; padding: 0 22px; }
    .breadcrumb-bar {
      position: sticky;
      top: var(--site-header-offset, 92px);
      z-index: 20;
      border-bottom: 1px solid rgba(224, 216, 194, .9);
      background: rgba(255, 253, 247, .94);
      backdrop-filter: blur(14px);
    }
    .breadcrumb-inner { display: flex; align-items: center; gap: 10px; min-height: 48px; overflow: hidden; color: #8a9189; font-size: .78rem; }
    .breadcrumb-inner a { color: #26432b; font-weight: 700; text-decoration: none; }
    .breadcrumb-inner a:hover { color: #b4862d; }
    .breadcrumb-current { overflow: hidden; color: #657166; text-overflow: ellipsis; white-space: nowrap; }
    .detail-hero {
      min-height: 420px;
      display: flex;
      align-items: center;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
      overflow: hidden;
    }
    .hero-inner {
      position: relative;
      z-index: 1;
      color: #fff;
      padding-top: 70px;
      padding-bottom: 70px;
    }
    .event-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; }
    .status-tag {
      display: inline-flex; align-items: center; justify-content: center;
      border-radius: 999px; padding: 6px 14px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #fff;
      background: #26432b;
    }
    .status-tag.upcoming { background: #3b82f6; }
    .status-tag.ongoing { background: #22c55e; }
    .status-tag.completed { background: #6b7280; }
    .status-tag.cancelled { background: #ef4444; }
    .event-date, .event-time { font-size: 0.85rem; color: rgba(255,255,255,0.78); }
    .detail-hero h1 {
      margin: 0;
      max-width: 760px;
      font-size: clamp(2.4rem, 5vw, 4rem);
      line-height: 1.08;
      letter-spacing: -0.04em;
      font-weight: 900;
    }
    .event-location-info {
      display: flex; gap: 18px; align-items: center; flex-wrap: wrap;
      margin-top: 18px; color: rgba(255,255,255,0.82); font-size: 0.96rem;
    }
    .detail-shell { margin-top: -24px; padding-bottom: 64px; }
    .event-details-grid {
      display: grid;
      grid-template-columns: minmax(0, 2.1fr) minmax(280px, 0.9fr);
      gap: 28px;
      align-items: start;
    }
    .event-main { display: flex; flex-direction: column; gap: 24px; }
    .content-card, .sidebar-card {
      background: #fffdf7; border: 1px solid #e3dac2; border-radius: 20px; padding: 28px 26px; box-shadow: 0 18px 48px rgba(0,0,0,0.06);
    }
    .section-heading { margin: 0 0 16px; font-size: 1.8rem; line-height: 1.2; color: #17241b; }
    .content-card ::ng-deep p, .content-card ::ng-deep li {
      color: #3d4d47; font-size: 1rem; line-height: 1.8; }
    .content-card ::ng-deep p { margin: 0 0 16px; }
    .content-card ::ng-deep ul, .content-card ::ng-deep ol { padding-left: 22px; margin: 0 0 18px; }
    .section-kicker { margin-bottom: 8px; color: #b4862d; font-size: .68rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .agenda-card { background: linear-gradient(135deg, #fffdf7 0%, #f8f5eb 100%); }
    .agenda-list { display: grid; gap: 0; margin: 0; padding: 0; list-style: none; counter-reset: agenda; }
    .agenda-list li { position: relative; display: grid; grid-template-columns: 92px 1fr; gap: 16px; align-items: start; padding: 14px 0 14px 34px; border-bottom: 1px solid #e9e1d0; counter-increment: agenda; }
    .agenda-list li::before { content: counter(agenda, decimal-leading-zero); position: absolute; top: 16px; left: 0; color: #b4862d; font-size: .72rem; font-weight: 800; }
    .agenda-time { grid-column: 1; grid-row: 1; color: #657166; font-size: .75rem; font-weight: 700; white-space: nowrap; }
    .agenda-entry { grid-column: 2; color: #26372d; font-size: .96rem; font-weight: 650; line-height: 1.5; }
    .agenda-rich { color: #3d4d47; }
    .speaker-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .speaker-item { display: flex; align-items: flex-start; gap: 12px; min-height: 72px; padding: 16px; border: 1px solid #e5ddcc; border-radius: 12px; background: rgba(255,255,255,.62); color: #304136; font-size: .92rem; font-weight: 650; line-height: 1.5; }
    .speaker-mark { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; flex: 0 0 24px; border-radius: 50%; color: #fff; background: #26432b; font-size: .72rem; }
    .event-sidebar { display: flex; flex-direction: column; gap: 24px; }
    .sidebar-title { margin: 0 0 18px; font-size: 1.2rem; color: #17241b; }
    .sidebar-item {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 10px 0; border-bottom: 1px solid #ece2d0;
    }
    .sidebar-item:last-child { border-bottom: none; }
    .item-label { font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7b6f; }
    .item-value { font-size: 0.9rem; color: #17241b; font-weight: 600; text-align: right; }
    .sidebar-actions { margin-top: 18px; }
    .btn-register {
      display: block; width: 100%; text-align: center; background: #26432b; color: #fff; border-radius: 12px; padding: 12px 18px; font-weight: 700; text-decoration: none;
    }
    .event-image-carousel { margin-bottom: 24px; }
    .carousel-stage { position: relative; min-height: 360px; overflow: hidden; border-radius: 20px; background: #f3f4f6; }
    .carousel-slide { position: absolute; inset: 0; visibility: hidden; opacity: 0; transition: opacity .35s ease; pointer-events: none; }
    .carousel-slide.active { position: relative; visibility: visible; opacity: 1; pointer-events: auto; }
    .carousel-slide app-cloudinary-image { display: block; width: 100%; height: 360px; }
    .carousel-caption { position: absolute; right: 0; bottom: 0; left: 0; margin: 0; padding: 14px 18px; color: #fff; background: linear-gradient(transparent, rgba(0,0,0,.72)); font-size: .85rem; }
    .carousel-control { position: absolute; top: 50%; z-index: 2; width: 42px; height: 42px; border: 1px solid rgba(255,255,255,.5); border-radius: 50%; background: rgba(22,40,26,.72); color: #fff; cursor: pointer; transform: translateY(-50%); font-size: 1.3rem; }
    .carousel-control.previous { left: 16px; }
    .carousel-control.next { right: 16px; }
    .carousel-dots { display: flex; justify-content: center; gap: 8px; padding-top: 12px; }
    .carousel-dot { width: 9px; height: 9px; padding: 0; border: 0; border-radius: 50%; background: #c8c0ab; cursor: pointer; }
    .carousel-dot.active { background: #26432b; transform: scale(1.25); }
    .loading-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 320px; color: #6e7767;
    }
    .spinner {
      width: 40px; height: 40px; border: 4px solid #efe6ce; border-top-color: #26432b; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 900px) {
      .event-details-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .container { padding: 0 18px; }
      :host { --site-header-offset: 78px; }
      .breadcrumb-inner { min-height: 44px; gap: 7px; font-size: .7rem; }
      .detail-hero { min-height: 340px; }
      .hero-inner { padding-top: 50px; padding-bottom: 50px; }
      .carousel-stage, .carousel-slide app-cloudinary-image { min-height: 260px; height: 260px; }
      .content-card, .sidebar-card { padding: 20px 18px; }
      .speaker-grid { grid-template-columns: 1fr; }
      .agenda-list li { grid-template-columns: 76px 1fr; gap: 10px; }
      .agenda-time { font-size: .68rem; }
      .agenda-entry { font-size: .86rem; }
    }
  `]
})
export class EventDetailComponent implements OnInit, OnDestroy {
  protected event = signal<Event | null>(null);
  protected activeImageIndex = signal(0);
  protected readonly fallbackHeroImage = 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1600&q=80';
  private imageRotationTimer?: ReturnType<typeof setInterval>;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadEvent(slug);
    }
  }

  private loadEvent(slug: string): void {
    const request = /^\d+$/.test(slug)
      ? this.eventService.getEvent(Number(slug))
      : this.eventService.getEventBySlug(slug);
    request.subscribe({
      next: (event) => {
        this.activeImageIndex.set(0);
        this.event.set(event);
        this.startImageRotation(event);
      },
      error: () => this.event.set(null)
    });
  }

  ngOnDestroy(): void {
    if (this.imageRotationTimer) clearInterval(this.imageRotationTimer);
  }

  protected getEventImages(event: Event): Array<{ path: string; alt: string; caption?: string }> {
    const galleryImages = [...(event.gallery_images || [])]
      .sort((first, second) => (first.display_order ?? 0) - (second.display_order ?? 0))
      .map(image => ({ path: image.image_path, alt: image.caption || event.title, caption: image.caption }));
    return event.featured_image ? [{ path: event.featured_image, alt: event.title }, ...galleryImages] : galleryImages;
  }

  protected isRichText(value: string): boolean {
    return /<[^>]+>/.test(value);
  }

  protected speakerItems(value: string): string[] {
    return value.split(/[;\n]+/).map(item => item.trim()).filter(Boolean);
  }

  protected agendaItems(value: string): string[] {
    return value.split(/\r?\n/).map(item => item.trim()).filter(Boolean);
  }

  protected agendaTime(value: string): string {
    return value.match(/^\s*(\d{1,2}:\d{2}(?:\s*[–-]\s*\d{1,2}:\d{2})?)/)?.[1] ?? '';
  }

  protected agendaLabel(value: string): string {
    return value.replace(/^\s*\d{1,2}:\d{2}(?:\s*[–-]\s*\d{1,2}:\d{2})?\s*/, '').trim() || value;
  }

  protected showImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  protected showPreviousImage(imageCount: number): void {
    this.activeImageIndex.update(index => (index - 1 + imageCount) % imageCount);
  }

  protected showNextImage(imageCount: number): void {
    this.activeImageIndex.update(index => (index + 1) % imageCount);
  }

  private startImageRotation(event: Event): void {
    if (this.imageRotationTimer) clearInterval(this.imageRotationTimer);
    const imageCount = this.getEventImages(event).length;
    if (imageCount < 2) return;
    this.imageRotationTimer = setInterval(() => this.showNextImage(imageCount), 5000);
  }
}