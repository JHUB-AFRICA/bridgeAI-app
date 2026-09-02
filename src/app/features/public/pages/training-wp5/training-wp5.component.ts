// ============================================================
// BRIDGE-AI Kenya - Training WP5 Component
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
        <div class="hero-overlay"></div>
        <div class="hero-grid-pattern"></div>
        <div class="hero-glow"></div>
        <div class="hero-diagonal-line"></div>
        <div class="hero-accent-line"></div>

        <div class="hero-container">
          <div class="hero-grid">
            <div class="hero-content">
              <h1 class="hero-title">
                Capacity Building<br>
                <span class="gold">and Replication</span>
              </h1>
              <p class="hero-subtitle">JKUAT's Leadership in African Digital Agriculture</p>
              <p class="hero-desc">
                JKUAT leads Work Package 5, focusing on training, SME mentoring,
                community building and replication of GenAI solutions for African agriculture.
              </p>
              <div class="hero-actions">
                <a [routerLink]="['/training-events']" class="btn-primary">
                  Explore Events
                  <span class="btn-arrow">→</span>
                </a>
                <a [routerLink]="['/training-materials']" class="btn-outline">
                  View Materials
                </a>
              </div>
            </div>

            <div class="hero-stats">
              <div class="stats-card">
                <div class="stats-item">
                  <span class="stats-label">Participants</span>
                  <span class="stats-value">150+</span>
                </div>
                <div class="stats-divider"></div>
                <div class="stats-item">
                  <span class="stats-label">Mentored SMEs</span>
                  <span class="stats-value">45+</span>
                </div>
                <div class="stats-divider"></div>
                <div class="stats-item">
                  <span class="stats-label">Events</span>
                  <span class="stats-value">12+</span>
                </div>
                <div class="stats-divider"></div>
                <div class="stats-item">
                  <span class="stats-label">Countries</span>
                  <span class="stats-value">8+</span>
                </div>
              </div>
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
          <a href="#overview" data-section="overview" class="active">Overview</a>
          <a href="#events" data-section="events">Events</a>
          <a href="#materials" data-section="materials">Materials</a>
          <a href="#mentoring" data-section="mentoring">Mentoring</a>
          <a href="#community" data-section="community">Community</a>
          <a href="#replication" data-section="replication">Replication</a>
          <a href="#register" data-section="register">Register</a>
        </div>
      </nav>

      <section class="intro-section" id="overview">
        <div class="page-container">
          <div class="intro-grid">
            <div class="intro-text">
              <span class="intro-label">About WP5</span>
              <h2>Building Capacity for <span class="gold">African Agriculture</span></h2>
              <p>
                JKUAT leads the effort to build African digital agriculture capacity
                across East Africa. Through training, mentoring and replication,
                we empower SMEs, developers and farmers with GenAI solutions.
              </p>
              <p style="margin-bottom:0;">
                Our programs reach across Kenya, Tunisia and Nigeria,
                creating a lasting impact on agricultural innovation.
              </p>
            </div>
            <div class="intro-stats">
              <div class="intro-stat">
                <span class="stat-number">150+</span>
                <span class="stat-label">Participants Trained</span>
              </div>
              <div class="intro-stat">
                <span class="stat-number">45+</span>
                <span class="stat-label">SMEs Mentored</span>
              </div>
              <div class="intro-stat">
                <span class="stat-number">12+</span>
                <span class="stat-label">Events Hosted</span>
              </div>
              <div class="intro-stat">
                <span class="stat-number">8+</span>
                <span class="stat-label">Countries Reached</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-section" id="events">
        <div class="page-container">
          <div class="feature-grid">
            <div class="feature-image">
              <img src="https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80" alt="Training event with participants" loading="lazy">
              <div class="image-overlay-text">Hands-on training for farmers, youth and women</div>
            </div>
            <div class="feature-content">
              <span class="feature-label">Hands-on Learning</span>
              <h3>Training <span class="gold">Events</span></h3>
              <p class="feature-desc">
                Hands-on bootcamps, workshops and field demonstrations for farmers,
                youth and women across East Africa. Participants learn practical
                skills in agritech, AI and digital farming.
              </p>
              <div class="feature-stats">
                <div class="feature-stat">
                  <span class="stat-number">12+</span>
                  <span class="stat-label">Events Hosted</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">150+</span>
                  <span class="stat-label">Participants Trained</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">8+</span>
                  <span class="stat-label">Countries Reached</span>
                </div>
              </div>
              <a [routerLink]="['/training-events']" class="feature-cta">
                View All Events
                <span class="cta-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-section" id="materials">
        <div class="page-container">
          <div class="feature-grid reverse">
            <div class="feature-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="Training materials and resources" loading="lazy">
              <div class="image-overlay-text">Open access resources for self-paced learning</div>
            </div>
            <div class="feature-content">
              <span class="feature-label">Open Access Resources</span>
              <h3>Training <span class="gold">Materials</span></h3>
              <p class="feature-desc">
                Access training modules, video tutorials, guides and open-source
                repositories for self-paced learning. All materials are designed
                for African agricultural contexts.
              </p>
              <div class="feature-stats">
                <div class="feature-stat">
                  <span class="stat-number">20+</span>
                  <span class="stat-label">Training Modules</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">15+</span>
                  <span class="stat-label">Video Tutorials</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">10+</span>
                  <span class="stat-label">Downloadable Guides</span>
                </div>
              </div>
              <a [routerLink]="['/training-materials']" class="feature-cta">
                Explore Materials
                <span class="cta-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-section" id="mentoring">
        <div class="page-container">
          <div class="feature-grid">
            <div class="feature-image">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" alt="SME mentoring session" loading="lazy">
              <div class="image-overlay-text">Empowering agricultural SMEs and startups</div>
            </div>
            <div class="feature-content">
              <span class="feature-label">Empowering SMEs</span>
              <h3>SME <span class="gold">Mentoring</span></h3>
              <p class="feature-desc">
                Mentorship, challenges and hackathons for agricultural SMEs and startups.
                Our program helps businesses scale, innovate and adopt GenAI solutions
                for sustainable growth.
              </p>
              <div class="feature-stats">
                <div class="feature-stat">
                  <span class="stat-number">45+</span>
                  <span class="stat-label">SMEs Mentored</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">8+</span>
                  <span class="stat-label">Hackathons Hosted</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">12+</span>
                  <span class="stat-label">Success Stories</span>
                </div>
              </div>
              <a [routerLink]="['/sme-mentoring']" class="feature-cta">
                Learn More
                <span class="cta-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-section" id="community">
        <div class="page-container">
          <div class="feature-grid reverse">
            <div class="feature-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="Community of practice collaboration" loading="lazy">
              <div class="image-overlay-text">A network of agritech innovators</div>
            </div>
            <div class="feature-content">
              <span class="feature-label">Collaborative Innovation</span>
              <h3>Community of <span class="gold">Practice</span></h3>
              <p class="feature-desc">
                Join a network of developers, researchers and agritech innovators
                sharing knowledge and building solutions together. Collaborate on
                projects and advance digital agriculture.
              </p>
              <div class="feature-stats">
                <div class="feature-stat">
                  <span class="stat-number">50+</span>
                  <span class="stat-label">Community Members</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">10+</span>
                  <span class="stat-label">Repository Projects</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">5+</span>
                  <span class="stat-label">Community Events</span>
                </div>
              </div>
              <a [routerLink]="['/community-practice']" class="feature-cta">
                Join Community
                <span class="cta-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-section" id="replication">
        <div class="page-container">
          <div class="feature-grid">
            <div class="feature-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="Replication toolkit documents" loading="lazy">
              <div class="image-overlay-text">Scaling agritech solutions across contexts</div>
            </div>
            <div class="feature-content">
              <span class="feature-label">Scaling Solutions</span>
              <h3>Replication <span class="gold">Toolkit</span></h3>
              <p class="feature-desc">
                Templates, playbooks and lessons learned for scaling agritech
                solutions across different contexts. Our toolkit enables replication
                of successful interventions.
              </p>
              <div class="feature-stats">
                <div class="feature-stat">
                  <span class="stat-number">15+</span>
                  <span class="stat-label">Replication Templates</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">10+</span>
                  <span class="stat-label">Playbooks</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">8+</span>
                  <span class="stat-label">Lessons Learned</span>
                </div>
              </div>
              <a [routerLink]="['/replication-toolkit']" class="feature-cta">
                View Toolkit
                <span class="cta-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-section" id="register">
        <div class="page-container">
          <div class="feature-grid reverse">
            <div class="feature-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" alt="Registration for training programs" loading="lazy">
              <div class="image-overlay-text">Start your digital agriculture journey</div>
            </div>
            <div class="feature-content">
              <span class="feature-label">Get Started</span>
              <h3>Register for <span class="gold">Training</span></h3>
              <p class="feature-desc">
                Sign up for upcoming bootcamps, workshops and mentoring programs
                to build your digital agriculture skills. Join our community of
                innovators and changemakers.
              </p>
              <div class="feature-stats">
                <div class="feature-stat">
                  <span class="stat-number">Upcoming</span>
                  <span class="stat-label">Bootcamps</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">Ongoing</span>
                  <span class="stat-label">Workshops</span>
                </div>
                <div class="feature-stat">
                  <span class="stat-number">Available</span>
                  <span class="stat-label">Mentoring Program</span>
                </div>
              </div>
              <a [routerLink]="['/contact']" class="feature-cta">
                Sign Up Now
                <span class="cta-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="register-section" id="get-involved">
        <div class="page-container">
          <div class="register-grid">
            <div class="register-text">
              <span class="register-label">Get Involved</span>
              <h2>Ready to Get <span class="gold">Involved</span>?</h2>
              <p>
                Join your training programs and help shape the future of
                African agriculture through GenAI and digital innovation.
                Be part of the change.
              </p>
              <div class="register-actions">
                <a [routerLink]="['/contact']" class="btn-gold">
                  Contact Us
                  <span class="btn-arrow">→</span>
                </a>
                <a [routerLink]="['/training-events']" class="btn-outline-light">
                  View All Events
                </a>
              </div>
            </div>
            <div class="register-image">
              <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80" alt="Get involved" loading="lazy">
              <div class="overlay">
                <div>
                  <div class="icon">✦</div>
                  <span>Join the movement</span>
                  <br>
                  <span style="font-size:0.7rem;opacity:0.5;">Shape African agriculture</span>
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
      background-image: url('https://media.licdn.com/dms/image/v2/D4E22AQFeYSn7BgjW7Q/feedshare-shrink_1280/B4EZ8YMXqlKQAM-/0/1782817324557?e=1787788800&v=beta&t=TFdYxfoeh3GQ3xBfwTM-8_Shp0vqzExYrarKCTRf2Ig');
      background-size: cover;
      background-position: center 25%;
      filter: brightness(0.8) contrast(1.05);
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

    .hero-grid {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 40px;
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

    .hero-stats {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .stats-card {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: var(--radius-md);
      padding: 24px 28px;
      min-width: 200px;
      width: 100%;
      max-width: 260px;
    }

    .stats-item {
      padding: 6px 0;
    }

    .stats-label {
      display: block;
      font-size: 0.6rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255, 255, 255, 0.30);
      margin-bottom: 1px;
    }

    .stats-value {
      display: block;
      font-size: 0.95rem;
      font-weight: 500;
      color: #ffffff;
    }

    .stats-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.04);
      margin: 6px 0;
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
      background: var(--bg-lighter);
      padding: 16px 20px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-light);
      text-align: center;
    }

    .intro-stat .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--gold);
      display: block;
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
      background: var(--bg-white);
      padding: 12px 20px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-light);
      text-align: center;
      min-width: 100px;
      flex: 1;
      box-shadow: var(--shadow-sm);
    }

    .feature-stat .stat-number {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--gold);
      display: block;
    }

    .feature-stat .stat-label {
      font-size: 0.72rem;
      color: var(--text-muted);
      font-weight: 450;
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
        grid-template-columns: 1fr 220px;
        gap: 30px;
      }

      .stats-card {
        padding: 20px 24px;
        min-width: 160px;
      }

      .stats-value {
        font-size: 0.85rem;
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
        gap: 24px;
        min-height: auto;
      }

      .hero-stats {
        justify-content: flex-start;
        width: 100%;
      }

      .stats-card {
        max-width: 100%;
        padding: 16px 20px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.04);
      }

      .stats-divider {
        display: none;
      }

      .stats-item {
        padding: 4px 0;
        text-align: center;
      }

      .stats-label {
        font-size: 0.5rem;
      }

      .stats-value {
        font-size: 0.78rem;
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

      .stats-card {
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
        padding: 12px 16px;
      }

      .stats-item {
        text-align: left;
      }

      .stats-value {
        font-size: 0.7rem;
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
  `]
})
export class TrainingWp5Component implements AfterViewInit, OnDestroy {
  private observer: IntersectionObserver | null = null;
  private navObserver: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.syncStickyOffset();
    window.addEventListener('resize', this.syncStickyOffset.bind(this));
    window.addEventListener('load', this.syncStickyOffset.bind(this));

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
          entries.forEach((entry) => {
            const link = document.querySelector(`.section-nav a[data-section="${entry.target.id}"]`);
            if (!link) return;
            if (entry.isIntersecting) {
              navLinks.forEach((l) => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

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

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.navObserver?.disconnect();
    window.removeEventListener('resize', this.syncStickyOffset.bind(this));
    window.removeEventListener('load', this.syncStickyOffset.bind(this));
  }
}