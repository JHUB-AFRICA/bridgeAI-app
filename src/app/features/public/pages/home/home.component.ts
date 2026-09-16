// ============================================================
// BRIDGE-AI - Home Component
// ============================================================

import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivityService } from '../../../../services/activity.service';
import { EventService } from '../../../../services/event.service';
import { Activity } from '../../../core/models/activity.model';
import { Event } from '../../../core/models/event.model';
import { APP } from '../../../core/constants/app.constants';
import { CloudinaryService } from '../../../core/services/cloudinary.service';

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
          <div class="hero-slide-bg active" [style.backgroundImage]="'url(' + activeHeroImage() + ')'" aria-hidden="true"></div>
        </div>

        <div class="hero-content-wrapper">
          <div class="hero-content">
            <h1>
              Smart Mushroom
            </h1>

            <p class="hero-sub">
              Revolutionize your mushroom farming experience
            </p>

            <h2 class="hero-highlight-title">
              <span class="highlight">Smarter growing.</span> Better decisions.
            </h2>

            <p class="hero-description">
              Leveraging IoT and machine learning to provide smart solutions for mushroom farmers. Monitor and control your farm from anywhere in the world.
            </p>

          </div>
        </div>
      </section>

      <nav class="section-nav" aria-label="Page sections">
        <div class="section-nav-inner">
          <a href="#pilot-regions" data-section="pilot-regions" class="active">Mushroom varieties</a>
          <a href="#challenge" data-section="challenge">Smartmushroom Solution</a>
          <a href="#latest" data-section="latest">latest News</a>
          <a href="#impact" data-section="impact">smartmushroom tracking</a>
          <a href="#connect" data-section="connect">Connect</a>
        </div>
      </nav>

      <section class="pilot-section" id="pilot-regions">
        <div class="container">
          <div class="section-header">
            <h2>Mushroom <span class="highlight">Varieties</span></h2>
            <p>Explore mushroom varieties grown for food, wellness and strong market opportunities.</p>
          </div>
          <div class="varieties-grid">
            <article class="variety-card variety-card-featured">
              <img src="/images/smartmushrooms/button.jpeg" alt="Button mushrooms" loading="lazy" />
              <div class="variety-card-content">
                <span class="variety-number">01 / EVERYDAY FAVOURITE</span>
                <h3>Button Mushroom</h3>
                <p>Button mushrooms are a popular everyday variety with a mild taste, smooth texture and strong demand in the food market.</p>
              </div>
              <div class="variety-card-footer"><span>Market price</span><strong>800 Ksh / kg</strong></div>
            </article>
            <article class="variety-card">
              <img src="/images/smartmushrooms/oyster.jpeg" alt="Oyster mushrooms growing in clusters" loading="lazy" />
              <div class="variety-card-content">
                <span class="variety-number">02 / POPULAR &amp; VERSATILE</span>
                <h3>Oyster Mushroom</h3>
                <p>Oyster mushrooms grow in clusters and are valued for their delicate flavour, quick production cycles and versatility in cooking.</p>
              </div>
              <div class="variety-card-footer"><span>Market price</span><strong>400 Ksh / kg</strong></div>
            </article>
            <article class="variety-card">
              <img src="/images/smartmushrooms/reishi.jpeg" alt="Reishi mushrooms" loading="lazy" />
              <div class="variety-card-content">
                <span class="variety-number">03 / WELLNESS MARKET</span>
                <h3>Reishi Mushroom</h3>
                <p>Reishi is a medicinal variety known for its distinctive form and traditional wellness uses, creating opportunities beyond fresh produce.</p>
              </div>
              <div class="variety-card-footer"><span>Market price</span><strong>1000 Ksh / kg</strong></div>
            </article>
          </div>
        </div>
      </section>

      <section class="challenge-section" id="challenge">
        <div class="container">
          <div class="challenge-wrapper">
            <div class="challenge-text">
              <span class="solutions-kicker">Smart Mushroom technology</span>
              <h2>Our <span class="highlight">Smart Solutions</span></h2>
              <p>Our IoT and machine learning solutions help you monitor and control your mushroom farm from anywhere in the world.</p>
              <div class="solutions-list">
                <article class="solution-item">
                  <span class="solution-index">01</span>
                  <div><h3>Sensor networks</h3><p>Track temperature, humidity, CO₂ and substrate moisture in real time.</p></div>
                </article>
                <article class="solution-item">
                  <span class="solution-index">02</span>
                  <div><h3>Connected data</h3><p>Transmit readings wirelessly to a central hub or cloud platform.</p></div>
                </article>
                <article class="solution-item">
                  <span class="solution-index">03</span>
                  <div><h3>Remote monitoring</h3><p>Check your farm from a phone, tablet or computer wherever you are.</p></div>
                </article>
                <article class="solution-item">
                  <span class="solution-index">04</span>
                  <div><h3>Smart automation</h3><p>Trigger misters and other actions automatically when conditions change.</p></div>
                </article>
              </div>

            </div>

            <div class="challenge-image">
              <img src="/images/smartmushrooms/iott.jpeg" alt="IoT technology supporting Smart Mushroom farm monitoring" loading="lazy">
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
                <a class="activity-item" *ngFor="let activity of latestActivities() | slice:0:3" [routerLink]="['/activities', activity.slug || activity.id]" [attr.aria-label]="'Open activity: ' + activity.title">
                  <div class="activity-img">
                    <img [src]="activity.featured_image || heroFallbackImage()" [alt]="activity.title" loading="lazy">
                  </div>
                  <div class="activity-copy">
                    <div class="activity-meta">
                      <span class="date">{{ activity.date || 'Coming Soon' }}</span>
                      <span class="tag" *ngIf="activity.wp_tag">{{ activity.wp_tag }}</span>
                    </div>
                    <h4>{{ activity.title }}</h4>
                  </div>
                </a>
              </ng-container>

              <ng-template #activityFallback>
                <div class="activity-item">
                  <div class="activity-img"><div class="placeholder">UPD</div></div>
                  <div class="activity-copy">
                    <div class="activity-meta"><span class="date">Coming Soon</span></div>
                    <h4>Activities Loading</h4>
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
                <a class="event-item" *ngFor="let event of upcomingEvents() | slice:0:3" [routerLink]="['/training-events', event.slug || event.id]" [attr.aria-label]="'Open training event: ' + event.title">
                  <div class="event-date">
                    <span class="day">{{ event.date ? event.date.slice(8,10) : 'TBA' }}</span>
                    <span class="month">{{ event.date ? event.date.slice(5,7) : 'TBA' }}</span>
                  </div>
                  <div class="event-info">
                    <h5>{{ event.title }}</h5>
                    <p>{{ event.location || 'Location TBD' }}</p>
                  </div>
                  <span class="event-status">{{ event.status || 'Upcoming' }}</span>
                </a>
              </ng-container>

              <ng-template #eventFallback>
                <div class="event-item">
                  <div class="event-date"><span class="day">TBA</span><span class="month">TBA</span></div>
                  <div class="event-info"><h5>Farmer training coming soon</h5><p>JKUAT Smart Farm Zone · Kenya</p></div>
                  <span class="event-status soon">Coming Soon</span>
                </div>
              </ng-template>

                <a [routerLink]="['/training-events']" class="view-all-link">View all training <i class="fas fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </section>

      <section class="impact-section" id="impact">
        <div class="container">
          <div class="section-header">
            <h2>Smart Mushroom <span class="highlight">Tracking</span></h2>
            <p>Machine learning turns farm data into clearer decisions, healthier crops and more consistent growing conditions.</p>
          </div>
          <div class="impact-grid">
            <article>
              <span class="impact-index">01 · DATA ANALYSIS</span>
              <strong>Learn from every reading</strong>
              <span>Machine learning studies sensor data over time to reveal patterns in temperature, humidity, CO₂ and moisture.</span>
            </article>
            <article>
              <span class="impact-index">02 · PREDICTIVE CARE</span>
              <strong>Act before problems grow</strong>
              <span>Historical readings can help flag disease risk, equipment faults and changing crop conditions early.</span>
            </article>
            <article>
              <span class="impact-index">03 · OPTIMIZED CONDITIONS</span>
              <strong>Fine-tune the room</strong>
              <span>Past successful crops guide the right temperature, humidity and CO₂ balance for better yield and quality.</span>
            </article>
            <article>
              <span class="impact-index">04 · PUMICE FOUNDATION</span>
              <strong>Start with the right walls</strong>
              <span>Sealed pumice walls help create a clean, insulated growing room where sensors can measure and automation can respond.</span>
            </article>
            <article>
              <span class="impact-index">05 · PROTOTYPE STAGE</span>
              <strong>Explore mushroom classification</strong>
              <span>Image-based models are being explored to distinguish mushroom varieties, with identification still under development.</span>
            </article>
          </div>
        </div>
      </section>

      <section class="cta-section" id="connect">
        <div class="container">
          <h2>Stay Connected</h2>
          <p>Follow our journey and be a part of the Smartmushroom community.</p>
          <div class="cta-buttons">
            <a [routerLink]="['/contact']" class="btn-primary btn-primary-two">
              <i class="fas fa-envelope btn-icon"></i>
              Contact Us
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
      overflow-x: clip;
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
      opacity: 0.72;
      filter: saturate(0.9);
      transform: translate3d(0, var(--hero-parallax, 0px), 0) scale(1.08);
      transition: background-image 1.8s ease, opacity 1.8s ease, transform 0.08s linear;
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
      margin: 0;
      font-size: clamp(2rem, 4vw, 2.8rem);
      font-weight: 800;
      color: #17241b;
      line-height: 1.08;
      letter-spacing: 0;
    }

    .section-header p {
      max-width: 620px;
      margin: 16px auto 0;
      font-size: 1rem;
      color: #43534a;
      line-height: 1.65;
      font-weight: 400;
    }

    .varieties-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(260px, .85fr);
      grid-template-rows: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }

    .variety-card {
      display: flex;
      min-height: 250px;
      flex-direction: column;
      padding: 18px;
      border: 1px solid #e2e5d8;
      border-radius: 14px;
      background: #fffdf7;
      color: #24352e;
      text-decoration: none;
      box-shadow: 0 14px 30px rgba(22, 40, 26, .12);
      transition: transform .25s ease, box-shadow .25s ease;
    }

    .variety-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 22px 42px rgba(22, 40, 26, .2);
      border-color: #aeb879;
    }

    .variety-card-featured { grid-row: span 2; min-height: 520px; padding: 22px; }
    .variety-card img { order: 0; width: 100%; height: 150px; margin: 0 0 18px; border-radius: 9px; object-fit: cover; }
    .variety-card-featured img { flex: 1; min-height: 290px; height: auto; margin-bottom: 22px; }
    .variety-card-content { order: 1; }
    .variety-number { display: block; margin-bottom: 9px; color: #59600f; font-size: .63rem; font-weight: 800; letter-spacing: .1em; line-height: 1.35; }
    .variety-card h3 { margin: 0 0 10px; color: #17241b; font-size: 1.25rem; font-weight: 800; line-height: 1.25; }
    .variety-card p { margin: 0; color: #43534a; font-size: .86rem; line-height: 1.65; }
    .variety-card-footer { order: 2; display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 18px; color: #43534a; font-size: .75rem; font-weight: 700; }
    .variety-card-footer strong { padding: 8px 14px; border-radius: 999px; background: #dce68a; color: #17241b; font-size: .7rem; font-weight: 800; white-space: nowrap; }

    .impact-section { padding: 80px 0; background: #16281a; }
    .impact-section .section-header h2 { color: #fff; }
    .impact-section .section-header p { color: rgba(247, 242, 230, .7); }
    .impact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(247, 242, 230, .16); }
    .impact-grid article { min-height: 190px; padding: 30px; text-align: left; background: #16281a; }
    .impact-index { display: block; margin-bottom: 22px; color: #d8e86b; font: 600 .64rem 'IBM Plex Mono', monospace; letter-spacing: .12em; }
    .impact-grid strong { display: block; color: #fff; font-size: 1.45rem; line-height: 1.2; }
    .impact-grid article > span:last-child { display: block; max-width: 270px; margin-top: 10px; color: rgba(247, 242, 230, .66); font-size: .82rem; line-height: 1.6; }

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
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(300px, .9fr);
      gap: 52px;
      align-items: center;
    }

    .challenge-text {
      min-width: 0;
      text-align: left;
    }

    .solutions-kicker { display: block; margin-bottom: 10px; color: #818528; font-size: .68rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }

    .challenge-text h2 {
      font-size: 2.6rem;
      font-weight: 800;
      color: #17241b;
      line-height: 1.08;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }

    .challenge-text p {
      max-width: 600px;
      margin: 0 0 22px;
      font-size: 1rem;
      color: #43534a;
      line-height: 1.65;
    }

    .solutions-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 24px; }
    .solution-item { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 10px; padding-top: 13px; border-top: 1px solid #d7ddc8; }
    .solution-index { color: #818528; font-size: .65rem; font-weight: 800; letter-spacing: .08em; }
    .solution-item h3 { margin: 0 0 4px; color: #17241b; font-size: .94rem; font-weight: 800; }
    .solution-item p { margin: 0; color: #59685f; font-size: .78rem; line-height: 1.5; }

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
      min-width: 0;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12);
      min-height: 420px;
      background: #dfe6d4;
    }

    .challenge-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      min-height: 420px;
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
      display: grid;
      grid-template-columns: 180px minmax(0, 1fr);
      gap: 22px;
      padding: 22px 0;
      border-bottom: 1px solid #e1d8c0;
      align-items: flex-start;
      transition: all 0.3s ease;
      color: inherit;
      text-decoration: none;
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
      width: 100%;
      height: 132px;
      border-radius: 14px;
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
      font-size: 1.14rem;
      font-weight: 700;
      color: #17241b;
      margin: 0 0 5px;
      line-height: 1.35;
    }

    .activity-copy p { display: none; }

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

    .event-item:focus-visible,
    .activity-item:focus-visible {
      outline: 3px solid #c89b3c;
      outline-offset: 4px;
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
        grid-template-columns: 1fr;
      }

      .challenge-image {
        min-height: 200px;
      }

      .challenge-image img {
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

      .varieties-grid {
        grid-template-columns: 1fr;
        grid-template-rows: none;
        max-width: 420px;
        margin: 0 auto;
      }

      .variety-card-featured {
        grid-row: auto;
        min-height: 390px;
      }

      .variety-card-featured img {
        height: 210px;
      }

      .impact-grid {
        grid-template-columns: 1fr;
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

      .solutions-list {
        grid-template-columns: 1fr;
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
        grid-template-columns: 1fr;
        gap: 14px;
      }

      .activity-img {
        width: 100%;
        height: 180px;
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
      .hero-slide-bg { transform: none; transition: none; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  protected readonly heroImages = signal<string[]>([]);
  protected readonly heroIndex = signal(0);
  protected readonly activeHeroImage = computed(() => this.heroImages()[this.heroIndex()] || '');
  protected readonly heroFallbackImage = computed(() => this.heroImages()[0] || '');
  private rotation?: ReturnType<typeof setInterval>;
  private readonly handleResize = (): void => this.syncStickyOffset();
  private readonly handleScroll = (): void => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hero = document.querySelector('.hero') as HTMLElement | null;
    if (hero) hero.style.setProperty('--hero-parallax', `${Math.min(window.scrollY * 0.16, 120)}px`);
  };
  protected heroTitle = APP.ACRONYM;
  protected heroDescription = APP.DESCRIPTION;
  protected latestActivities = signal<Activity[]>([]);
  protected upcomingEvents = signal<Event[]>([]);
  protected activitiesCount: number = 0;
  protected eventsCount: number = 0;
  protected partnersCount: number = 12;
  protected resourcesCount: number = 0;

  constructor(
    private activityService: ActivityService,
    private eventService: EventService,
    private cloudinaryService: CloudinaryService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadHeroImages();
    this.syncStickyOffset();
    this.rotation = setInterval(() => {
      const imageCount = this.heroImages().length;
      if (imageCount > 0) {
        this.heroIndex.update(index => (index + 1) % imageCount);
      }
    }, 8000);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('load', this.handleResize);
    this.bindSectionNavigation();
  }

  ngOnDestroy(): void {
    if (this.rotation) clearInterval(this.rotation);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('load', this.handleResize);
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

  private preloadImages(): void {
    this.heroImages().slice(0, 3).forEach(source => {
      const image = new Image();
      image.decoding = 'async';
      image.src = source;
    });
  }

  private loadHeroImages(): void {
    this.cloudinaryService.getActivityImages().subscribe({
      next: (images) => {
        const sources = images
          .map(image => image.secure_url)
          .filter(image => image.includes('/bridge-ai/activities/'));
        this.heroImages.set(sources);
        this.heroIndex.set(0);
        this.preloadImages();
      },
      error: () => {
        this.heroImages.set([]);
      }
    });
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