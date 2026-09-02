// ============================================================
// BRIDGE-AI Kenya - JKUAT Role Component
// ============================================================

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeamService } from '../../../../services/team.service';
import { TeamMember } from '../../../core/models/team.model';
import { LOCAL_CONTEXT } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-jkuat-role',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="jkuat-role-page">
      <section class="hero" id="heroSection">
        <div class="hero-image-wrapper">
          <div class="hero-slide-bg active" style="background-image: url('https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1600&q=80');"></div>
        </div>
        <div class="hero-content-wrapper">
          <div class="hero-content">
            <h1>
              JKUAT <span class="highlight">Role</span>
            </h1>
            <p class="hero-sub">
              Leading the Smart Mushroom Pilot and<br />
              WP5 Capacity Building in Kenya
            </p>
            <p class="hero-description">
              JKUAT is the Kenyan beneficiary in BRIDGE-AI, anchoring the Smart Mushroom case study
              through the Mushroom Demonstration Farm at the JKUAT Smart Farm Zone in Juja, Kenya.
            </p>
            <div class="hero-buttons">
              <a href="#profile" class="btn-primary">
                <i class="fas fa-arrow-right btn-icon"></i>
                Explore Our Role
              </a>
            </div>
          </div>
        </div>
      </section>

      <nav class="section-nav" aria-label="Page sections">
        <div class="section-nav-inner">
          <a href="#profile" data-section="profile" class="active">Profile</a>
          <a href="#jhub-role" data-section="jhub-role">JHUB Africa</a>
          <a href="#wp5" data-section="wp5">WP5 Leadership</a>
          <a href="#responsibilities" data-section="responsibilities">Responsibilities</a>
          <a href="#team" data-section="team">Team</a>
        </div>
      </nav>

      <section class="section" id="profile">
        <div class="container">
          <div class="section-header reveal">
            <h2>JKUAT <span class="highlight">Profile</span></h2>
            <p>Jomo Kenyatta University of Agriculture and Technology - leading agricultural innovation in East Africa</p>
          </div>

          <div class="profile-wrapper">
            <div class="profile-text reveal">
              <h2>Jomo Kenyatta University of <span class="highlight">Agriculture and Technology</span></h2>

              <p>
                <strong>JKUAT</strong> is the Kenyan beneficiary in BRIDGE-AI and leads
                <strong>Work Package 5: Capacity Building and Replication</strong>. At the local level,
                JKUAT anchors the Smart Mushroom case study through the Mushroom Demonstration Farm at the
                JKUAT Smart Farm Zone in Juja, Kenya.
              </p>

              <p>
                JKUAT contributes to platform requirements, sensor and data readiness, pilot implementation,
                gender and inclusion reporting, farmer engagement, training delivery, SME mentoring,
                open repositories and replication planning.
              </p>

              <div class="highlight-box">
                <strong>JKUAT's Legacy</strong>
                <p>
                  JKUAT is a leading institution in agricultural research and technology innovation in East Africa,
                  with a strong track record of addressing food security and sustainable development challenges
                  through cutting-edge research and community engagement.
                </p>
              </div>
            </div>

            <div class="profile-image reveal">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="JKUAT campus" loading="lazy" />
            </div>
          </div>

          <div class="profile-stats reveal">
            <div class="stat-box">
              <span class="stat-number">WP5</span>
              <span class="stat-label">Capacity Building Lead</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">1</span>
              <span class="stat-label">Smart Mushroom Pilot</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">400K+</span>
              <span class="stat-label">Farmers Reached</span>
            </div>
            <div class="stat-box">
              <span class="stat-number">8</span>
              <span class="stat-label">Project Partners</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-alt" id="jhub-role">
        <div class="container">
          <div class="section-header reveal">
            <h2>JHUB Africa: <span class="highlight">Digital Innovation</span></h2>
            <p>JHUB Africa provides the local digital innovation and outreach interface for BRIDGE-AI Kenya</p>
          </div>

          <div class="jhub-wrapper reveal">
            <div class="jhub-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="JHUB Africa" />
            </div>
            <div class="jhub-content">
              <h2>The <span class="highlight">Innovation Hub</span></h2>
              <p>
                JHUB Africa is JKUAT's digital innovation centre, serving as the local interface for documenting
                JKUAT-led BRIDGE-AI activities. It engages students and developers, connects SMEs, and communicates
                project progress to Kenyan and regional stakeholders.
              </p>
              <p>
                Through JHUB Africa, BRIDGE-AI Kenya builds capacity, fosters innovation, and creates pathways
                for youth and women to participate in the digital agriculture revolution.
              </p>
              <p>
                <strong>JHUB Africa value:</strong> A local digital innovation interface for students, developers,
                startups and the agricultural technology ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="wp5">
        <div class="container">
          <div class="section-header reveal">
            <h2>WP5 <span class="highlight">Leadership</span></h2>
            <p>JKUAT leads Work Package 5: Capacity Building and Replication - building African expertise in GenAI solutions for agriculture</p>
          </div>

          <div class="wp5-grid">
            <div class="wp5-card reveal">
              <span class="wp5-number">T5.1</span>
              <h4>Training Content Development</h4>
              <p>Modular training kits, video tutorials, downloadable guides, and links to repositories for East African SMEs, developers, and universities.</p>
            </div>
            <div class="wp5-card reveal">
              <span class="wp5-number">T5.2</span>
              <h4>Local Training Bootcamps</h4>
              <p>Hands-on training at JKUAT Smart Farm Zone combining GenAI, IoT, APIs, deployment practices, entrepreneurship, and real agricultural case studies.</p>
            </div>
            <div class="wp5-card reveal">
              <span class="wp5-number">T5.3</span>
              <h4>SME Engagement &amp; Mentoring</h4>
              <p>SME mentoring, expression-of-interest, challenge statements, hackathon archive, and success stories for agri-business growth.</p>
            </div>
            <div class="wp5-card reveal">
              <span class="wp5-number">T5.4</span>
              <h4>Community &amp; Repositories</h4>
              <p>Developer community, GitHub/FIWARE links, contribution guidelines, and community-of-practice for sustained innovation.</p>
            </div>
            <div class="wp5-card reveal">
              <span class="wp5-number">T5.5</span>
              <h4>Replication Toolkit</h4>
              <p>Replication playbook, Kenya lessons, localisation templates, and adoption pathway for scaling across East Africa.</p>
            </div>
            <div class="wp5-card reveal">
              <span class="wp5-number gold">Open</span>
              <h4>Open Repositories</h4>
              <p>Publicly accessible training materials, code repositories, and resources for the global community to learn from and build upon.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-alt" id="responsibilities">
        <div class="container">
          <div class="section-header reveal">
            <h2>Local <span class="highlight">Responsibilities</span></h2>
            <p>Key responsibilities of JKUAT in implementing BRIDGE-AI Kenya</p>
          </div>

          <div class="responsibilities-wrapper reveal">
            <ul class="responsibilities-grid">
              <li><span class="resp-icon"><i class="fas fa-check-circle"></i></span>Platform requirements and technical specifications</li>
              <li><span class="resp-icon"><i class="fas fa-check-circle"></i></span>Sensor and data readiness for the Smart Mushroom pilot</li>
              <li><span class="resp-icon"><i class="fas fa-check-circle"></i></span>Pilot implementation and monitoring at JKUAT Smart Farm Zone</li>
              <li><span class="resp-icon"><i class="fas fa-check-circle"></i></span>Gender and inclusion reporting for Horizon Europe</li>
              <li><span class="resp-icon"><i class="fas fa-check-circle"></i></span>Farmer engagement and community outreach</li>
              <li><span class="resp-icon"><i class="fas fa-check-circle"></i></span>Training delivery and bootcamp coordination</li>
              <li><span class="resp-icon"><i class="fas fa-check-circle"></i></span>SME mentoring and entrepreneurship support</li>
              <li><span class="resp-icon"><i class="fas fa-check-circle"></i></span>Open repositories and knowledge management</li>
              <li><span class="resp-icon"><i class="fas fa-check-circle"></i></span>Replication planning and toolkit development</li>
              <li><span class="resp-icon"><i class="fas fa-check-circle"></i></span>EU visibility and compliance reporting</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section" id="team">
        <div class="container">
          <div class="section-header reveal">
            <h2>Our <span class="highlight">Team</span></h2>
            <p>Meet the team driving BRIDGE-AI Kenya at JKUAT and JHUB Africa</p>
          </div>

          <div class="team-grid" *ngIf="teamMembers().length; else emptyTeam">
            <div class="team-card reveal" *ngFor="let member of teamMembers()">
              <div class="team-photo">
                <img *ngIf="member.photo" [src]="member.photo" [alt]="member.name" />
                <span *ngIf="!member.photo" class="placeholder">{{ member.name?.charAt(0)?.toUpperCase() || 'A' }}</span>
              </div>
              <span class="team-status">Active</span>
              <h4>{{ member.name }}</h4>
              <div class="team-role">{{ member.role }}</div>
              <div *ngIf="member.affiliation" class="team-affiliation">{{ member.affiliation }}</div>
              <div *ngIf="member.bio" class="team-bio">{{ member.bio }}</div>
              <a *ngIf="member.email" [href]="'mailto:' + member.email" class="team-email">
                <i class="fas fa-envelope" style="margin-right: 6px;"></i>Contact
              </a>
            </div>
          </div>

          <ng-template #emptyTeam>
            <div class="team-empty reveal">
              <span class="empty-icon"><i class="fas fa-users"></i></span>
              <h3>Team Members Coming Soon</h3>
              <p>Our JKUAT team profiles will be added here as they become available.</p>
            </div>
          </ng-template>
        </div>
      </section>

      <section class="section" style="padding-top: 0;">
        <div class="container">
          <div class="cta-banner reveal">
            <span class="cta-label">Work With JKUAT</span>
            <h3>Get Involved</h3>
            <p>Join us in building capacity and driving innovation in agritech</p>
            <div class="cta-links">
              <a [routerLink]="['/training-events']" class="cta-link">Join Training</a>
              <a [routerLink]="['/contact']" class="cta-link outline">Contact Us</a>
              <a [routerLink]="['/partners']" class="cta-link outline">Partner With Us</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host {
      --site-header-offset: 92px;
      display: block;
      background: #f7f2e6;
      color: #2d3d35;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    img { max-width: 100%; display: block; }
    a { text-decoration: none; }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    ::selection { background: #7c4fa3; color: #fff; }

    .section-header {
      max-width: 720px;
      margin: 0 auto 48px;
      text-align: center;
    }
    .section-header h2 {
      font-size: 2.8rem;
      font-weight: 800;
      color: #17241b;
      line-height: 1.08;
      letter-spacing: -0.02em;
    }
    .section-header h2 .highlight,
    .profile-text h2 .highlight,
    .jhub-content h2 .highlight,
    .section-header .highlight {
      color: #26432b;
      font-weight: 800;
    }
    .section-header p {
      font-size: 1.05rem;
      color: #6e7767;
      margin-top: 14px;
      font-weight: 400;
    }
    .section-alt { background: #efe6ce; }

    .hero {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      min-height: 85vh;
      background: #16281a;
    }
    .hero-image-wrapper {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }
    .hero-slide-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 0;
      transition: opacity 1.8s ease;
    }
    .hero-slide-bg.active { opacity: 1; }
    .hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(22, 40, 26, 0.6);
      z-index: 1;
    }
    .hero-content-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 900px;
      padding: 60px 40px;
      text-align: center;
    }
    .hero-content h1 {
      font-size: 3.6rem;
      font-weight: 900;
      color: #fff;
      line-height: 1.08;
      letter-spacing: -0.02em;
      margin-bottom: 10px;
      text-shadow: 0 4px 30px rgba(0,0,0,0.4);
    }
    .hero-content h1 .highlight { color: #c89be8; }
    .hero-content .hero-sub {
      font-size: 1.2rem;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
      margin-bottom: 6px;
      text-shadow: 0 2px 15px rgba(0,0,0,0.3);
      letter-spacing: 0.02em;
    }
    .hero-content .hero-description {
      font-size: 1.02rem;
      color: rgba(255,255,255,0.8);
      line-height: 1.8;
      margin: 16px auto 28px;
      max-width: 680px;
      text-shadow: 0 2px 15px rgba(0,0,0,0.3);
    }
    .hero-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 32px;
      background: #26432b;
      color: #f7f2e6;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.88rem;
      border-radius: 50px;
      transition: all 0.35s ease;
      border: none;
      cursor: pointer;
    }
    .btn-primary:hover {
      background: #16281a;
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(22, 40, 26, 0.3);
    }
    .btn-icon { font-size: 1rem; }

    .section-nav {
      position: sticky;
      top: var(--site-header-offset);
      z-index: 40;
      background: rgba(255, 253, 247, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid #e1d8c0;
    }
    .section-nav-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 28px;
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
    }
    .section-nav a {
      display: inline-flex;
      align-items: center;
      padding: 14px 20px;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #6e7767;
      text-decoration: none;
      border-bottom: 2px solid transparent;
      transition: all 0.25s ease;
    }
    .section-nav a:hover { color: #17241b; }
    .section-nav a.active {
      color: #26432b;
      border-bottom-color: #c89b3c;
    }

    .section {
      padding: 80px 0;
      scroll-margin-top: calc(var(--site-header-offset) + 64px);
    }

    .profile-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 56px;
      align-items: stretch;
    }
    .profile-text {
      flex: 1 1 55%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .profile-text h2 {
      font-size: 2.4rem;
      font-weight: 800;
      color: #17241b;
      line-height: 1.08;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }
    .profile-text p {
      font-size: 1.02rem;
      color: #2d3d35;
      line-height: 1.8;
      margin-bottom: 16px;
    }
    .highlight-box {
      background: #fffdf7;
      border: 3px solid #c89b3c;
      padding: 22px 26px;
      border-radius: 0 8px 8px 0;
      margin: 22px 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .highlight-box strong {
      color: #17241b;
      display: block;
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .highlight-box p {
      margin: 0;
      font-size: 0.96rem;
      color: #6e7767;
    }
    .profile-image {
      flex: 1 1 35%;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0,0,0,0.12);
      min-height: 320px;
      background: #16281a;
      display: flex;
      align-items: stretch;
    }
    .profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      min-height: 320px;
    }
    .profile-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 20px;
    }
    .stat-box {
      flex: 1 1 calc(50% - 8px);
      min-width: 120px;
      background: #fffdf7;
      border: 1px solid #e1d8c0;
      border-radius: 16px;
      padding: 22px 16px;
      text-align: center;
      transition: all 0.3s ease;
    }
    .stat-box:hover {
      box-shadow: 0 12px 40px rgba(0,0,0,0.08);
      border-color: #26432b;
    }
    .stat-box .stat-number {
      font-size: 1.8rem;
      font-weight: 800;
      color: #26432b;
      display: block;
      line-height: 1.1;
    }
    .stat-box .stat-label {
      color: #6e7767;
      font-size: 0.72rem;
      font-weight: 500;
      margin-top: 4px;
      display: block;
    }

    .jhub-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 48px;
      align-items: center;
      background: #fffdf7;
      border-radius: 24px;
      padding: 48px 52px;
      border: 1px solid #e1d8c0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .jhub-content {
      flex: 1 1 50%;
    }
    .jhub-content h2 {
      font-size: 2.2rem;
      font-weight: 800;
      color: #17241b;
      line-height: 1.08;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
    }
    .jhub-content p {
      font-size: 1.02rem;
      color: #2d3d35;
      line-height: 1.8;
      margin-bottom: 12px;
    }
    .jhub-content p:last-of-type { margin-bottom: 0; }
    .jhub-image {
      flex: 1 1 35%;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0,0,0,0.08);
      background: whitesmoke;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .jhub-image img { width: 100%; height: auto; object-fit: contain; }

    .wp5-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: center;
    }
    .wp5-card {
      flex: 1 1 calc(50% - 12px);
      min-width: 280px;
      max-width: 580px;
      background: #fffdf7;
      border-radius: 16px;
      padding: 30px 28px;
      box-shadow: 8px 8px 24px rgba(23, 36, 27, 0.08), -8px -8px 24px rgba(255, 253, 247, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.5);
      transition: all 0.4s ease;
    }
    .wp5-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 64px rgba(0,0,0,0.12);
      border-color: rgba(124, 79, 163, 0.09);
    }
    .wp5-card .wp5-number {
      display: inline-block;
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #f7f2e6;
      background: #26432b;
      padding: 3px 14px;
      border-radius: 50px;
      margin-bottom: 10px;
    }
    .wp5-card .wp5-number.gold {
      background: #c89b3c;
    }
    .wp5-card h4 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #17241b;
      margin-bottom: 6px;
    }
    .wp5-card p {
      font-size: 0.9rem;
      color: #6e7767;
      line-height: 1.7;
      margin: 0;
    }

    .responsibilities-wrapper {
      background: #fffdf7;
      border-radius: 24px;
      padding: 44px 52px;
      border: 1px solid #e1d8c0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .responsibilities-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 40px;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .responsibilities-grid li {
      flex: 1 1 calc(50% - 20px);
      min-width: 240px;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 0;
      color: #2d3d35;
      font-size: 0.95rem;
      border-bottom: 1px solid #e1d8c0;
      transition: all 0.3s ease;
    }
    .responsibilities-grid li:hover {
      padding-left: 6px;
      color: #17241b;
    }
    .resp-icon {
      color: #c89b3c;
      font-size: 0.8rem;
      flex-shrink: 0;
      width: 20px;
      text-align: center;
    }

    .team-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 28px;
      justify-content: center;
    }
    .team-card {
      flex: 1 1 calc(33.333% - 20px);
      min-width: 240px;
      max-width: 360px;
      background: #fffdf7;
      border: 1px solid #e1d8c0;
      border-radius: 16px;
      padding: 32px 24px 28px;
      text-align: center;
      transition: all 0.4s ease;
    }
    .team-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.08);
      border-color: #7c4fa3;
    }
    .team-photo {
      width: 106px;
      height: 106px;
      border-radius: 50%;
      background: #efe6ce;
      margin: 0 auto 16px;
      overflow: hidden;
      border: 3px solid #e1d8c0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .team-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .placeholder {
      font-size: 2.4rem;
      font-weight: 700;
      color: #26432b;
    }
    .team-status {
      display: inline-block;
      font-size: 0.56rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 3px 14px;
      border-radius: 50px;
      background: rgba(124, 79, 163, 0.09);
      color: #5b3878;
      margin-bottom: 10px;
    }
    .team-card h4 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #17241b;
      margin-bottom: 2px;
    }
    .team-role {
      font-size: 0.85rem;
      color: #c89b3c;
      font-weight: 600;
    }
    .team-affiliation {
      font-size: 0.78rem;
      color: #6e7767;
      margin-top: 4px;
    }
    .team-bio {
      font-size: 0.85rem;
      color: #6e7767;
      line-height: 1.7;
      margin-top: 12px;
    }
    .team-email {
      display: inline-block;
      font-size: 0.76rem;
      color: #26432b;
      margin-top: 12px;
      padding: 7px 20px;
      border: 1px solid #e1d8c0;
      border-radius: 50px;
      transition: all 0.3s ease;
    }
    .team-email:hover {
      background: #26432b;
      color: #fff;
      border-color: #26432b;
    }
    .team-empty {
      text-align: center;
      padding: 70px 20px;
      background: #efe6ce;
      border-radius: 24px;
      border: 2px dashed #e1d8c0;
      width: 100%;
    }
    .empty-icon {
      font-size: 2.6rem;
      display: block;
      margin-bottom: 16px;
      color: #26432b;
      opacity: 0.3;
    }
    .team-empty h3 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #17241b;
      margin-bottom: 6px;
    }
    .team-empty p {
      color: #6e7767;
    }

    .cta-banner {
      background: #16281a;
      border-radius: 24px;
      padding: 56px 48px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .cta-banner::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 0%, rgba(200,155,60,0.1), transparent 60%);
      pointer-events: none;
    }
    .cta-banner > * { position: relative; z-index: 1; }
    .cta-label {
      display: block;
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: #d4b06a;
      margin-bottom: 14px;
    }
    .cta-banner h3 {
      color: #fff;
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 10px;
      letter-spacing: -0.005em;
    }
    .cta-banner p {
      color: rgba(255, 255, 255, 0.55);
      font-size: 1rem;
      max-width: 560px;
      margin: 0 auto 28px;
      line-height: 1.75;
    }
    .cta-links {
      display: flex;
      gap: 14px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .cta-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 30px;
      background: #c89b3c;
      color: #16281a;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.88rem;
      border-radius: 50px;
      transition: all 0.35s ease;
    }
    .cta-link:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(200, 155, 60, 0.3);
    }
    .cta-link.outline {
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .cta-link.outline:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .reveal {
      opacity: 1;
      transform: none;
      transition: all 0.7s ease;
    }

    @media (max-width: 1024px) {
      .hero-content h1 { font-size: 2.8rem; }
      .section-header h2 { font-size: 2.2rem; }
      .profile-text h2 { font-size: 2.2rem; }
      .jhub-content h2 { font-size: 2.2rem; }
      .profile-image { flex: 1 1 100%; min-height: 240px; }
      .jhub-wrapper { flex-direction: column; padding: 32px 28px; }
      .jhub-image { flex: 1 1 100%; min-height: 160px; }
      .jhub-content { flex: 1 1 100%; }
      .wp5-card { flex: 1 1 100%; max-width: 100%; }
      .team-card { flex: 1 1 calc(50% - 14px); max-width: none; }
    }

    @media (max-width: 768px) {
      .section-nav a { padding: 10px 14px; font-size: 0.6rem; }
      .hero { min-height: 70vh; }
      .hero-content-wrapper { padding: 40px 24px; }
      .hero-content h1 { font-size: 2.2rem; }
      .hero-content .hero-sub { font-size: 1rem; }
      .hero-content .hero-description { font-size: 0.92rem; }
      .hero-buttons { flex-direction: column; width: 100%; }
      .hero-buttons .btn-primary { width: 100%; justify-content: center; }
      .section { padding: 60px 0; }
      .section-header h2 { font-size: 1.8rem; }
      .section-header p { font-size: 0.95rem; }
      .profile-wrapper { flex-direction: column; gap: 32px; }
      .profile-text h2 { font-size: 1.8rem; text-align: center; }
      .profile-text p { text-align: center; }
      .highlight-box { text-align: left; }
      .profile-image { min-height: 200px; }
      .profile-stats { justify-content: center; }
      .stat-box { flex: 1 1 calc(50% - 8px); min-width: 100px; }
      .jhub-content h2 { font-size: 1.8rem; text-align: center; }
      .jhub-content p { text-align: center; }
      .jhub-image { min-height: 140px; }
      .responsibilities-wrapper { padding: 28px 20px; }
      .responsibilities-grid li { flex: 1 1 100%; min-width: 100%; }
      .team-card { flex: 1 1 100%; max-width: 320px; margin: 0 auto; }
      .cta-banner { padding: 40px 24px; }
      .cta-banner h3 { font-size: 1.6rem; }
      .cta-links { flex-direction: column; align-items: center; }
      .cta-link { width: 100%; max-width: 300px; justify-content: center; }
    }

    @media (max-width: 480px) {
      .container { padding: 0 16px; }
      .hero-content h1 { font-size: 1.8rem; }
      .hero-content .hero-sub { font-size: 0.9rem; }
      .hero-content .hero-description { font-size: 0.85rem; }
      .section-header h2 { font-size: 1.5rem; }
      .profile-text h2 { font-size: 1.5rem; }
      .jhub-content h2 { font-size: 1.5rem; }
      .cta-banner h3 { font-size: 1.4rem; }
      .stat-box .stat-number { font-size: 1.4rem; }
      .stat-box { padding: 16px 12px; }
      .profile-stats { gap: 10px; }
      .stat-box { flex: 1 1 100%; min-width: 100%; }
      .jhub-wrapper { padding: 24px 18px; }
      .responsibilities-wrapper { padding: 20px 16px; }
      .responsibilities-grid li { font-size: 0.85rem; }
      .team-card { padding: 24px 18px; }
      .wp5-card { padding: 24px 20px; }
      .section-nav a { padding: 8px 12px; font-size: 0.55rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `]
})
export class JkuatRoleComponent implements OnInit, AfterViewInit {
  protected teamMembers = signal<TeamMember[]>([]);

  protected pilotSite = LOCAL_CONTEXT.PILOT_SITE;
  protected hostInstitution = LOCAL_CONTEXT.HOST_INSTITUTION;
  protected hub = LOCAL_CONTEXT.HUB;
  protected focusArea = LOCAL_CONTEXT.FOCUS_AREA;

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.loadTeamMembers();
  }

  ngAfterViewInit(): void {
    this.syncHeaderOffset();
    window.addEventListener('resize', this.syncHeaderOffset.bind(this));

    const navLinks = Array.from(document.querySelectorAll('.section-nav a')) as HTMLAnchorElement[];
    const sections = navLinks
      .map((link) => document.getElementById(link.getAttribute('data-section') || ''))
      .filter(Boolean) as HTMLElement[];

    navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) {
          return;
        }

        const target = document.querySelector(targetId) as HTMLElement | null;
        if (!target) {
          return;
        }

        event.preventDefault();
        const header = document.querySelector('.site-header') as HTMLElement | null;
        const headerHeight = header ? header.offsetHeight : 0;
        const navHeight = document.querySelector('.section-nav')?.getBoundingClientRect().height ?? 0;
        const offset = headerHeight + navHeight + 18;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      });
    });

    if (!sections.length || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = document.querySelector(`.section-nav a[data-section="${entry.target.id}"]`) as HTMLAnchorElement | null;
          if (!link) {
            return;
          }

          if (entry.isIntersecting) {
            navLinks.forEach((item) => item.classList.remove('active'));
            link.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  private syncHeaderOffset(): void {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const height = header ? header.offsetHeight : 92;
    const root = document.documentElement;
    root.style.setProperty('--site-header-offset', `${height}px`);
  }

  private loadTeamMembers(): void {
    this.teamService.getApprovedTeamMembers().subscribe({
      next: (members) => this.teamMembers.set(members),
      error: () => this.teamMembers.set([])
    });
  }
}