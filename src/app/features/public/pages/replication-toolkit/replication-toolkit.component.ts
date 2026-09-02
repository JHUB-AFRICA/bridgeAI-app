// ============================================================
// BRIDGE-AI Kenya - Replication Toolkit Component
// ============================================================

import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplicationResourceService } from '../../../../services/replication-resource.service';
import { ReplicationTemplateService } from '../../../../services/replication-template.service';
import { ReplicationLessonService } from '../../../../services/replication-lesson.service';
import { ReplicationResource } from '../../../core/models/replication-resource.model';
import { ReplicationTemplate } from '../../../core/models/replication-template.model';
import { ReplicationLesson } from '../../../core/models/replication-lesson.model';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

type ToolkitItem = {
  type: 'resource' | 'template' | 'lesson';
  title: string;
  description?: string;
  content?: string;
  subtext?: string;
  file_path?: string;
  created_at?: string;
};

@Component({
  selector: 'app-replication-toolkit',
  imports: [CommonModule, EuFundingBannerComponent],
  templateUrl: './replication-toolkit.component.html',
  styleUrl: './replication-toolkit.component.css'
  /* template: `
    <div class="replication-toolkit-page">
      <div class="container">
        <h1 class="page-title">Replication Toolkit</h1>

        <div class="content-grid">
          <!-- Resources -->
          <section class="section">
            <h2 class="section-heading">Resources</h2>
            <div *ngIf="resources().length === 0" class="empty-state">
              <p>No resources available at this time.</p>
            </div>
            <div class="items-list">
              <div *ngFor="let item of resources()" class="list-item">
                <div class="item-icon">📄</div>
                <div class="item-content">
                  <h3 class="item-title">{{ item.title }}</h3>
                  <p *ngIf="item.description" class="item-description">{{ item.description }}</p>
                </div>
                <div class="item-actions">
                  <a *ngIf="item.file_path" [href]="item.file_path" target="_blank" rel="noopener" class="btn-download">
                    Download
                  </a>
                </div>
              </div>
            </div>
          </section>

          <!-- Templates -->
          <section class="section">
            <h2 class="section-heading">Templates</h2>
            <div *ngIf="templates().length === 0" class="empty-state">
              <p>No templates available at this time.</p>
            </div>
            <div class="items-list">
              <div *ngFor="let item of templates()" class="list-item">
                <div class="item-icon">📋</div>
                <div class="item-content">
                  <h3 class="item-title">{{ item.title }}</h3>
                  <p *ngIf="item.description" class="item-description">{{ item.description }}</p>
                </div>
                <div class="item-actions">
                  <a *ngIf="item.file_path" [href]="item.file_path" target="_blank" rel="noopener" class="btn-download">
                    Download
                  </a>
                </div>
              </div>
            </div>
          </section>

          <!-- Lessons Learned -->
          <section class="section">
            <h2 class="section-heading">Lessons Learned</h2>
            <div *ngIf="lessons().length === 0" class="empty-state">
              <p>No lessons available at this time.</p>
            </div>
            <div class="lessons-grid">
              <div *ngFor="let lesson of lessons()" class="lesson-card">
                <div class="lesson-header">
                  <span class="lesson-icon">💡</span>
                  <h3 class="lesson-title">{{ lesson.title }}</h3>
                </div>
                <p class="lesson-description">{{ lesson.description }}</p>
                <div *ngIf="lesson.subtext" class="lesson-subtext">
                  <p>{{ lesson.subtext }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="eu-section">
          <app-eu-funding-banner></app-eu-funding-banner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .replication-toolkit-page {
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
      margin: 0 0 32px 0;
    }

    .content-grid {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .section {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 28px;
      border: 1px solid #f3f4f6;
    }

    .section-heading {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    .empty-state {
      padding: 24px;
      text-align: center;
      color: #6b7280;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .list-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #f3f4f6;
    }

    .item-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .item-content {
      flex: 1;
      min-width: 0;
    }

    .item-title {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .item-description {
      font-size: 13px;
      color: #6b7280;
      margin: 2px 0 0 0;
    }

    .item-actions {
      flex-shrink: 0;
    }

    .btn-download {
      display: inline-block;
      padding: 6px 16px;
      background: #3b82f6;
      color: #ffffff;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.2s;
    }

    .btn-download:hover {
      background: #2563eb;
    }

    .lessons-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .lesson-card {
      padding: 16px 20px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #f3f4f6;
    }

    .lesson-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .lesson-icon {
      font-size: 20px;
    }

    .lesson-title {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }

    .lesson-description {
      font-size: 14px;
      color: #4b5563;
      line-height: 1.6;
      margin: 0 0 8px 0;
    }

    .lesson-subtext {
      padding: 8px 12px;
      background: #eff6ff;
      border-radius: 6px;
      font-size: 13px;
      color: #1d4ed8;
    }

    .lesson-subtext p {
      margin: 0;
    }

    .eu-section {
      margin-top: 32px;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .list-item {
        flex-wrap: wrap;
      }

      .lessons-grid {
        grid-template-columns: 1fr;
      }
    }
  `] */
})
export class ReplicationToolkitComponent implements OnInit {
  protected resources = signal<ReplicationResource[]>([]);
  protected templates = signal<ReplicationTemplate[]>([]);
  protected lessons = signal<ReplicationLesson[]>([]);
  protected activeFilter = signal<'all' | 'resource' | 'template' | 'lesson'>('all');
  protected sortOrder = signal<'newest' | 'oldest' | 'alpha'>('newest');
  protected isLoading = signal(true);
  protected items = computed<ToolkitItem[]>(() => [
    ...this.resources().map((item) => ({ ...item, type: 'resource' as const })),
    ...this.templates().map((item) => ({ ...item, type: 'template' as const })),
    ...this.lessons().map((item) => ({ ...item, type: 'lesson' as const }))
  ]);
  protected filteredItems = computed(() => {
    const filter = this.activeFilter();
    const items = this.items().filter((item) => filter === 'all' || item.type === filter);
    return [...items].sort((first, second) => {
      if (this.sortOrder() === 'alpha') return first.title.localeCompare(second.title);
      const firstDate = new Date(first.created_at || '').getTime() || 0;
      const secondDate = new Date(second.created_at || '').getTime() || 0;
      return this.sortOrder() === 'newest' ? secondDate - firstDate : firstDate - secondDate;
    });
  });

  constructor(
    private resourceService: ReplicationResourceService,
    private templateService: ReplicationTemplateService,
    private lessonService: ReplicationLessonService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  protected setFilter(filter: 'all' | 'resource' | 'template' | 'lesson'): void {
    this.activeFilter.set(filter);
  }

  protected setSort(order: 'newest' | 'oldest' | 'alpha'): void {
    this.sortOrder.set(order);
  }

  protected count(type: 'all' | 'resource' | 'template' | 'lesson'): number {
    return type === 'all' ? this.items().length : this.items().filter((item) => item.type === type).length;
  }

  protected itemDescription(item: { description?: string; content?: string; subtext?: string }): string {
    return item.description || item.content || item.subtext || 'No description available.';
  }

  protected fileUrl(path: string): string {
    return path.startsWith('http') || path.startsWith('/') ? path : `/assets/${path}`;
  }

  private loadData(): void {
    this.resourceService.getPublicResources().subscribe({
      next: (resources) => {
        this.resources.set(resources);
        this.isLoading.set(false);
      },
      error: () => {
        this.resources.set([]);
        this.isLoading.set(false);
      }
    });

    this.templateService.getPublicTemplates().subscribe({
      next: (templates) => {
        this.templates.set(templates);
        this.isLoading.set(false);
      },
      error: () => {
        this.templates.set([]);
        this.isLoading.set(false);
      }
    });

    this.lessonService.getPublishedLessons().subscribe({
      next: (lessons) => {
        this.lessons.set(lessons);
        this.isLoading.set(false);
      },
      error: () => {
        this.lessons.set([]);
        this.isLoading.set(false);
      }
    });
  }
}