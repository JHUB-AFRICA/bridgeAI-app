// ============================================================
// BRIDGE-AI Kenya - JKUAT Role Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../../../services/team.service';
import { TeamMember } from '../../../core/models/team.model';
import { LOCAL_CONTEXT } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-jkuat-role',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="jkuat-role-page">
      <div class="container">
        <h1 class="page-title">JKUAT Role in BRIDGE-AI</h1>

        <div class="role-section">
          <div class="role-content">
            <div class="role-card">
              <h2 class="section-heading">Our Role</h2>
              <p class="section-text">{{ roleDescription }}</p>
            </div>

            <div class="role-card">
              <h2 class="section-heading">Key Responsibilities</h2>
              <ul class="responsibility-list">
                <li>Lead Work Package 5: Capacity Building and Replication</li>
                <li>Host and manage the Smart Mushroom case study at JKUAT Smart Farm Zone</li>
                <li>Contribute to platform requirements and sensor readiness</li>
                <li>Implement pilot activities and farmer engagement</li>
                <li>Deliver training and bootcamp programmes</li>
                <li>Lead SME mentoring and community outreach</li>
                <li>Develop open repositories and replication materials</li>
                <li>Coordinate gender and inclusion reporting</li>
              </ul>
            </div>
          </div>

          <div class="pilot-section">
            <h2 class="section-heading">Smart Mushroom Pilot</h2>
            <div class="pilot-info">
              <div class="pilot-detail">
                <span class="pilot-label">Location</span>
                <span class="pilot-value">{{ pilotSite }}</span>
              </div>
              <div class="pilot-detail">
                <span class="pilot-label">Host</span>
                <span class="pilot-value">{{ hostInstitution }}</span>
              </div>
              <div class="pilot-detail">
                <span class="pilot-label">Hub</span>
                <span class="pilot-value">{{ hub }}</span>
              </div>
              <div class="pilot-detail">
                <span class="pilot-label">Focus</span>
                <span class="pilot-value">{{ focusArea }}</span>
              </div>
            </div>
          </div>

          <div class="team-section">
            <h2 class="section-heading">Project Team</h2>
            <div class="team-grid">
              <div *ngFor="let member of teamMembers()" class="team-card">
                <div class="team-avatar">
                  <img
                    *ngIf="member.photo"
                    [src]="member.photo"
                    [alt]="member.name"
                    appLazyLoad
                  />
                  <div *ngIf="!member.photo" class="avatar-placeholder">
                    <span>{{ member.name | slice:0:2 | uppercase }}</span>
                  </div>
                </div>
                <div class="team-info">
                  <h4 class="team-name">{{ member.name }}</h4>
                  <p class="team-role">{{ member.role }}</p>
                  <p *ngIf="member.affiliation" class="team-affiliation">{{ member.affiliation }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .jkuat-role-page {
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

    .role-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .role-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .role-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 28px;
      border: 1px solid #f3f4f6;
    }

    .section-heading {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 12px 0;
    }

    .section-text {
      font-size: 16px;
      color: #4b5563;
      line-height: 1.7;
      margin: 0;
    }

    .responsibility-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 16px;
    }

    .responsibility-list li {
      padding: 6px 0 6px 20px;
      position: relative;
      font-size: 14px;
      color: #4b5563;
    }

    .responsibility-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #22c55e;
      font-weight: 700;
    }

    .pilot-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 28px;
      border: 1px solid #f3f4f6;
    }

    .pilot-info {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 12px;
    }

    .pilot-detail {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .pilot-label {
      font-size: 12px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .pilot-value {
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
    }

    .team-section {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 28px;
      border: 1px solid #f3f4f6;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 16px;
    }

    .team-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #f3f4f6;
      transition: box-shadow 0.3s ease;
    }

    .team-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .team-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 12px;
      background: #f3f4f6;
      flex-shrink: 0;
    }

    .team-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #3b82f6;
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
    }

    .team-name {
      font-size: 15px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 2px 0;
    }

    .team-role {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
    }

    .team-affiliation {
      font-size: 12px;
      color: #9ca3af;
      margin: 2px 0 0 0;
    }

    @media (max-width: 1024px) {
      .role-content {
        grid-template-columns: 1fr;
      }

      .team-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .pilot-info {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 26px;
      }

      .responsibility-list {
        grid-template-columns: 1fr;
      }

      .team-grid {
        grid-template-columns: 1fr 1fr;
      }

      .pilot-info {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .team-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class JkuatRoleComponent implements OnInit {
  protected teamMembers = signal<TeamMember[]>([]);
  protected roleDescription = `
    JKUAT is the Kenyan beneficiary in BRIDGE-AI and leads Work Package 5:
    Capacity Building and Replication. At the local level, JKUAT anchors
    the Smart Mushroom case study through the Mushroom Demonstration Farm
    at the JKUAT Smart Farm Zone in Juja, Kenya. JKUAT contributes to
    platform requirements, sensor and data readiness, pilot implementation,
    gender and inclusion reporting, farmer engagement, training delivery,
    SME mentoring, open repositories and replication planning.
  `;

  protected pilotSite = LOCAL_CONTEXT.PILOT_SITE;
  protected hostInstitution = LOCAL_CONTEXT.HOST_INSTITUTION;
  protected hub = LOCAL_CONTEXT.HUB;
  protected focusArea = LOCAL_CONTEXT.FOCUS_AREA;

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.loadTeamMembers();
  }

  private loadTeamMembers(): void {
    this.teamService.getApprovedTeamMembers().subscribe({
      next: (members) => {
        this.teamMembers.set(members);
      },
      error: () => {
        this.teamMembers.set([]);
      }
    });
  }
}