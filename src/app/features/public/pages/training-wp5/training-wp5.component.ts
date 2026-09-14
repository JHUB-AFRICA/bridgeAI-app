// ============================================================
// BRIDGE-AI - Training WP5 Component
// ============================================================

import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-training-wp5',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main class="training-wp5-page">
      <section class="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-bg hero-bg-alt"></div>
        <div class="hero-overlay"></div>
        <div class="hero-grid-pattern"></div>
        <div class="hero-glow"></div>
        <div class="hero-diagonal-line"></div>
        <div class="hero-accent-line"></div>

        <div class="hero-container">
          <nav class="hero-breadcrumb" aria-label="Breadcrumb">
            <a [routerLink]="['/']">Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Training &amp; WP5</span>
          </nav>

          <div class="hero-grid">
            <div class="hero-content">
              <h1 class="hero-title">
                Capacity Building<br>
                <span class="gold">and Replication</span>
              </h1>
              <p class="hero-subtitle">BRIDGE-AI consortium capacity building across Africa</p>
              <p class="hero-desc">
                BRIDGE-AI strengthens skills, supports SMEs, connects communities and scales GenAI solutions
                for agriculture across Nigeria, Kenya and Tunisia.
              </p>
            </div>
          </div>
        </div>

        <div class="hero-scroll">
          <span class="scroll-line"></span>
          <span class="scroll-text">Scroll</span>
        </div>
      </section>

      <nav class="section-nav" aria-label="Page sections">
        <div class="section-nav-inner">
          <a href="#overview" data-section="overview" class="active" (click)="scrollToSection($event, 'overview')">Overview</a>
          <a href="#skills" data-section="skills" (click)="scrollToSection($event, 'skills')">BRIDGE-AI Learning</a>
          <a href="#smes" data-section="smes" (click)="scrollToSection($event, 'smes')">Ecosystem</a>
          <a href="#replication" data-section="replication" (click)="scrollToSection($event, 'replication')">Scale-Up</a>
        </div>
      </nav>

      <section class="intro-section" id="overview">
        <div class="page-container">
          <div class="intro-grid">
            <div class="intro-text">
              <span class="intro-label">About WP5</span>
              <h2>Building practical capacity for <span class="gold">digital agriculture</span></h2>
              <p>
                Work Package 5 supports a coordinated effort to train communities, strengthen local expertise
                and prepare African agricultural stakeholders to adopt AI-driven solutions with confidence.
              </p>
              <p style="margin-bottom:0;">
                Through BRIDGE-AI, partners across the consortium share knowledge, tools and experience to help
                translate innovation into real impact on farms, value chains and businesses.
              </p>
            </div>
            <div class="intro-stats">
              <a [routerLink]="['/partners']" class="intro-stat">
                <span class="stat-number">Across Africa</span>
                <span class="stat-label">Countries</span>
                <span class="card-arrow" aria-hidden="true">→</span>
              </a>
              <a [routerLink]="['/training-events']" class="intro-stat">
                <span class="stat-number">Training Events</span>
                <span class="stat-label">Learning</span>
                <span class="card-arrow" aria-hidden="true">→</span>
              </a>
              <a [routerLink]="['/sme-mentoring']" class="intro-stat">
                <span class="stat-number">SME Support</span>
                <span class="stat-label">Mentoring</span>
                <span class="card-arrow" aria-hidden="true">→</span>
              </a>
              <a [routerLink]="['/about']" class="intro-stat">
                <span class="stat-number">Shared Vision</span>
                <span class="stat-label">Partnership</span>
                <span class="card-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-section" id="skills">
        <div class="page-container">
          <div class="feature-grid">
            <div class="feature-image">
              <img src="/images/webimages/consortium.jpeg" alt="BRIDGE-AI consortium partners" loading="lazy">
              <div class="image-overlay-text">Skills development across the consortium</div>
            </div>
            <div class="feature-content">
              <span class="feature-label">BRIDGE-AI Learning</span>
              <h3>Capability building for <span class="gold">real impact</span></h3>
              <p class="feature-desc">
                BRIDGE-AI delivers hands-on learning for farmers, youth, researchers and local innovators, helping
                them apply AI and digital tools to agriculture in practical, context-specific ways.
              </p>
              <div class="feature-stats">
                <a [routerLink]="['/training-events']" class="feature-stat">
                  <span class="stat-number">Training Events</span>
                  <span class="stat-label">Hands-on learning</span>
                  <span class="card-arrow" aria-hidden="true">→</span>
                </a>
                <a [routerLink]="['/partners']" class="feature-stat">
                  <span class="stat-number">Country Reach</span>
                  <span class="stat-label">Nigeria · Kenya · Tunisia</span>
                  <span class="card-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-section" id="smes">
        <div class="page-container">
          <div class="feature-grid reverse">
            <div class="feature-image">
              <img src="/images/webimages/about.jpeg" alt="BRIDGE-AI agriculture stakeholders" loading="lazy">
              <div class="image-overlay-text">Supporting SMEs and innovation ecosystems</div>
            </div>
            <div class="feature-content">
              <span class="feature-label">BRIDGE-AI Ecosystem</span>
              <h3>Mentoring for <span class="gold">enterprise growth</span></h3>
              <p class="feature-desc">
                We support agricultural SMEs and startups with mentoring, collaborative learning and growth pathways
                that turn innovative ideas into scalable, locally relevant solutions.
              </p>
              <div class="feature-stats">
                <a [routerLink]="['/sme-mentoring']" class="feature-stat">
                  <span class="stat-number">SME Support</span>
                  <span class="stat-label">Growth and innovation</span>
                  <span class="card-arrow" aria-hidden="true">→</span>
                </a>
                <a [routerLink]="['/community-practice']" class="feature-stat">
                  <span class="stat-number">Community</span>
                  <span class="stat-label">Collaboration and mentoring</span>
                  <span class="card-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-section" id="replication">
        <div class="page-container">
          <div class="feature-grid">
            <div class="feature-image">
              <img src="/images/webimages/maize.png" alt="Agricultural innovation replication" loading="lazy">
              <div class="image-overlay-text">Scaling proven solutions across communities</div>
            </div>
            <div class="feature-content">
              <span class="feature-label">BRIDGE-AI Scale-Up</span>
              <h3>Scaling proven models for <span class="gold">African agriculture</span></h3>
              <p class="feature-desc">
                BRIDGE-AI captures lessons, tools and templates to help successful pilots and models move from one
                context to another, accelerating adoption and long-term impact.
              </p>
              <div class="feature-stats">
                <a [routerLink]="['/resources']" class="feature-stat">
                  <span class="stat-number">Resources</span>
                  <span class="stat-label">Templates and guides</span>
                  <span class="card-arrow" aria-hidden="true">→</span>
                </a>
                <a [routerLink]="['/replication-toolkit']" class="feature-stat">
                  <span class="stat-number">Replication</span>
                  <span class="stat-label">Playbooks and scale-up tools</span>
                  <span class="card-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="register-section" id="get-involved">
        <div class="page-container">
          <div class="register-grid">
            <div class="register-text">
              <span class="register-label">BRIDGE-AI</span>
              <h2>Capacity building with <span class="gold">lasting impact</span></h2>
              <p>
                By building skills, supporting entrepreneurs and strengthening collaboration, BRIDGE-AI helps create
                resilient digital agriculture ecosystems across Africa.
              </p>
            </div>
            <div class="register-image">
              <img src="/images/webimages/Pasture.png" alt="BRIDGE-AI agricultural collaboration" loading="lazy">
              <div class="overlay">
                <div>
                  <div class="icon">✦</div>
                  <span>Building Africa's AI-enabled agriculture future</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }

    .training-wp5-page {
      --primary-dark: #061420;
      --primary: #0F2B3D;
      --primary-light: #1A4A6B;
      --primary-lighter: #2A6A8B;
      --gold: #D4A843;
      --gold-light: #F5D77E;
      --gold-pale: #F5ECD7;
      --gold-glow: rgba(212, 168, 67, 0.08);
      --cream: #FDFAF5;
      --text-dark: #081A28;
      --text-body: #1A2A3A;
      --text-muted: #5A6A7A;
      --text-light: #8A9AAA;
      --bg-white: #FFFFFF;
      --bg-light: #F5F8FA;
      --bg-lighter: #FAFCFE;
      --border-light: #E4EAF0;
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
      --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.06);
      --shadow-lg: 0 16px 56px rgba(0, 0, 0, 0.08);
      --shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.12);
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-xl: 28px;
      --transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      --transition-slow: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif;
      font-family: var(--font-sans);
      color: var(--text-body);
      background: var(--bg-white);
      line-height: 1.7;
      padding-top: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .page-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .hero-section {
      position: relative;
      min-height: 65vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      background: var(--primary-dark);
      margin-bottom: 0;
      padding: 20px 0;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      transform: translate3d(0, var(--hero-parallax, 0px), 0) scale(1.08);
      transform-origin: center top;
      transition: transform 0.08s linear;
      background-image: url('/images/webimages/consortium.jpeg');
      background-size: cover;
      background-position: center 25%;
      filter: brightness(0.72) contrast(1.05);
    }

    .hero-bg-alt {
      z-index: 0;
      background-image: url('/images/webimages/about.jpeg');
      opacity: 0;
      animation: heroImageLoop 14s ease-in-out infinite;
    }

    @keyframes heroImageLoop {
      0%, 42% { opacity: 0; }
      50%, 92% { opacity: 1; }
      100% { opacity: 0; }
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: rgba(6,20,32,0.40);
    }

    .hero-grid-pattern {
      position: absolute;
      inset: 0;
      z-index: 1;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }

    .hero-glow {
      position: absolute;
      inset: 0;
      z-index: 1;
      background: radial-gradient(ellipse at 65% 40%, rgba(212, 168, 67, 0.08) 0%, transparent 50%),
                  radial-gradient(ellipse at 30% 60%, rgba(212, 168, 67, 0.04) 0%, transparent 40%);
      pointer-events: none;
    }

    .hero-diagonal-line {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      z-index: 2;
      background: linear-gradient(180deg, transparent, rgba(212, 168, 67, 0.15), transparent);
      opacity: 0.3;
      pointer-events: none;
    }

    .hero-accent-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      z-index: 2;
      background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%);
      opacity: 0.6;
    }

    .hero-container {
      position: relative;
      z-index: 2;
      max-width: 1280px;
      width: 100%;
      padding: 60px 24px;
      margin: 0 auto;
    }

    .hero-breadcrumb {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 34px;
      color: rgba(255, 255, 255, 0.62);
      font-size: 0.74rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .hero-breadcrumb a {
      color: #ffffff;
      font-weight: 700;
      text-decoration: none;
    }

    .hero-breadcrumb a:hover {
      color: var(--gold-light);
    }

    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 760px);
      align-items: center;
      min-height: 55vh;
    }

    .hero-content {
      max-width: 100%;
    }

    .hero-title {
      font-size: 4.6rem;
      font-weight: 800;
      line-height: 1.04;
      letter-spacing: -0.04em;
      margin: 0 0 16px;
      color: #ffffff;
    }

    .hero-title .gold {
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 40%, var(--gold) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.6rem;
      font-weight: 900;
      color: rgba(248, 248, 250, 0.984);
      max-width: 700px;
      line-height: 1.8;
      margin: 0 0 12px;
      letter-spacing: 0.01em;
    }

    .hero-desc {
      font-size: 1.05rem;
      font-weight: 400;
      color: rgb(255, 255, 255);
      max-width: 580px;
      line-height: 1.9;
      margin: 0 0 36px;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 38px;
      background: var(--gold);
      color: var(--primary-dark);
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      border-radius: 60px;
      transition: all var(--transition);
      border: none;
      cursor: pointer;
      letter-spacing: 0.02em;
      font-family: var(--font-sans);
      box-shadow: 0 8px 32px rgba(212, 168, 67, 0.15);
    }

    .btn-primary:hover {
      background: var(--gold-light);
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(212, 168, 67, 0.3);
    }

    .btn-arrow {
      transition: transform var(--transition);
      display: inline-block;
    }

    .btn-primary:hover .btn-arrow {
      transform: translateX(6px);
    }

    .btn-outline {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 16px 36px;
      color: rgba(255, 255, 255, 0.65);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.10);
      border-radius: 60px;
      font-weight: 500;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all var(--transition);
      font-family: var(--font-sans);
      cursor: pointer;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.10);
      border-color: rgba(255, 255, 255, 0.20);
      color: #ffffff;
      transform: translateY(-3px);
    }

    .hero-scroll {
      position: absolute;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      opacity: 0.25;
      transition: opacity var(--transition);
    }

    .hero-scroll:hover {
      opacity: 0.6;
    }

    .scroll-line {
      width: 1px;
      height: 32px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent);
      animation: scrollLine 2s ease-in-out infinite;
    }

    @keyframes scrollLine {
      0%, 100% { transform: scaleY(0.4); opacity: 0.4; }
      50% { transform: scaleY(1); opacity: 1; }
    }

    .scroll-text {
      font-size: 0.55rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: rgba(255, 255, 255, 0.25);
    }

    .section-nav {
      position: sticky;
      top: var(--site-header-offset, 80px);
      z-index: 40;
      background: rgba(255, 253, 247, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-light);
    }

    .section-nav-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
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
      color: var(--text-muted);
      text-decoration: none;
      border-bottom: 2px solid transparent;
      transition: all 0.25s var(--transition);
      font-family: var(--font-sans);
    }

    .section-nav a:hover {
      color: var(--text-dark);
    }

    .section-nav a.active {
      color: var(--gold);
      border-bottom-color: var(--gold);
    }

    .intro-section {
      padding: 60px 0 40px;
      background: var(--bg-white);
      border-bottom: 1px solid var(--border-light);
    }

    .intro-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }

    .intro-text .intro-label {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--gold);
      display: block;
      margin-bottom: 8px;
    }

    .intro-text h2 {
      font-size: 2.4rem;
      font-weight: 700;
      color: var(--text-dark);
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin-bottom: 14px;
    }

    .intro-text h2 .gold {
      color: var(--gold);
    }

    .intro-text p {
      color: var(--text-muted);
      font-size: 1.05rem;
      line-height: 1.8;
      margin-bottom: 16px;
    }

    .intro-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .intro-stat {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 8px;
      background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(245, 239, 225, 0.92));
      padding: 18px 18px 16px;
      border-radius: 18px;
      border: 1px solid rgba(212, 168, 67, 0.16);
      text-align: left;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 10px 22px rgba(14, 33, 44, 0.06);
      transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition), background var(--transition);
      overflow: hidden;
    }

    .intro-stat::before,
    .feature-stat::before {
      content: '';
      position: absolute;
      inset: 0 auto 0 0;
      width: 4px;
      background: linear-gradient(180deg, var(--gold), var(--gold-light));
      opacity: 0.9;
    }

    .intro-stat:hover,
    .feature-stat:hover {
      transform: translateY(-4px);
      box-shadow: 0 18px 36px rgba(14, 33, 44, 0.1);
      border-color: rgba(212, 168, 67, 0.38);
      background: linear-gradient(135deg, rgba(255,255,255,1), rgba(250, 244, 232, 1));
    }

    .intro-stat .stat-number {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--primary-dark);
      display: block;
      line-height: 1.3;
      max-width: 90%;
    }

    .intro-stat .stat-label {
      font-size: 0.78rem;
      color: var(--text-muted);
      font-weight: 450;
    }

    .intro-section,
    .feature-section,
    .register-section {
      scroll-margin-top: calc(var(--site-header-offset, 80px) + 24px);
    }

    .feature-section {
      padding: 80px 0;
      position: relative;
      overflow: hidden;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .feature-section:nth-child(odd) {
      background: var(--bg-white);
    }

    .feature-section:nth-child(even) {
      background: var(--bg-lighter);
    }

    .feature-section .section-number {
      position: absolute;
      top: -20px;
      right: 40px;
      font-size: 10rem;
      font-weight: 900;
      color: rgba(0, 0, 0, 0.02);
      letter-spacing: -0.08em;
      line-height: 1;
      pointer-events: none;
      user-select: none;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .feature-grid.reverse {
      direction: rtl;
    }

    .feature-grid.reverse .feature-content {
      direction: ltr;
    }

    .feature-grid.reverse .feature-image {
      direction: ltr;
    }

    .feature-content .feature-label {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--gold);
      display: block;
      margin-bottom: 6px;
    }

    .feature-content h3 {
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--text-dark);
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin-bottom: 14px;
    }

    .feature-content h3 .gold {
      color: var(--gold);
    }

    .feature-content .feature-desc {
      color: var(--text-muted);
      font-size: 1.02rem;
      line-height: 1.8;
      margin-bottom: 20px;
    }

    .feature-stats {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .feature-stat {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,245,238,0.98));
      padding: 18px 20px 16px 20px;
      border-radius: 18px;
      border: 1px solid rgba(212, 168, 67, 0.16);
      text-align: left;
      min-width: 180px;
      flex: 1;
      box-shadow: 0 12px 26px rgba(13, 31, 45, 0.06);
      text-decoration: none;
      color: inherit;
      transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition), background var(--transition);
      overflow: hidden;
    }

    .feature-stat .stat-number {
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary-dark);
      display: block;
      line-height: 1.4;
    }

    .feature-stat .stat-label {
      font-size: 0.72rem;
      color: var(--text-muted);
      font-weight: 450;
      line-height: 1.5;
    }

    .card-arrow {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      margin-top: 4px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
      color: var(--primary-dark);
      font-size: 1.1rem;
      font-weight: 700;
      box-shadow: 0 8px 16px rgba(212, 168, 67, 0.18);
      transition: transform 0.35s ease, box-shadow 0.35s ease;
    }

    .intro-stat:hover .card-arrow,
    .feature-stat:hover .card-arrow {
      transform: translateX(5px);
      box-shadow: 0 10px 18px rgba(212, 168, 67, 0.24);
    }

    .feature-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--gold);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all var(--transition);
      font-family: var(--font-sans);
    }

    .feature-cta .cta-arrow {
      transition: transform var(--transition);
      display: inline-block;
    }

    .feature-cta:hover {
      color: var(--primary-light);
      gap: 14px;
    }

    .feature-cta:hover .cta-arrow {
      transform: translateX(6px);
    }

    .feature-image {
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--bg-light);
      box-shadow: var(--shadow-md);
      min-height: 300px;
      position: relative;
      transition: box-shadow var(--transition);
    }

    .feature-image:hover {
      box-shadow: var(--shadow-xl);
    }

    .feature-image img {
      width: 100%;
      height: 100%;
      min-height: 300px;
      object-fit: cover;
      display: block;
      transition: transform var(--transition-slow);
    }

    .feature-image:hover img {
      transform: scale(1.02);
    }

    .feature-image .image-overlay-text {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 24px 28px;
      background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%);
      color: #ffffff;
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    .register-section {
      padding: 60px 0;
      background: var(--primary-dark);
      position: relative;
      overflow: hidden;
    }

    .register-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(212, 168, 67, 0.04), transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .register-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .register-text .register-label {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--gold);
      display: block;
      margin-bottom: 8px;
    }

    .register-text h2 {
      font-size: 2.4rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin-bottom: 14px;
    }

    .register-text h2 .gold {
      color: var(--gold);
    }

    .register-text p {
      color: rgba(255, 255, 255, 0.55);
      font-size: 1.05rem;
      line-height: 1.8;
      margin-bottom: 28px;
    }

    .register-actions {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }

    .btn-gold {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 16px 38px;
      background: var(--gold);
      color: var(--primary-dark);
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      border-radius: 60px;
      transition: all var(--transition);
      border: none;
      cursor: pointer;
      letter-spacing: 0.02em;
      font-family: var(--font-sans);
      box-shadow: 0 8px 32px rgba(212, 168, 67, 0.15);
    }

    .btn-gold:hover {
      background: var(--gold-light);
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(212, 168, 67, 0.3);
    }

    .btn-gold .btn-arrow {
      transition: transform var(--transition);
      display: inline-block;
    }

    .btn-gold:hover .btn-arrow {
      transform: translateX(6px);
    }

    .btn-outline-light {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 16px 36px;
      color: rgba(255, 255, 255, 0.55);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 60px;
      font-weight: 500;
      font-size: 0.95rem;
      text-decoration: none;
      transition: all var(--transition);
      font-family: var(--font-sans);
      cursor: pointer;
    }

    .btn-outline-light:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      transform: translateY(-3px);
    }

    .register-image {
      border-radius: var(--radius-md);
      overflow: hidden;
      min-height: 200px;
      position: relative;
    }

    .register-image img {
      width: 100%;
      height: 100%;
      min-height: 200px;
      object-fit: cover;
      display: block;
    }

    .register-image .overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(6, 20, 32, 0.4), rgba(15, 43, 61, 0.2));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 0.9rem;
      text-align: center;
      padding: 40px;
    }

    .register-image .overlay .icon {
      font-size: 2.8rem;
      margin-bottom: 8px;
      opacity: 0.5;
    }

    @media (max-width: 1024px) {
      .hero-grid {
        grid-template-columns: minmax(0, 680px);
      }

      .hero-title {
        font-size: 3.6rem;
      }

      .intro-grid {
        gap: 40px;
      }

      .feature-grid {
        gap: 32px;
      }

      .feature-content h3 {
        font-size: 1.8rem;
      }

      .register-grid {
        gap: 32px;
      }

      .register-text h2 {
        font-size: 2rem;
      }

      .feature-section .section-number {
        font-size: 7rem;
        right: 20px;
      }
    }

    @media (max-width: 768px) {
      .section-nav {
        top: 64px;
      }

      .section-nav a {
        padding: 10px 14px;
        font-size: 0.6rem;
      }

      .hero-section {
        min-height: auto;
      }

      .hero-container {
        padding: 40px 20px;
      }

      .hero-grid {
        grid-template-columns: 1fr;
        min-height: auto;
      }

      .hero-diagonal-line {
        display: none;
      }

      .hero-accent-line {
        display: none;
      }

      .hero-title {
        font-size: 2.8rem;
      }

      .hero-subtitle {
        font-size: 1.1rem;
      }

      .hero-desc {
        font-size: 0.92rem;
      }

      .hero-actions {
        flex-direction: column;
        width: 100%;
      }

      .btn-primary,
      .btn-outline {
        width: 100%;
        justify-content: center;
      }

      .intro-grid {
        grid-template-columns: 1fr;
        gap: 28px;
      }

      .intro-text h2 {
        font-size: 1.8rem;
      }

      .intro-stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .feature-section {
        padding: 50px 0;
      }

      .feature-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .feature-grid.reverse {
        direction: ltr;
      }

      .feature-content h3 {
        font-size: 1.6rem;
      }

      .feature-stats {
        flex-direction: column;
        gap: 10px;
      }

      .feature-stat {
        min-width: unset;
        padding: 10px 16px;
      }

      .feature-image {
        min-height: 220px;
      }

      .feature-image img {
        min-height: 220px;
      }

      .feature-section .section-number {
        font-size: 5rem;
        right: 12px;
        top: -10px;
      }

      .register-section {
        padding: 40px 0;
      }

      .register-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .register-text h2 {
        font-size: 1.8rem;
      }

      .register-actions {
        flex-direction: column;
        width: 100%;
      }

      .btn-gold,
      .btn-outline-light {
        width: 100%;
        justify-content: center;
      }

      .register-image {
        min-height: 160px;
      }

      .register-image img {
        min-height: 160px;
      }

      .hero-scroll {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .hero-title {
        font-size: 2.2rem;
      }

      .hero-subtitle {
        font-size: 0.95rem;
      }

      .hero-desc {
        font-size: 0.85rem;
      }

      .intro-text h2 {
        font-size: 1.5rem;
      }

      .intro-stat .stat-number {
        font-size: 1.3rem;
      }

      .intro-stat .stat-label {
        font-size: 0.65rem;
      }

      .feature-content h3 {
        font-size: 1.3rem;
      }

      .feature-content .feature-desc {
        font-size: 0.9rem;
      }

      .feature-stat .stat-number {
        font-size: 1.2rem;
      }

      .feature-stat .stat-label {
        font-size: 0.6rem;
      }

      .register-text h2 {
        font-size: 1.4rem;
      }

      .register-text p {
        font-size: 0.9rem;
      }

      .feature-section .section-number {
        font-size: 3.5rem;
        right: 8px;
        top: -5px;
      }

      .intro-stats {
        grid-template-columns: 1fr 1fr;
        gap: 8px;
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
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--primary);
    }

    ::selection {
      background: var(--gold-pale);
      color: var(--text-dark);
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-bg {
        transition: none;
        transform: none;
      }

      .hero-bg-alt {
        animation: none;
        opacity: 0;
      }
    }
  `]
})
export class TrainingWp5Component implements AfterViewInit, OnDestroy {
  readonly heroImages = [
    '/images/webimages/consortium.jpeg',
    '/images/webimages/about.jpeg',
    '/images/webimages/maize.png',
    '/images/webimages/Pasture.png',
    '/images/webimages/tunisapome.png',
    '/images/webimages/Pomegranate.png',
    '/images/webimages/mushroom.png',
    '/images/webimages/Challenge.png',
    '/images/webimages/afica.svg'
  ];

  private observer: IntersectionObserver | null = null;
  private navObserver: IntersectionObserver | null = null;
  private heroIntervalId: number | null = null;
  private currentHeroIndex = 0;
  private readonly handleResize = (): void => this.syncStickyOffset();
  private readonly handleScroll = (): void => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hero = document.querySelector('.hero-section') as HTMLElement | null;
    if (!hero) return;

    const offset = Math.min(Math.max(window.scrollY * 0.18, 0), hero.offsetHeight * 0.18);
    hero.style.setProperty('--hero-parallax', `${offset}px`);
  };

  scrollToSection(event: MouseEvent, sectionId: string): void {
    event.preventDefault();

    const section = document.getElementById(sectionId);
    if (!section) return;

    const header = document.querySelector('.site-header') as HTMLElement | null;
    const sectionNav = document.querySelector('.section-nav') as HTMLElement | null;
    const offset = (header?.offsetHeight ?? 80) + (sectionNav?.offsetHeight ?? 52) + 12;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;

    window.history.replaceState(null, '', `#${sectionId}`);
    window.scrollTo({ top, behavior: 'smooth' });
    this.setActiveSection(sectionId);
  }

  ngAfterViewInit(): void {
    this.syncStickyOffset();
    this.startHeroLoop();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('load', this.handleResize);
    window.addEventListener('scroll', this.handleScroll, { passive: true });

    const sections = document.querySelectorAll('.feature-section, .intro-section, .register-section');
    const navLinks = document.querySelectorAll('.section-nav a');

    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      });

      sections.forEach((section) => this.observer?.observe(section));

      const sectionIds = Array.from(navLinks).map((link) => link.getAttribute('data-section'));
      const observedSections: Element[] = [];

      sectionIds.forEach((sectionId) => {
        if (sectionId) {
          const section = document.getElementById(sectionId);
          if (section) {
            observedSections.push(section);
          }
        }
      });

      if (observedSections.length) {
        this.navObserver = new IntersectionObserver((entries) => {
          const visibleSections = entries
            .filter(entry => entry.isIntersecting)
            .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top);
          const activeSection = visibleSections[0]?.target.id;
          if (activeSection) this.setActiveSection(activeSection);
        }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });

        observedSections.forEach((section) => this.navObserver?.observe(section));
      }
    } else {
      sections.forEach((section) => {
        (section as HTMLElement).style.opacity = '1';
        (section as HTMLElement).style.transform = 'translateY(0)';
      });
    }
  }

  private syncStickyOffset(): void {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const height = header ? header.offsetHeight : 80;
    document.documentElement.style.setProperty('--site-header-offset', `${height}px`);
  }

  private startHeroLoop(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const primaryBg = document.querySelector('.hero-bg') as HTMLElement | null;
    const secondaryBg = document.querySelector('.hero-bg-alt') as HTMLElement | null;
    if (!primaryBg || !secondaryBg) {
      return;
    }

    this.heroIntervalId = window.setInterval(() => {
      const nextIndex = (this.currentHeroIndex + 1) % this.heroImages.length;
      primaryBg.style.backgroundImage = `url('${this.heroImages[this.currentHeroIndex]}')`;
      secondaryBg.style.backgroundImage = `url('${this.heroImages[nextIndex]}')`;
      secondaryBg.style.opacity = '1';
      secondaryBg.style.transition = 'opacity 1.4s ease-in-out';
      primaryBg.style.transition = 'opacity 1.4s ease-in-out';
      primaryBg.style.opacity = '0.75';

      window.setTimeout(() => {
        primaryBg.style.backgroundImage = `url('${this.heroImages[nextIndex]}')`;
        primaryBg.style.opacity = '1';
        secondaryBg.style.opacity = '0';
        this.currentHeroIndex = nextIndex;
      }, 1800);
    }, 5200);
  }

  private setActiveSection(sectionId: string): void {
    document.querySelectorAll('.section-nav a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.navObserver?.disconnect();
    if (this.heroIntervalId !== null) {
      window.clearInterval(this.heroIntervalId);
    }
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('load', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
  }
}