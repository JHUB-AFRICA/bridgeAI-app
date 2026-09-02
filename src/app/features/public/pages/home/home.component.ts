// ============================================================
// BRIDGE-AI Kenya - Home Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { EventService } from '../../../../services/event.service';
import { Activity } from '../../../core/models/activity.model';
import { Event } from '../../../core/models/event.model';
import { APP, FUNDING } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="home-page">
      <section class="hero" id="heroSection">
        <div class="hero-image-wrapper" id="heroImageWrapper">
          <div class="hero-slide-bg active" style="background-image: url('https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=1600&q=80');"></div>
        </div>

        <div class="hero-content-wrapper">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-text">{{ grantNumber }}</span>
            </div>

            <h1>
              BRIDGE-AI
            </h1>

            <p class="hero-sub">
              Building ResIlient Development with<br>
              GEnerative AI in Education &amp; Agriculture
            </p>

            <h2 class="hero-highlight-title">
              <span class="highlight">Transforming</span> African Agriculture
            </h2>

            <p class="hero-description">
              BRIDGE-AI is building a climate-resilient agricultural future across Africa.
              By combining generative AI, IoT sensing, and digital shadow technology,
              we're empowering farmers, youth, and SMEs with the tools and skills they need to thrive.
            </p>

            <div class="hero-buttons">
              <a [routerLink]="['/smart-mushrooms']" class="btn-primary">
                <i class="fas fa-seedling btn-icon"></i>
                Smart-Mushrooms Pilot
              </a>
              <a [routerLink]="['/training-wp5']" class="btn-secondary">
                <i class="fas fa-graduation-cap btn-icon"></i>
                Training
              </a>
            </div>
          </div>
        </div>
      </section>

      <nav class="section-nav" aria-label="Page sections">
        <div class="section-nav-inner">
          <a href="#pilot-regions" data-section="pilot-regions" class="active">Pilot Regions</a>
          <a href="#challenge" data-section="challenge">Challenge</a>
          <a href="#jkuat-role" data-section="jkuat-role">JKUAT Role</a>
          <a href="#progress" data-section="progress">Progress</a>
          <a href="#latest" data-section="latest">Activities</a>
          <a href="#connect" data-section="connect">Connect</a>
        </div>
      </nav>

      <section class="pilot-section" id="pilot-regions">
        <div class="container">
          <div class="section-header">
            <h2>Pilot <span class="highlight">Regions</span></h2>
            <p>BRIDGE-AI validates its solutions in real agriculture systems across Africa</p>
          </div>

          <div class="pilot-grid">
            <div class="pilot-card">
              <div class="pilot-image">
                <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900&q=80" alt="Maize farming in Nigeria" loading="lazy">
              </div>
              <div class="pilot-body">
                <span class="pilot-title">Maize</span>
                <span class="pilot-country"><i class="fas fa-map-pin"></i> Nigeria</span>
                <p>Maize production, with tools for seasonal planning and climate adaptation.</p>
              </div>
            </div>

            <div class="pilot-card">
              <div class="pilot-image">
                <img src="https://images.unsplash.com/photo-1464226184884-fa52ac9fcf8b?w=900&q=80" alt="Mushroom cultivation in Kenya" loading="lazy">
              </div>
              <div class="pilot-body">
                <span class="pilot-title">Mushroom</span>
                <span class="pilot-country"><i class="fas fa-map-pin"></i> Kenya</span>
                <p>Mushroom cultivation in microclimates with environmental monitoring and yield prediction.</p>
              </div>
            </div>

            <div class="pilot-card">
              <div class="pilot-image">
                <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&q=80" alt="Pasture in Tunisia" loading="lazy">
              </div>
              <div class="pilot-body">
                <span class="pilot-title">Pasture</span>
                <span class="pilot-country"><i class="fas fa-map-pin"></i> Tunisia</span>
                <p>Environmental information and digital tools to help farmers better understand pasture growth.</p>
              </div>
            </div>

            <div class="pilot-card">
              <div class="pilot-image">
                <img src="https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=900&q=80" alt="Pomegranate in Tunisia" loading="lazy">
              </div>
              <div class="pilot-body">
                <span class="pilot-title">Pomegranate</span>
                <span class="pilot-country"><i class="fas fa-map-pin"></i> Tunisia</span>
                <p>Data-driven recommendations on irrigation, biomass and crop care to increase productivity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="challenge-section" id="challenge">
        <div class="container">
          <div class="challenge-wrapper">
            <div class="challenge-text">
              <h2>The <span class="highlight">Challenge</span></h2>
              <p>
                Agriculture in Africa is highly dependent on rainfall, with more than 95% of cultivated land relying on it. This makes farmers particularly vulnerable to climate variability and extreme weather conditions.
              </p>
              <p>
                Limited access to irrigation systems, advisory services and digital tools further constrains productivity and innovation. While artificial intelligence offers strong potential, many solutions remain inaccessible or not adapted to local needs.
              </p>

              <div class="challenge-stats">
                <div class="challenge-stat">
                  <span class="stat-number">95%</span>
                  <span class="stat-label">Rain-fed Agriculture</span>
                </div>
                <div class="challenge-stat">
                  <span class="stat-number">3</span>
                  <span class="stat-label">Pilot Countries</span>
                </div>
                <div class="challenge-stat">
                  <span class="stat-number">400K+</span>
                  <span class="stat-label">Farmers Reached</span>
                </div>
              </div>
            </div>

            <div class="challenge-image">
              <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80" alt="African agriculture" loading="lazy">
            </div>
          </div>
        </div>
      </section>

      <section class="jkuat-section" id="jkuat-role">
        <div class="container">
          <div class="section-header">
            <h2>What JKUAT <span class="highlight purple">is doing</span></h2>
            <p>Leading the Smart Mushroom pilot and WP5 capacity building in Kenya.</p>
          </div>

          <div class="jkuat-grid">
            <div class="jkuat-card">
              <div class="card-image">
                <img src="https://images.unsplash.com/photo-1464226184884-fa52ac9fcf8b?w=800&q=80" alt="Smart Mushroom Pilot" loading="lazy">
              </div>
              <div class="card-body">
                <span class="card-badge">Pilot</span>
                <h3>Smart Mushroom Pilot</h3>
                <p>GenAI-assisted monitoring, anomaly detection, digital shadows and IoT sensing for mushroom grow rooms at JKUAT Smart Farm Zone.</p>
                <a [routerLink]="['/smart-mushrooms']" class="card-link">Learn More <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>

            <div class="jkuat-card">
              <div class="card-image">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="Kenya Living Lab" loading="lazy">
              </div>
              <div class="card-body">
                <span class="card-badge">Lab</span>
                <h3>Kenya Living Lab</h3>
                <p>Co-design and feedback activities with farmers, researchers, youth, women and SMEs to ensure solutions meet local needs.</p>
                <a [routerLink]="['/jkuat-role']" class="card-link">Explore JKUAT Role <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>

            <div class="jkuat-card">
              <div class="card-image">
                <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80" alt="Training and Bootcamps" loading="lazy">
              </div>
              <div class="card-body">
                <span class="card-badge">Training</span>
                <h3>Training &amp; Bootcamps</h3>
                <p>Hands-on training programs, bootcamps and workshops build digital skills and enable replication across East Africa.</p>
                <a [routerLink]="['/training-wp5']" class="card-link">View Events <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>

            <div class="jkuat-card">
              <div class="card-image">
                <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80" alt="SME Mentoring" loading="lazy">
              </div>
              <div class="card-body">
                <span class="card-badge">Mentor</span>
                <h3>SME Mentoring</h3>
                <p>Supporting agricultural SMEs to adopt, adapt and scale smart farming solutions through mentoring and technical assistance.</p>
                <a [routerLink]="['/partners']" class="card-link">Learn More <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>

            <div class="jkuat-card">
              <div class="card-image">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80" alt="Replication Toolkit" loading="lazy">
              </div>
              <div class="card-body">
                <span class="card-badge">Scale</span>
                <h3>Replication Toolkit</h3>
                <p>Playbooks, training materials and open repositories enable replication of the Smart Mushroom model across East Africa.</p>
                <a [routerLink]="['/resources']" class="card-link">View Toolkit <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>

            <div class="jkuat-card">
              <div class="card-image">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" alt="WP5 Leadership" loading="lazy">
              </div>
              <div class="card-body">
                <span class="card-badge">WP5</span>
                <h3>WP5 Leadership</h3>
                <p>Leading Work Package 5: Capacity Building and Replication, building African expertise in GenAI solutions for agriculture.</p>
                <a [routerLink]="['/training-wp5']" class="card-link">Explore WP5 <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="counters-section" id="progress">
        <div class="container">
          <div class="section-header counters-header">
            <h2>Making a <span class="highlight purple">Difference</span></h2>
          </div>
          <div class="counters-grid">
            <div class="counter-item">
              <span class="counter-number" data-count="12">0<span class="counter-suffix">+</span></span>
              <span class="counter-label">Activities</span>
            </div>
            <div class="counter-item">
              <span class="counter-number" data-count="150">0<span class="counter-suffix">+</span></span>
              <span class="counter-label">Participants Trained</span>
            </div>
            <div class="counter-item">
              <span class="counter-number" data-count="45">0<span class="counter-suffix">%</span></span>
              <span class="counter-label">Women / Youth Reached</span>
            </div>
            <div class="counter-item">
              <span class="counter-number" data-count="8">0<span class="counter-suffix">+</span></span>
              <span class="counter-label">Events</span>
            </div>
            <div class="counter-item">
              <span class="counter-number" data-count="15">0<span class="counter-suffix">+</span></span>
              <span class="counter-label">Resources</span>
            </div>
            <div class="counter-item">
              <span class="counter-number" data-count="10">0<span class="counter-suffix">+</span></span>
              <span class="counter-label">SMEs Mentored</span>
            </div>
          </div>
        </div>
      </section>

      <section class="activity-section" id="latest">
        <div class="container">
          <div class="section-header">
            <h2>Latest <span class="highlight">Activities</span> &amp; <span class="highlight purple">Events</span></h2>
            <p>Stay updated with the latest news and upcoming training opportunities.</p>
          </div>

          <div class="activity-grid">
            <div class="activity-col">
              <div class="col-heading">
                <h2>Updates <span class="accent">Activities</span></h2>
              </div>

              <ng-container *ngIf="latestActivities().length; else activityFallback">
                <div class="activity-item" *ngFor="let activity of latestActivities() | slice:0:3">
                  <div class="activity-img">
                    <img [src]="activity.featured_image || 'https://images.unsplash.com/photo-1464226184884-fa52ac9fcf8b?w=800&q=80'" [alt]="activity.title" loading="lazy">
                  </div>
                  <div class="activity-copy">
                    <div class="activity-meta">
                      <span class="date">{{ activity.date || 'Coming Soon' }}</span>
                      <span class="tag" *ngIf="activity.wp_tag">{{ activity.wp_tag }}</span>
                    </div>
                    <h4>{{ activity.title }}</h4>
                    <p>{{ activity.summary || 'Latest BRIDGE-AI activity update.' }}</p>
                  </div>
                </div>
              </ng-container>

              <ng-template #activityFallback>
                <div class="activity-item">
                  <div class="activity-img"><div class="placeholder">UPD</div></div>
                  <div class="activity-copy">
                    <div class="activity-meta"><span class="date">Coming Soon</span></div>
                    <h4>Activities Loading</h4>
                    <p>Check back soon for updates from BRIDGE-AI Kenya activities.</p>
                  </div>
                </div>
              </ng-template>

              <a [routerLink]="['/activities']" class="view-all-link">View all activities <i class="fas fa-arrow-right"></i></a>
            </div>

            <div class="activity-col">
              <div class="col-heading">
                <h2>Upcoming <span class="accent purple">Training</span></h2>
              </div>

              <ng-container *ngIf="upcomingEvents().length; else eventFallback">
                <div class="event-item" *ngFor="let event of upcomingEvents() | slice:0:3">
                  <div class="event-date">
                    <span class="day">{{ event.date ? event.date.slice(8,10) : 'TBA' }}</span>
                    <span class="month">{{ event.date ? event.date.slice(5,7) : 'TBA' }}</span>
                  </div>
                  <div class="event-info">
                    <h5>{{ event.title }}</h5>
                    <p>{{ event.location || 'Location TBD' }}</p>
                  </div>
                  <span class="event-status">{{ event.status || 'Upcoming' }}</span>
                </div>
              </ng-container>

              <ng-template #eventFallback>
                <div class="event-item">
                  <div class="event-date"><span class="day">TBA</span><span class="month">TBA</span></div>
                  <div class="event-info"><h5>Bootcamp Coming Soon</h5><p>East Africa / Kenya Bootcamp</p></div>
                  <span class="event-status soon">Coming Soon</span>
                </div>
              </ng-template>

              <a [routerLink]="['/training-wp5']" class="view-all-link">View all training <i class="fas fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </section>

      <section class="cta-section" id="connect">
        <div class="container">
          <h2>Stay Connected</h2>
          <p>Follow our journey and be a part of the BRIDGE-AI community.</p>
          <div class="cta-buttons">
            <a [routerLink]="['/contact']" class="btn-primary btn-primary-two">
              <i class="fas fa-envelope btn-icon"></i>
              Contact Us
            </a>
            <a [routerLink]="['/training-wp5']" class="btn-light">
              <i class="fas fa-bell btn-icon"></i>
              Subscribe Now
            </a>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #f7f2e6;
      color: #2d3d35;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .home-page {
      background: #f7f2e6;
      color: #2d3d35;
      line-height: 1.7;
      overflow-x: hidden;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 28px;
    }

    .hero {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      min-height: 100vh;
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
      opacity: 0.7;
      filter: saturate(0.9);
    }

    .hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(22, 40, 26, 0.65);
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
      text-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    }

    .hero-sub {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
      margin-bottom: 6px;
      text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
      letter-spacing: 0.02em;
    }

    .hero-highlight-title {
      font-size: 2.8rem;
      margin-top: 4px;
      margin-bottom: 0;
      font-weight: 800;
      color: #fff;
      line-height: 1.08;
      letter-spacing: -0.02em;
      text-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    }

    .highlight {
      color: #c89be8;
      font-weight: 900;
    }

    .highlight.purple {
      color: #c89be8;
    }

    .hero-description {
      font-size: 1.02rem;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.8;
      margin: 16px auto 28px;
      max-width: 680px;
      text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
    }

    .hero-badge {
      display: inline-block;
      padding: 4px 16px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }

    .badge-text {
      color: #c89be8;
    }

    .hero-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .btn-primary,
    .btn-secondary,
    .btn-light {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 32px;
      border-radius: 50px;
      text-decoration: none;
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 0.88rem;
      transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .btn-primary {
      background: #26432b;
      color: #fff;
      border: none;
      box-shadow: 0 12px 32px rgba(22, 40, 26, 0.3);
    }

    .btn-primary:hover {
      background: #16281a;
      transform: translateY(-3px);
    }

    .btn-primary-two {
      background: #7c4fa3;
    }

    .btn-secondary {
      background: transparent;
      color: #fff;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover {
      border-color: #fff;
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-3px);
    }

    .btn-light {
      background: rgba(255, 255, 255, 0.14);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
    }

    .btn-light:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    }

    .btn-icon {
      font-size: 1rem;
    }

    html {
      scroll-padding-top: calc(var(--site-header-offset, 92px) + var(--section-nav-height, 52px) + 20px);
    }

    .section-nav {
      position: sticky;
      top: var(--site-header-offset, 80px);
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

    .section-nav a:hover,
    .section-nav a.active {
      color: #26432b;
      border-bottom-color: #c89b3c;
    }

    .pilot-section,
    .challenge-section,
    .jkuat-section,
    .activity-section,
    .funding-section {
      padding: 80px 0;
      scroll-margin-top: calc(var(--site-header-offset, 92px) + var(--section-nav-height, 52px) + 18px);
    }

    .pilot-section {
      background: #f7f2e6;
    }

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

    .section-header p {
      font-size: 1.05rem;
      color: #6e7767;
      margin-top: 14px;
      font-weight: 400;
    }

    .pilot-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: center;
    }

    .pilot-card {
      flex: 1 1 220px;
      max-width: 280px;
      min-width: 200px;
      background: #fffdf7;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid #e1d8c0;
      transition: all 0.4s ease;
    }

    .pilot-card:hover {
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12);
      border-color: #7c4fa3;
      transform: translateY(-4px);
    }

    .pilot-image {
      overflow: hidden;
      background: #16281a;
      height: 220px;
    }

    .pilot-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .pilot-card:hover .pilot-image img {
      transform: scale(1.04);
    }

    .pilot-body {
      padding: 20px 22px 24px;
    }

    .pilot-title {
      display: block;
      font-size: 1.1rem;
      font-weight: 700;
      color: #17241b;
      margin-bottom: 2px;
    }

    .pilot-country {
      font-size: 0.75rem;
      font-weight: 600;
      color: #5b3878;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: block;
      margin-bottom: 8px;
    }

    .pilot-country i {
      margin-right: 4px;
    }

    .pilot-body p {
      font-size: 0.85rem;
      color: #6e7767;
      line-height: 1.6;
      margin: 0;
    }

    .challenge-section {
      background: #efe6ce;
    }

    .challenge-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 48px;
      align-items: center;
    }

    .challenge-text {
      flex: 1 1 55%;
      text-align: center;
    }

    .challenge-text h2 {
      font-size: 2.6rem;
      font-weight: 800;
      color: #17241b;
      line-height: 1.08;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }

    .challenge-text p {
      font-size: 1.02rem;
      color: #2d3d35;
      line-height: 1.8;
      margin-bottom: 14px;
      max-width: 620px;
      margin-left: auto;
      margin-right: auto;
    }

    .challenge-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 32px;
      justify-content: center;
      margin-top: 20px;
    }

    .challenge-stat {
      text-align: center;
    }

    .challenge-stat .stat-number {
      font-size: 2.2rem;
      font-weight: 800;
      color: #26432b;
      display: block;
      line-height: 1.1;
    }

    .challenge-stat .stat-label {
      font-size: 0.8rem;
      color: #6e7767;
      font-weight: 500;
      margin-top: 2px;
    }

    .challenge-image {
      flex: 1 1 35%;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12);
      min-height: 280px;
      background: #16281a;
    }

    .challenge-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      min-height: 280px;
    }

    .jkuat-section {
      background: #f7f2e6;
    }

    .jkuat-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
    }

    .jkuat-card {
      flex: 1 1 calc(50% - 15px);
      min-width: 280px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      transition: all 0.4s ease;
      background: #fffdf7;
      border: 1px solid #e1d8c0;
    }

    .jkuat-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12);
      border-color: #7c4fa3;
    }

    .card-image {
      height: 200px;
      overflow: hidden;
      background: #16281a;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .jkuat-card:hover .card-image img {
      transform: scale(1.05);
    }

    .card-body {
      padding: 28px 30px;
    }

    .card-badge {
      display: inline-block;
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
      background: #26432b;
      padding: 3px 14px;
      border-radius: 50px;
      margin-bottom: 10px;
    }

    .card-body h3 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #17241b;
      margin-bottom: 8px;
    }

    .card-body p {
      font-size: 0.92rem;
      color: #6e7767;
      line-height: 1.7;
      margin-bottom: 14px;
    }

    .card-link {
      color: #26432b;
      font-weight: 600;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .card-link:hover {
      color: #5b3878;
      gap: 14px;
    }

    .counters-section {
      padding: 80px 0;
      background: #16281a;
      position: relative;
      overflow: hidden;
    }

    .counters-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(247, 242, 230, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(247, 242, 230, 0.04) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
    }

    .counters-header {
      max-width: 100%;
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }

    .counters-header h2 {
      color: #fff;
    }

    .counters-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 1px;
      background: rgba(247, 242, 230, 0.14);
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      z-index: 1;
    }

    .counter-item {
      flex: 1 1 calc(16.666% - 1px);
      min-width: 120px;
      background: #16281a;
      padding: 28px 20px;
      text-align: center;
    }

    .counter-number {
      font-size: 2.4rem;
      font-weight: 700;
      color: #fff;
      display: block;
      line-height: 1.1;
      letter-spacing: -1px;
    }

    .counter-suffix {
      font-size: 1.4rem;
      font-weight: 500;
      color: #c89be8;
    }

    .counter-label {
      color: rgba(247, 242, 230, 0.55);
      font-size: 0.72rem;
      font-weight: 500;
      margin-top: 6px;
      display: block;
    }

    .activity-section {
      background: #f7f2e6;
    }

    .activity-section .section-header {
      display: block;
      max-width: 100%;
      margin-bottom: 36px;
    }

    .activity-section .section-header h2 {
      font-size: 2.4rem;
      margin-bottom: 12px;
    }

    .activity-section .section-header p {
      font-size: 1.05rem;
      margin: 0 auto;
    }

    .activity-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 56px;
    }

    .activity-col {
      flex: 1 1 calc(50% - 28px);
      min-width: 280px;
    }

    .col-heading {
      margin-bottom: 26px;
      text-align: center;
    }

    .col-heading h2 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #17241b;
      margin-top: 4px;
    }

    .col-heading .accent {
      color: #26432b;
      font-weight: 700;
    }

    .activity-item {
      display: flex;
      gap: 18px;
      padding: 20px 0;
      border-bottom: 1px solid #e1d8c0;
      align-items: flex-start;
      transition: all 0.3s ease;
    }

    .activity-item:first-child {
      padding-top: 0;
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-item:hover {
      padding-left: 6px;
    }

    .activity-img {
      width: 76px;
      height: 76px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      background: #efe6ce;
    }

    .activity-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: #fff;
      background: #26432b;
    }

    .activity-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 4px;
    }

    .date {
      font-size: 0.68rem;
      color: #6e7767;
      font-weight: 500;
    }

    .tag {
      display: inline-block;
      background: rgba(124, 79, 163, 0.09);
      color: #5b3878;
      padding: 2px 10px;
      border-radius: 4px;
      font-size: 0.58rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .activity-copy h4 {
      font-size: 1.02rem;
      font-weight: 700;
      color: #17241b;
      margin-bottom: 3px;
    }

    .activity-copy p {
      color: #6e7767;
      font-size: 0.85rem;
      line-height: 1.6;
      margin: 0;
    }

    .event-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 15px 18px;
      background: #fffdf7;
      border-radius: 16px;
      margin-bottom: 12px;
      transition: all 0.3s ease;
      border: 1px solid #e1d8c0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }

    .event-item:hover {
      border-color: #7c4fa3;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
      transform: translateX(4px);
    }

    .event-date {
      text-align: center;
      background: #26432b;
      color: #fff;
      padding: 7px 12px;
      border-radius: 8px;
      min-width: 50px;
      flex-shrink: 0;
    }

    .event-date .day {
      font-size: 1.05rem;
      font-weight: 700;
      display: block;
      line-height: 1.1;
    }

    .event-date .month {
      font-size: 0.5rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: block;
    }

    .event-info {
      flex: 1;
    }

    .event-info h5 {
      font-size: 0.94rem;
      font-weight: 700;
      color: #17241b;
      margin: 0;
    }

    .event-info p {
      color: #6e7767;
      font-size: 0.78rem;
      margin: 0;
    }

    .event-status {
      font-size: 0.56rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 4px 14px;
      border-radius: 50px;
      background: #3e6b45;
      color: #fff;
      flex-shrink: 0;
      text-transform: uppercase;
    }

    .event-status.soon {
      background: #be5a2b;
    }

    .view-all-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 18px;
      color: #26432b;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .view-all-link:hover {
      gap: 12px;
      color: #5b3878;
    }

    .cta-section {
      position: relative;
      padding: 80px 0;
      background: linear-gradient(135deg, #16281a, #26432b);
      overflow: hidden;
      text-align: center;
    }

    .cta-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1600&q=80') center/cover no-repeat;
      opacity: 0.06;
      pointer-events: none;
    }

    .cta-section .container {
      position: relative;
      z-index: 1;
    }

    .cta-section h2 {
      font-size: 2.6rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 12px;
    }

    .cta-section p {
      font-size: 1.05rem;
      color: rgba(247, 242, 230, 0.7);
      max-width: 520px;
      margin: 0 auto 32px;
    }

    .cta-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .funding-section {
      padding-top: 32px;
      padding-bottom: 72px;
    }

    @media (max-width: 1024px) {
      .hero-content h1 {
        font-size: 2.8rem;
      }

      .section-header h2 {
        font-size: 2.2rem;
      }

      .challenge-text h2 {
        font-size: 2.2rem;
      }

      .challenge-stats {
        gap: 24px;
      }

      .challenge-stat .stat-number {
        font-size: 1.8rem;
      }

      .counter-item {
        flex: 1 1 calc(33.333% - 1px);
      }

      .cta-section h2 {
        font-size: 2.2rem;
      }

      .jkuat-card {
        flex: 1 1 calc(50% - 15px);
      }

      .pilot-card {
        flex: 1 1 calc(50% - 15px);
        max-width: none;
      }

      .challenge-wrapper {
        flex-direction: column;
      }

      .challenge-image {
        flex: 1 1 100%;
        min-height: 200px;
      }
    }

    @media (max-width: 768px) {
      :host {
        padding-top: 0;
      }

      .section-nav a {
        padding: 10px 14px;
        font-size: 0.6rem;
      }

      .hero {
        min-height: 100vh;
        height: 100vh;
      }

      .hero-content-wrapper {
        padding: 40px 24px;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hero-content h1 {
        font-size: 2.2rem;
      }

      .hero-sub {
        font-size: 1rem;
      }

      .hero-highlight-title {
        font-size: 2.1rem;
      }

      .hero-description {
        font-size: 0.92rem;
      }

      .hero-buttons {
        flex-direction: column;
        width: 100%;
      }

      .hero-buttons .btn-primary,
      .hero-buttons .btn-secondary {
        width: 100%;
        justify-content: center;
      }

      .section-header h2 {
        font-size: 1.8rem;
      }

      .section-header p {
        font-size: 0.95rem;
      }

      .challenge-section,
      .pilot-section,
      .jkuat-section,
      .activity-section,
      .cta-section {
        padding: 60px 0;
      }

      .challenge-text h2 {
        font-size: 1.8rem;
      }

      .challenge-text p {
        max-width: 100%;
      }

      .pilot-card {
        flex: 1 1 100%;
        max-width: 360px;
      }

      .jkuat-card {
        flex: 1 1 100%;
      }

      .counter-item {
        flex: 1 1 calc(50% - 1px);
        padding: 20px 16px;
      }

      .counter-number {
        font-size: 1.8rem;
      }

      .activity-grid {
        flex-direction: column;
        gap: 44px;
      }

      .activity-col {
        flex: 1 1 100%;
      }

      .activity-item {
        flex-direction: column;
        gap: 12px;
      }

      .activity-img {
        width: 100%;
        height: 150px;
      }

      .event-item {
        flex-wrap: wrap;
      }

      .event-status {
        width: 100%;
        text-align: center;
      }

      .cta-section {
        padding: 60px 0;
      }

      .cta-section h2 {
        font-size: 1.8rem;
      }

      .cta-buttons {
        flex-direction: column;
        width: 100%;
      }

      .cta-buttons .btn-primary,
      .cta-buttons .btn-light {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 16px;
      }

      .hero-content h1 {
        font-size: 1.8rem;
      }

      .hero-sub {
        font-size: 0.9rem;
      }

      .hero-description {
        font-size: 0.85rem;
      }

      .section-header h2 {
        font-size: 1.5rem;
      }

      .challenge-text h2 {
        font-size: 1.5rem;
      }

      .cta-section h2 {
        font-size: 1.5rem;
      }

      .card-body {
        padding: 20px;
      }

      .pilot-body {
        padding: 16px 18px 20px;
      }

      .hero-content-wrapper {
        padding: 30px 20px;
      }

      .btn-primary,
      .btn-secondary,
      .btn-light {
        padding: 12px 16px;
        font-size: 0.85rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  protected heroTitle = APP.ACRONYM + ' Kenya at JKUAT';
  protected heroDescription = APP.DESCRIPTION;
  protected grantNumber = FUNDING.GRANT_AGREEMENT;

  protected latestActivities = signal<Activity[]>([]);
  protected upcomingEvents = signal<Event[]>([]);
  protected activitiesCount: number = 0;
  protected eventsCount: number = 0;
  protected partnersCount: number = 12;
  protected resourcesCount: number = 0;

  constructor(
    private activityService: ActivityService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.syncStickyOffset();
    window.addEventListener('resize', this.syncStickyOffset.bind(this));
    window.addEventListener('scroll', this.syncStickyOffset.bind(this), { passive: true });
    window.addEventListener('load', this.syncStickyOffset.bind(this));
    this.bindSectionNavigation();
  }

  private syncStickyOffset(): void {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const nav = document.querySelector('.section-nav') as HTMLElement | null;
    const headerHeight = header ? header.offsetHeight : 92;
    const navHeight = nav ? nav.offsetHeight : 52;

    document.documentElement.style.setProperty('--site-header-offset', `${headerHeight}px`);
    document.documentElement.style.setProperty('--section-nav-height', `${navHeight}px`);
    document.documentElement.style.setProperty('scroll-padding-top', `${headerHeight + navHeight + 20}px`);
  }

  private bindSectionNavigation(): void {
    const navLinks = Array.from(document.querySelectorAll('.section-nav a')) as HTMLAnchorElement[];
    const sections = navLinks
      .map((link) => document.getElementById(link.getAttribute('data-section') || ''))
      .filter((section): section is HTMLElement => !!section);

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
        const nav = document.querySelector('.section-nav') as HTMLElement | null;
        const headerHeight = header ? header.offsetHeight : 0;
        const navHeight = nav ? nav.offsetHeight : 0;
        const offset = headerHeight + navHeight + 18;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      });
    });

    if (!sections.length || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
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
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
  }

  private loadData(): void {
    this.activityService.getActivities().subscribe({
      next: (activities) => {
        const published = activities.filter(a => a.evidence_status === 'published');
        this.activitiesCount = published.length;
        this.latestActivities.set(published.slice(0, 3));
      },
      error: () => {
        this.latestActivities.set([]);
      }
    });

    this.eventService.getEvents().subscribe({
      next: (events) => {
        const upcoming = events.filter(e => e.status === 'upcoming');
        this.eventsCount = events.length;
        this.upcomingEvents.set(upcoming.slice(0, 3));
      },
      error: () => {
        this.upcomingEvents.set([]);
      }
    });

    this.resourcesCount = 0;
  }
}