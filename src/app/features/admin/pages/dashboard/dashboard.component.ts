// ============================================================
// BRIDGE-AI Kenya - Admin Dashboard Component
// ============================================================

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { EventService } from '../../../../services/event.service';
import { ResourceService } from '../../../../services/resource.service';
import { PartnerService } from '../../../../services/partner.service';
import { TeamService } from '../../../../services/team.service';
import { GalleryService } from '../../../../services/gallery.service';
import { FaqService } from '../../../../services/faq.service';
import { SubmissionService } from '../../../../services/submission.service';

interface DashboardStats {
  activities: number;
  publishedActivities: number;
  events: number;
  upcomingEvents: number;
  resources: number;
  partners: number;
  team: number;
  albums: number;
  galleryImages: number;
  faqs: number;
  submissions: number;
  unreadSubmissions: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="dashboard-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Welcome to the BRIDGE-AI Kenya Admin Panel</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().activities }}</span>
            <span class="stat-label">Activities</span>
            <span class="stat-sub">{{ stats().publishedActivities }} published</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().events }}</span>
            <span class="stat-label">Events</span>
            <span class="stat-sub">{{ stats().upcomingEvents }} upcoming</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().resources }}</span>
            <span class="stat-label">Resources</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().partners }}</span>
            <span class="stat-label">Partners</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().team }}</span>
            <span class="stat-label">Team Members</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon pink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().albums }}</span>
            <span class="stat-label">Albums</span>
            <span class="stat-sub">{{ stats().galleryImages }} images</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon yellow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().faqs }}</span>
            <span class="stat-label">FAQs</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats().submissions }}</span>
            <span class="stat-label">Submissions</span>
            <span class="stat-sub">{{ stats().unreadSubmissions }} unread</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 0 0 32px 0;
    }

    .dashboard-header {
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .page-subtitle {
      font-size: 16px;
      color: #6b7280;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #f3f4f6;
      transition: box-shadow 0.3s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      flex-shrink: 0;
    }

    .stat-icon svg {
      width: 24px;
      height: 24px;
    }

    .stat-icon.blue {
      background: #eff6ff;
      color: #3b82f6;
    }

    .stat-icon.green {
      background: #ecfdf5;
      color: #22c55e;
    }

    .stat-icon.purple {
      background: #f5f3ff;
      color: #8b5cf6;
    }

    .stat-icon.orange {
      background: #fffbeb;
      color: #f59e0b;
    }

    .stat-icon.teal {
      background: #ecfdf5;
      color: #14b8a6;
    }

    .stat-icon.pink {
      background: #fdf2f8;
      color: #ec4899;
    }

    .stat-icon.yellow {
      background: #fefce8;
      color: #eab308;
    }

    .stat-icon.red {
      background: #fef2f2;
      color: #ef4444;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 14px;
      color: #6b7280;
    }

    .stat-sub {
      font-size: 12px;
      color: #9ca3af;
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 24px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  protected stats = signal<DashboardStats>({
    activities: 0,
    publishedActivities: 0,
    events: 0,
    upcomingEvents: 0,
    resources: 0,
    partners: 0,
    team: 0,
    albums: 0,
    galleryImages: 0,
    faqs: 0,
    submissions: 0,
    unreadSubmissions: 0
  });

  constructor(
    private activityService: ActivityService,
    private eventService: EventService,
    private resourceService: ResourceService,
    private partnerService: PartnerService,
    private teamService: TeamService,
    private galleryService: GalleryService,
    private faqService: FaqService,
    private submissionService: SubmissionService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.activityService.getActivities().subscribe({
      next: (activities) => {
        this.stats.update(s => ({
          ...s,
          activities: activities.length,
          publishedActivities: activities.filter(a => a.evidence_status === 'published').length
        }));
      }
    });

    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.stats.update(s => ({
          ...s,
          events: events.length,
          upcomingEvents: events.filter(e => e.status === 'upcoming').length
        }));
      }
    });

    this.resourceService.getResources().subscribe({
      next: (resources) => {
        this.stats.update(s => ({ ...s, resources: resources.length }));
      }
    });

    this.partnerService.getPartners().subscribe({
      next: (partners) => {
        this.stats.update(s => ({ ...s, partners: partners.length }));
      }
    });

    this.teamService.getTeamMembers().subscribe({
      next: (members) => {
        this.stats.update(s => ({ ...s, team: members.length }));
      }
    });

    this.galleryService.getAlbums().subscribe({
      next: (albums) => {
        const totalImages = albums.reduce((sum, a) => sum + (a.images?.length || 0), 0);
        this.stats.update(s => ({
          ...s,
          albums: albums.length,
          galleryImages: totalImages
        }));
      }
    });

    this.faqService.getFaqs().subscribe({
      next: (faqs) => {
        this.stats.update(s => ({ ...s, faqs: faqs.length }));
      }
    });

    this.submissionService.getSubmissions().subscribe({
      next: (submissions) => {
        this.stats.update(s => ({
          ...s,
          submissions: submissions.length,
          unreadSubmissions: submissions.filter(sub => !sub.is_read).length
        }));
      }
    });
  }
}