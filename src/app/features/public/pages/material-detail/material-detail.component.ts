// ============================================================
// BRIDGE-AI Kenya - Material Detail Component
// ============================================================

import { Component, OnInit, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TrainingMaterialService } from '../../../../services/training-material.service';
import { TrainingMaterial } from '../../../core/models/training-material.model';

@Component({
  selector: 'app-material-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="material-detail-page">
      <div id="page-loader">
        <div class="loader-spinner"></div>
        <p>Loading material details...</p>
      </div>

      <div *ngIf="material() as materialItem; else loading" class="detail-shell">
        <div class="breadcrumb-bar">
          <div class="breadcrumb-container">
            <a routerLink="/">Home</a>
            <span class="sep">·</span>
            <a routerLink="/training-wp5">Training and WP5</a>
            <span class="sep">·</span>
            <a routerLink="/training-materials">Training Materials</a>
            <span class="sep">·</span>
            <span class="current">{{ materialItem.title }}</span>
          </div>
        </div>

        <section class="hero-detail">
          <div class="hero-container">
            <div class="file-icon-wrapper">
              <div class="file-icon-large {{ getFileIconClass(materialItem.file_path, materialItem.title) }}">
                <span class="file-extension">{{ getFileExtension(materialItem.file_path, materialItem.title) }}</span>
              </div>
              <span *ngIf="materialItem.file_size" class="file-size-label">{{ materialItem.file_size }}</span>
            </div>

            <div class="hero-content">
              <span class="hero-badge">Training Material</span>

              <h1 class="hero-title">
                {{ materialItem.title }}
              </h1>

              <div class="hero-meta">
                <span class="level-badge {{ materialItem.level }}">
                  {{ materialItem.level | titlecase }}
                </span>
                <span class="meta-item">
                  {{ formatResourceType(materialItem.resource_type) }}
                </span>
                <span class="meta-item">
                  <span class="meta-sep">·</span>
                  {{ materialItem.language || 'English' }}
                </span>
                <span *ngIf="materialItem.license" class="meta-item">
                  <span class="meta-sep">·</span>
                  {{ materialItem.license }}
                </span>
              </div>

              <p *ngIf="materialItem.description" class="hero-description">{{ materialItem.description }}</p>

              <div class="hero-actions">
                <a *ngIf="materialItem.file_path" [href]="materialItem.file_path" class="btn-download" download>
                  Download File
                  <span class="btn-arrow">→</span>
                </a>
                <a routerLink="/training-materials" class="btn-back-list">
                  ← Back to Materials
                </a>
              </div>
            </div>
          </div>
        </section>

        <div class="detail-content">
          <section class="info-grid animate-on-scroll">
            <div class="info-card">
              <span class="info-label">Level</span>
              <div class="info-value">
                <span class="level-badge-sm {{ materialItem.level }}">
                  {{ materialItem.level | titlecase }}
                </span>
              </div>
            </div>
            <div class="info-card">
              <span class="info-label">Type</span>
              <div class="info-value">{{ formatResourceType(materialItem.resource_type) }}</div>
            </div>
            <div class="info-card">
              <span class="info-label">Language</span>
              <div class="info-value">{{ materialItem.language || 'English' }}</div>
            </div>
            <div class="info-card">
              <span class="info-label">Status</span>
              <div class="info-value">
                <span class="status-badge {{ materialItem.is_public === false ? 'private' : 'public' }}">
                  {{ materialItem.is_public === false ? 'Private' : 'Public' }}
                </span>
              </div>
            </div>
          </section>

          <section *ngIf="materialItem.tags && materialItem.tags.length > 0" class="tags-section animate-on-scroll delay-1">
            <span class="tags-label">Tags</span>
            <div class="tags-container">
              <span *ngFor="let tag of materialItem.tags" class="tag">{{ tag }}</span>
            </div>
          </section>

          <section *ngIf="relatedMaterials().length > 0" class="related-section animate-on-scroll delay-2">
            <span class="related-label">Related</span>
            <h2>Related Materials</h2>

            <div class="related-grid">
              <a *ngFor="let related of relatedMaterials()" [routerLink]="['/training-materials', related.slug]" class="related-card">
                <div class="related-icon {{ getFileIconClass(related.file_path, related.title) }}">
                  <span class="file-ext">{{ getFileExtension(related.file_path, related.title) }}</span>
                </div>
                <div class="related-info">
                  <div class="related-title">{{ related.title }}</div>
                  <div class="related-meta">
                    {{ related.level | titlecase }}
                    ·
                    {{ formatResourceType(related.resource_type) }}
                  </div>
                </div>
                <span class="related-arrow">→</span>
              </a>
            </div>
          </section>

          <section class="back-section">
            <a routerLink="/training-materials" class="back-link">
              ← Back to All Materials
            </a>
          </section>
        </div>
      </div>

      <ng-template #loading>
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading material...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .material-detail-page {
      background: var(--bg-white);
      color: var(--text-body);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.7;
      min-height: 100vh;
      position: relative;
    }

    .detail-shell {
      background: var(--bg-white);
    }

    #page-loader {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      transition: opacity 0.6s ease, visibility 0.6s ease;
    }

    #page-loader.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .loader-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e4eaf0;
      border-top-color: #1a4a6b;
      border-radius: 50%;
      animation: loaderSpin 0.8s linear infinite;
    }

    @keyframes loaderSpin {
      to { transform: rotate(360deg); }
    }

    #page-loader p {
      margin-top: 16px;
      font-size: 0.85rem;
      color: #5a6a7a;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 400;
      letter-spacing: 0.02em;
    }

    .breadcrumb-bar {
      background: var(--bg-white);
      padding: 14px 24px;
      border-bottom: 1px solid var(--border-light);
      position: sticky;
      top: 72px;
      z-index: 50;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      background: rgba(255, 255, 255, 0.92);
      animation: fadeInDown 0.6s ease;
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .breadcrumb-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.82rem;
      color: var(--text-muted);
      flex-wrap: wrap;
    }

    .breadcrumb-container a {
      color: var(--primary-light);
      text-decoration: none;
      transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 500;
    }

    .breadcrumb-container a:hover {
      color: var(--gold);
    }

    .breadcrumb-container .sep {
      color: var(--text-light);
      opacity: 0.3;
      font-weight: 300;
    }

    .breadcrumb-container .current {
      color: var(--text-body);
      font-weight: 600;
    }

    .hero-detail {
      padding: 40px 24px 36px;
      background: linear-gradient(165deg, var(--primary-dark) 0%, var(--primary) 60%, var(--primary-light) 100%);
      position: relative;
      overflow: hidden;
    }

    .hero-detail::before {
      content: '';
      position: absolute;
      top: -40%;
      right: -10%;
      width: 50%;
      height: 120%;
      background: radial-gradient(ellipse, rgba(212, 168, 67, 0.06) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-detail::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%);
      opacity: 0.4;
    }

    .hero-detail .hero-container {
      max-width: 1000px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 32px;
      align-items: center;
    }

    .hero-detail .file-icon-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .hero-detail .file-icon-large {
      width: 100px;
      height: 100px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .hero-detail .file-icon-large .file-extension {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: rgba(255, 255, 255, 0.3);
    }

    .hero-detail .file-icon-large.pdf .file-extension { color: #E8A0A0; }
    .hero-detail .file-icon-large.docx .file-extension { color: #80B0D0; }
    .hero-detail .file-icon-large.pptx .file-extension { color: #E8B880; }
    .hero-detail .file-icon-large.mp4 .file-extension { color: #B890D0; }
    .hero-detail .file-icon-large.zip .file-extension { color: #A0A0A0; }
    .hero-detail .file-icon-large.image .file-extension { color: #80C0A0; }
    .hero-detail .file-icon-large.other .file-extension { color: #B0B0B0; }

    .hero-detail .file-size-label {
      font-size: 0.65rem;
      color: rgba(255, 255, 255, 0.25);
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .hero-detail .hero-content {
      animation: fadeInUp 0.8s ease forwards;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .hero-detail .hero-content .hero-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.06);
      color: var(--gold-light);
      font-size: 0.55rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      padding: 3px 16px;
      border-radius: 50px;
      margin-bottom: 8px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .hero-detail .hero-content .hero-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 6px;
    }

    .hero-detail .hero-content .hero-title .gold {
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 60%, var(--gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-detail .hero-content .hero-meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 16px;
      margin-bottom: 10px;
    }

    .hero-detail .hero-content .level-badge {
      display: inline-block;
      padding: 2px 14px;
      border-radius: 60px;
      font-size: 0.6rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .level-badge.beginner {
      background: rgba(40, 167, 69, 0.15);
      color: #4ADE80;
    }

    .level-badge.intermediate {
      background: rgba(212, 168, 67, 0.15);
      color: #F5D77E;
    }

    .level-badge.advanced {
      background: rgba(220, 53, 69, 0.15);
      color: #F87171;
    }

    .hero-detail .hero-content .hero-meta .meta-item {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.45);
      font-weight: 450;
    }

    .hero-detail .hero-content .hero-meta .meta-item .meta-sep {
      color: rgba(255, 255, 255, 0.12);
      margin: 0 2px;
    }

    .hero-detail .hero-content .hero-description {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.5);
      max-width: 600px;
      line-height: 1.7;
      font-weight: 300;
      margin-bottom: 16px;
    }

    .hero-detail .hero-content .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .hero-detail .hero-content .btn-download {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 32px;
      background: var(--gold);
      color: var(--primary-dark);
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      border-radius: 60px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      cursor: pointer;
      letter-spacing: 0.02em;
      font-family: var(--font-sans);
      box-shadow: 0 8px 32px rgba(212, 168, 67, 0.12);
    }

    .hero-detail .hero-content .btn-download:hover {
      background: var(--gold-light);
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(212, 168, 67, 0.2);
    }

    .hero-detail .hero-content .btn-download .btn-arrow {
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-block;
    }

    .hero-detail .hero-content .btn-download:hover .btn-arrow {
      transform: translateX(6px);
    }

    .hero-detail .hero-content .btn-back-list {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 12px 28px;
      color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 60px;
      font-weight: 500;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: var(--font-sans);
      cursor: pointer;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .hero-detail .hero-content .btn-back-list:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      transform: translateY(-3px);
    }

    .detail-content {
      max-width: 1000px;
      margin: 0 auto;
      padding: 40px 24px 60px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      padding-bottom: 40px;
      border-bottom: 1px solid var(--border-light);
      margin-bottom: 40px;
    }

    .info-card {
      background: var(--bg-lighter);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 16px 18px;
      text-align: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
      border-color: var(--primary-light);
    }

    .info-card .info-label {
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-light);
      display: block;
      margin-bottom: 2px;
    }

    .info-card .info-value {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-dark);
    }

    .info-card .info-value .level-badge-sm {
      display: inline-block;
      padding: 1px 12px;
      border-radius: 60px;
      font-size: 0.6rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .info-card .info-value .level-badge-sm.beginner {
      background: #D6F0E0;
      color: #1A6A4A;
    }

    .info-card .info-value .level-badge-sm.intermediate {
      background: #F5E8D6;
      color: #9E6A2A;
    }

    .info-card .info-value .level-badge-sm.advanced {
      background: #F5E6E6;
      color: #9E2A2A;
    }

    .info-card .info-value .status-badge {
      display: inline-block;
      padding: 1px 12px;
      border-radius: 60px;
      font-size: 0.55rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .info-card .info-value .status-badge.public {
      background: #D4E8F5;
      color: #1A4A6B;
    }

    .info-card .info-value .status-badge.private {
      background: #E8E8E8;
      color: #6A6A7A;
    }

    .tags-section {
      padding-bottom: 40px;
      border-bottom: 1px solid var(--border-light);
      margin-bottom: 40px;
    }

    .tags-section .tags-label {
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-light);
      display: block;
      margin-bottom: 8px;
    }

    .tags-section .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tags-section .tags-container .tag {
      display: inline-block;
      padding: 4px 16px;
      background: var(--bg-light);
      border: 1px solid var(--border-light);
      border-radius: 60px;
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-muted);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .tags-section .tags-container .tag:hover {
      background: var(--primary-light);
      color: #ffffff;
      border-color: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 74, 107, 0.1);
    }

    .related-section {
      padding-bottom: 20px;
    }

    .related-section .related-label {
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-light);
      display: block;
      margin-bottom: 4px;
    }

    .related-section h2 {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--text-dark);
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin-bottom: 20px;
    }

    .related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }

    .related-card {
      background: var(--bg-white);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 16px 20px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .related-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: rgba(212, 168, 67, 0.12);
    }

    .related-card .related-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-light);
      border: 1px solid var(--border-light);
    }

    .related-card .related-icon .file-ext {
      font-size: 0.45rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--text-muted);
    }

    .related-card .related-icon.pdf { background: #F5E6E6; border-color: #E8C8C8; }
    .related-card .related-icon.pdf .file-ext { color: #9E2A2A; }
    .related-card .related-icon.docx { background: #D4E8F5; border-color: #B8D0E8; }
    .related-card .related-icon.docx .file-ext { color: #1A4A6B; }
    .related-card .related-icon.pptx { background: #F5E8D6; border-color: #E8D0B8; }
    .related-card .related-icon.pptx .file-ext { color: #9E6A2A; }
    .related-card .related-icon.mp4 { background: #E8D6F0; border-color: #D0B8E0; }
    .related-card .related-icon.mp4 .file-ext { color: #5A3A7A; }
    .related-card .related-icon.other { background: #F0F0F0; border-color: #E0E0E0; }
    .related-card .related-icon.other .file-ext { color: #7A8A8A; }

    .related-card .related-info .related-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-dark);
      transition: color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .related-card:hover .related-info .related-title {
      color: var(--primary-light);
    }

    .related-card .related-info .related-meta {
      font-size: 0.7rem;
      color: var(--text-light);
    }

    .related-card .related-arrow {
      margin-left: auto;
      color: var(--text-light);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 300;
      font-size: 1.1rem;
    }

    .related-card:hover .related-arrow {
      color: var(--gold);
      transform: translateX(4px);
    }

    .back-section {
      text-align: center;
      padding-top: 20px;
    }

    .back-section .back-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--text-muted);
      font-weight: 500;
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 10px 24px;
      border-radius: 50px;
      background: var(--bg-white);
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-sm);
    }

    .back-section .back-link:hover {
      gap: 16px;
      color: var(--primary-light);
      border-color: var(--primary-light);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    @media (max-width: 1024px) {
      .hero-detail .hero-container {
        grid-template-columns: 100px 1fr;
        gap: 24px;
      }

      .hero-detail .file-icon-large {
        width: 80px;
        height: 80px;
      }

      .hero-detail .hero-content .hero-title {
        font-size: 1.8rem;
      }

      .info-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .breadcrumb-bar {
        top: 64px;
        padding: 10px 16px;
      }

      .hero-detail {
        padding: 32px 16px 28px;
      }

      .hero-detail .hero-container {
        grid-template-columns: 1fr;
        gap: 16px;
        text-align: center;
      }

      .hero-detail .file-icon-wrapper {
        flex-direction: row;
        justify-content: center;
        gap: 12px;
      }

      .hero-detail .file-icon-large {
        width: 64px;
        height: 64px;
      }

      .hero-detail .file-icon-large .file-extension {
        font-size: 0.65rem;
      }

      .hero-detail .file-size-label {
        font-size: 0.6rem;
      }

      .hero-detail .hero-content .hero-title {
        font-size: 1.6rem;
      }

      .hero-detail .hero-content .hero-description {
        font-size: 0.9rem;
        max-width: 100%;
      }

      .hero-detail .hero-content .hero-actions {
        justify-content: center;
      }

      .hero-detail .hero-content .btn-download,
      .hero-detail .hero-content .btn-back-list {
        width: 100%;
        justify-content: center;
      }

      .detail-content {
        padding: 24px 16px 40px;
      }

      .info-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        padding-bottom: 28px;
        margin-bottom: 28px;
      }

      .info-card {
        padding: 12px 14px;
      }

      .info-card .info-value {
        font-size: 0.85rem;
      }

      .tags-section {
        padding-bottom: 28px;
        margin-bottom: 28px;
      }

      .related-section h2 {
        font-size: 1.3rem;
      }

      .related-grid {
        grid-template-columns: 1fr;
      }

      .related-card {
        padding: 14px 16px;
      }

      .back-section .back-link {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .hero-detail .hero-content .hero-title {
        font-size: 1.3rem;
      }

      .hero-detail .hero-content .hero-meta {
        flex-direction: column;
        align-items: center;
        gap: 4px;
      }

      .info-grid {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .info-card {
        padding: 10px 12px;
      }

      .info-card .info-label {
        font-size: 0.5rem;
      }

      .info-card .info-value {
        font-size: 0.78rem;
      }

      .tags-section .tags-container .tag {
        font-size: 0.65rem;
        padding: 3px 12px;
      }

      .related-card .related-icon {
        width: 32px;
        height: 32px;
      }

      .related-card .related-info .related-title {
        font-size: 0.78rem;
      }

      .hero-detail .file-icon-large {
        width: 52px;
        height: 52px;
      }

      .hero-detail .file-icon-large .file-extension {
        font-size: 0.55rem;
      }
    }

    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: var(--bg-light);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--primary-light);
      border-radius: 4px;
      transition: background 0.3s ease;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--gold);
    }

    ::selection {
      background: var(--gold-pale);
      color: var(--text-dark);
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `]
})
export class MaterialDetailComponent implements OnInit, AfterViewInit {
  protected material = signal<TrainingMaterial | null>(null);
  protected relatedMaterials = signal<TrainingMaterial[]>([]);

  constructor(
    private route: ActivatedRoute,
    private materialService: TrainingMaterialService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadMaterial(slug);
    }
  }

  ngAfterViewInit(): void {
    this.hideLoader();
    this.observeElements();

    const downloadBtn = document.querySelector('.btn-download');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        console.log('Download started: material');
      });
    }
  }

  private hideLoader(): void {
    const loader = document.getElementById('page-loader');
    if (!loader) {
      return;
    }

    loader.classList.add('hidden');
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 700);
  }

  private observeElements(): void {
    const elements = document.querySelectorAll('.animate-on-scroll:not(.visible)');
    if (!elements.length || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px'
    });

    elements.forEach((el) => observer.observe(el));
  }

  private loadMaterial(slug: string): void {
    this.materialService.getMaterialBySlug(slug).subscribe({
      next: (material) => {
        this.material.set(material);
        this.loadRelatedMaterials(material);
      },
      error: () => {
        this.material.set(null);
        this.relatedMaterials.set([]);
      }
    });
  }

  private loadRelatedMaterials(currentMaterial: TrainingMaterial): void {
    this.materialService.getMaterials().subscribe({
      next: (materials) => {
        const filtered = materials
          .filter((item) => item.slug !== currentMaterial.slug)
          .slice(0, 4);

        this.relatedMaterials.set(filtered);
      },
      error: () => {
        this.relatedMaterials.set([]);
      }
    });
  }

  formatResourceType(resourceType?: string | null): string {
    if (!resourceType) {
      return 'Resource';
    }

    return resourceType.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  getFileExtension(filePath?: string | null, title?: string | null): string {
    const source = filePath || title || 'FILE';
    const match = source.match(/\.([a-z0-9]+)$/i);
    const extension = match ? match[1].toUpperCase() : 'FILE';

    if (extension === 'PDF') return 'PDF';
    if (extension === 'DOC' || extension === 'DOCX') return 'DOCX';
    if (extension === 'PPT' || extension === 'PPTX') return 'PPTX';
    if (extension === 'MP4' || extension === 'MOV' || extension === 'AVI') return 'MP4';
    if (extension === 'ZIP' || extension === 'RAR') return 'ZIP';
    if (['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'SVG'].includes(extension)) return 'IMAGE';
    return extension;
  }

  getFileIconClass(filePath?: string | null, title?: string | null): string {
    const ext = this.getFileExtension(filePath, title).toLowerCase();

    if (ext === 'pdf') return 'pdf';
    if (ext === 'docx' || ext === 'doc') return 'docx';
    if (ext === 'pptx' || ext === 'ppt') return 'pptx';
    if (ext === 'mp4' || ext === 'mov' || ext === 'avi') return 'mp4';
    if (ext === 'zip' || ext === 'rar') return 'zip';
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp' || ext === 'gif' || ext === 'svg' || ext === 'image') return 'image';
    return 'other';
  }

  formatFileSize(fileSize?: string | null): string {
    if (!fileSize) {
      return 'N/A';
    }

    const bytes = Number(fileSize);
    if (!Number.isFinite(bytes) || bytes < 0) {
      return 'N/A';
    }

    if (bytes === 0) {
      return '0 Bytes';
    }

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** unitIndex;

    return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }
}