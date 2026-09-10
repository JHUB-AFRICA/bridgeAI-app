// ============================================================
// BRIDGE-AI - About Component
// ============================================================

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div id="page-loader" aria-live="polite" aria-label="Loading page">
      <div class="loader-spinner"></div>
      <p>Loading</p>
    </div>

    <main>
      <section class="hero" id="heroSection">
        <div class="hero-image-wrapper" id="heroImageWrapper">
          <div class="hero-slide-bg active" style="background-image: url('https://media.licdn.com/dms/image/v2/D4E22AQHYDwYQ88DUZg/feedshare-shrink_1280/B4EZ7bSmT4KIAQ-/0/1781795547106?e=1787788800&v=beta&t=_OU_S6KQNI4jYk9MzZfTDCFmqMAujSHFa3bys85wqc0');"></div>
        </div>

        <div class="hero-content-wrapper">
          <div class="hero-content">
            <h1>
              About <span class="highlight">BRIDGE-AI</span>
            </h1>
            <p class="hero-sub">
              Building ResIlient Development with<br />
              GEnerative AI in Education &amp; Agriculture
            </p>
            <p class="hero-description">
              A Horizon Europe Research and Innovation Action improving African rural societies
              by integrating GenAI-based solutions into agricultural optimisation and digital skills acquisition.
            </p>
          </div>
        </div>
      </section>

      <nav class="section-nav" aria-label="Page sections">
        <div class="section-nav-inner">
          <a href="#overview" data-section="overview" class="active">Overview</a>
          <a href="#impact" data-section="impact">Impact &amp; Objectives</a>
          <a href="#countries" data-section="countries">Pilot Regions</a>
          <a href="#technology" data-section="technology">Technology</a>
        </div>
      </nav>

      <section class="sectiono" id="overview">
        <div class="containero">
          <div class="overview-wrapper">
            <div class="overview-text reveal">
              <h2>Building a <span class="highlight">Climate-Resilient</span> Future</h2>
              <p>
                <strong>BRIDGE-AI</strong> is a European project that aims to help farmers in Africa make better decisions by using advanced digital tools based on artificial intelligence (AI).
              </p>
              <p>
                The project focuses on rural areas in <strong>Nigeria, Kenya and Tunisia</strong>, where agriculture is essential for people's livelihoods, but is increasingly affected by climate change, water scarcity and soil degradation.
              </p>
              <p>
                At the same time, access to digital tools, data and technical support is often limited. This makes it difficult for farmers to plan their activities and respond to challenges.
              </p>
              <div class="highlight-box">
                <strong>Our Mission</strong>
                <p>BRIDGE-AI develops tools that combine satellite data, weather information, and field measurements with artificial intelligence. These tools provide farmers with practical advice to help them manage their crops more effectively and sustainably presented in a simple and understandable way.</p>
              </div>
              <p>
                <strong>Why it matters:</strong> Farmers get practical guidance on when to plant or harvest, how to detect problems early, how to adapt to changing weather, and how to use water more efficiently.
              </p>
            </div>
            <div class="overview-image reveal">
              <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80" alt="African agriculture and farming" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section class="section section-alt" id="impact">
        <div class="container">
          <div class="section-header reveal">
            <h2>Impact &amp; <span class="highlight">Objectives</span></h2>
            <p>Practical AI, stronger skills, and solutions that can move beyond the pilot regions.</p>
          </div>
          <div class="impact-layout">
            <div class="impact-image reveal">
              <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85" alt="BRIDGE-AI partners collaborating around agricultural innovation" loading="lazy" />
              <span class="impact-image-caption">Research, technology and local knowledge in one shared practice.</span>
            </div>
            <div class="impact-list">
              <article class="impact-item reveal"><span>01</span><div><h4>Useful decisions</h4><p>Turn field, weather, satellite and sensor data into clear guidance for farmers.</p></div></article>
              <article class="impact-item reveal"><span>02</span><div><h4>Climate resilience</h4><p>Support better planning around changing weather, water, soil and crop conditions.</p></div></article>
              <article class="impact-item reveal"><span>03</span><div><h4>Inclusive skills</h4><p>Build practical digital skills with farmers, youth, women, SMEs and local organisations.</p></div></article>
              <article class="impact-item reveal"><span>04</span><div><h4>Evidence from pilots</h4><p>Test solutions in Nigeria, Kenya and Tunisia, then document what works.</p></div></article>
              <article class="impact-item reveal"><span>05</span><div><h4>Open collaboration</h4><p>Connect researchers, partners and communities through shared tools and Living Labs.</p></div></article>
              <article class="impact-item reveal"><span>06</span><div><h4>Scale beyond pilots</h4><p>Package learning into training, resources and playbooks for wider adoption.</p></div></article>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="countries">
        <div class="container">
          <div class="section-header reveal">
            <h2>Our <span class="highlight">Pilot Regions</span></h2>
            <p>Three regions, four use cases, one shared BRIDGE-AI approach.</p>
          </div>
          <div class="countries-grid">
            <a class="country-card-link reveal" [routerLink]="['/pilot-nigeria']">
            <div class="country-card">
              <div class="card-image">
                <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80" alt="Maize farming in Nigeria" loading="lazy" />
              </div>
              <div class="card-body">
                <span class="card-badge">Use Case 1</span>
                <h4>Maize Production</h4>
                <span class="country-name"><i class="fas fa-map-pin" style="margin-right:6px;"></i>Nigeria</span>
                <p>Maize is a key crop for food security and livelihoods in Nigeria. BRIDGE-AI helps farmers better anticipate climate conditions and make informed decisions about planting, harvesting and crop management.</p>
                <span class="tech-tag">Digital Shadows</span>
              </div>
            </div>
            </a>

            <a class="country-card-link reveal" [routerLink]="['/smart-mushrooms']">
            <div class="country-card">
              <div class="card-image">
                <img src="https://images.unsplash.com/photo-1464226184884-fa52ac9fcf8b?auto=format&fit=crop&w=1200&q=80" alt="Mushroom cultivation in Kenya" loading="lazy" />
              </div>
              <div class="card-body">
                <span class="card-badge">Use Case 2</span>
                <h4>Smart Mushroom Cultivation</h4>
                <span class="country-name"><i class="fas fa-map-pin" style="margin-right:6px;"></i>Kenya</span>
                <p>Mushroom cultivation requires carefully controlled growing conditions. BRIDGE-AI develops tools that help farmers monitor their production environment and optimise growing conditions. The pilot also promotes the involvement of young people and women in digital agriculture.</p>
                <span class="tech-tag">IoT + GenAI</span>
              </div>
            </div>
            </a>

            <a class="country-card-link reveal" [routerLink]="['/pilot-tunisia']">
            <div class="country-card">
              <div class="card-image">
                <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80" alt="Pasture in Tunisia" loading="lazy" />
              </div>
              <div class="card-body">
                <span class="card-badge">Use Case 3</span>
                <h4>Pasture Management</h4>
                <span class="country-name"><i class="fas fa-map-pin" style="margin-right:6px;"></i>Tunisia</span>
                <p>Pasturelands are essential for many farming communities. This pilot combines environmental information and digital tools to help farmers better understand pasture growth and make informed grazing decisions.</p>
                <span class="tech-tag">Earth Observation</span>
              </div>
            </div>
            </a>

            <a class="country-card-link reveal" [routerLink]="['/pilot-tunisia']">
            <div class="country-card">
              <div class="card-image">
                <img src="https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1200&q=80" alt="Pomegranate in Tunisia" loading="lazy" />
              </div>
              <div class="card-body">
                <span class="card-badge">Use Case 4</span>
                <h4>Pomegranate Cultivation</h4>
                <span class="country-name"><i class="fas fa-map-pin" style="margin-right:6px;"></i>Tunisia</span>
                <p>Pomegranate growers face increasing challenges related to water availability and changing climate conditions. BRIDGE-AI provides tailored recommendations to improve irrigation, crop management and harvest planning.</p>
                <span class="tech-tag">Earth Observation</span>
              </div>
            </div>
            </a>
          </div>
        </div>
      </section>

      <section class="section section-alt" id="technology">
        <div class="container">
          <div class="section-header reveal">
            <h2>How It <span class="highlight">Works</span></h2>
            <p>BRIDGE-AI combines multiple cutting-edge technologies to deliver practical solutions</p>
          </div>
          <div class="tech-grid">
            <div class="tech-card reveal">
              <div class="tech-icon"><i class="fas fa-brain"></i></div>
              <div class="tech-content">
                <h4>Generative AI (GenAI)</h4>
                <p>AI models predict yields, detect anomalies, and provide decision support for farmers and agronomists. GenAI makes advanced technologies easier to understand and use.</p>
              </div>
            </div>
            <div class="tech-card reveal">
              <div class="tech-icon"><i class="fas fa-wifi"></i></div>
              <div class="tech-content">
                <h4>Internet of Things (IoT)</h4>
                <p>Real-time monitoring of temperature, humidity, CO₂, light, and substrate moisture using low-power sensors. Data is transmitted wirelessly for continuous analysis.</p>
              </div>
            </div>
            <div class="tech-card reveal">
              <div class="tech-icon"><i class="fas fa-satellite"></i></div>
              <div class="tech-content">
                <h4>Earth Observation (EO)</h4>
                <p>Satellite data integration for monitoring crop health, weather patterns, and environmental conditions. Helps farmers understand their environment better.</p>
              </div>
            </div>
            <div class="tech-card reveal">
              <div class="tech-icon"><i class="fas fa-comments"></i></div>
              <div class="tech-content">
                <h4>Accessible advice</h4>
                <p>Clear recommendations delivered through practical dashboards, alerts and local-language support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-dark" id="methodology">
        <div class="container">
          <div class="methodology-wrapper">
            <div class="methodology-image reveal">
              <img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80" alt="Agricultural team working together" loading="lazy" />
            </div>
            <div class="methodology-content reveal">
              <h2>Our <span class="highlight">Methodology</span></h2>
              <p>BRIDGE-AI combines technology, local knowledge and collaboration to develop practical solutions for agriculture in Africa.</p>
              <div class="method-item">
                <i class="fas fa-database"></i>
                <span>Combines information from satellites, weather forecasts and field sensors</span>
              </div>
              <div class="method-item">
                <i class="fas fa-brain"></i>
                <span>Uses Artificial Intelligence to help farmers better understand their environment</span>
              </div>
              <div class="method-item">
                <i class="fas fa-handshake"></i>
                <span>Developed together with farmers, cooperatives, researchers and local organisations</span>
              </div>
              <div class="method-item">
                <i class="fas fa-chart-line"></i>
                <span>Transforms complex information into clear and accessible recommendations</span>
              </div>
              <div class="method-item">
                <i class="fas fa-flask"></i>
                <span>Validated through pilot projects in different agricultural contexts</span>
              </div>
              <div class="method-item">
                <i class="fas fa-seedling"></i>
                <span>Creates solutions that continue to support farmers beyond the project</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section" style="padding:60px 0; background:var(--paper-alt);">
        <div class="container" style="text-align:center;">
          <div class="section-header reveal" style="max-width:560px; margin:0 auto;">
            <h2 style="font-size:2rem;">Stay <span class="highlight">Connected</span></h2>
            <p style="font-size:1rem;">Follow our journey and be a part of the BRIDGE-AI community</p>
          </div>
          <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap; margin-top:8px;">
            <a [routerLink]="['/contact']" class="btn-primary" style="background:var(--growlight); border-color:var(--growlight);">
              <i class="fas fa-envelope btn-icon"></i>
              Contact Us
            </a>
            <a [routerLink]="['/training-wp5']" class="btn-secondary" style="color:var(--ink); border-color:var(--line);">
              <i class="fas fa-bell btn-icon"></i>
              Subscribe Now
            </a>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #2d3d35;
      background: #f7f2e6;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    :host * {
      box-sizing: border-box;
    }

    :host html {
      scroll-behavior: smooth;
    }

    :host img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    :host ::selection {
      background: #7c4fa3;
      color: #fff;
    }

    :host h1,
    :host h2,
    :host h3,
    :host h4,
    :host h5,
    :host h6,
    :host p,
    :host span,
    :host a,
    :host li {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-style: normal;
    }

    #page-loader {
      position: fixed;
      inset: 0;
      background: #16281A;
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
      width: 38px;
      height: 38px;
      border: 2.5px solid rgba(255,255,255,0.1);
      border-top-color: #C89BE8;
      border-radius: 50%;
      animation: loaderSpin 0.8s linear infinite;
    }

    @keyframes loaderSpin {
      to { transform: rotate(360deg); }
    }

    #page-loader p {
      margin-top: 18px;
      font-size: 0.7rem;
      color: rgba(255,255,255,0.5);
      font-family: 'Inter', monospace;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    :host {
      --ink: #17241B;
      --ink-soft: #2D3D35;
      --paper: #F7F2E6;
      --paper-alt: #EFE6CE;
      --paper-card: #FFFDF7;
      --moss: #26432B;
      --moss-deep: #16281A;
      --moss-mid: #3E6B45;
      --growlight: #7C4FA3;
      --growlight-deep: #5B3878;
      --growlight-tint: rgba(124, 79, 163, 0.09);
      --clay: #BE5A2B;
      --clay-tint: rgba(190, 90, 43, 0.1);
      --mist: #6E7767;
      --line: #E1D8C0;
      --gold: #C89B3C;
      --gold-soft: #D4B06A;
      --shadow-sm: 0 4px 20px rgba(0,0,0,0.06);
      --shadow-md: 0 12px 40px rgba(0,0,0,0.08);
      --shadow-lg: 0 24px 64px rgba(0,0,0,0.12);
      --shadow-neu: 8px 8px 24px rgba(23, 36, 27, 0.08), -8px -8px 24px rgba(255, 253, 247, 0.7);
      --radius-sm: 8px;
      --radius-md: 16px;
      --radius-lg: 24px;
      --transition: 0.45s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 28px;
    }

    .containero {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 28px;
      background: white;
    }

    .section-header {
      max-width: 720px;
      margin: 0 auto 48px;
      text-align: center;
    }

    .section-header h2 {
      font-size: 2.8rem;
      font-weight: 800;
      color: var(--ink);
      line-height: 1.08;
      letter-spacing: -0.02em;
    }

    .section-header h2 .highlight {
      color: var(--moss);
      font-weight: 800;
    }

    .section-header p {
      font-size: 1.05rem;
      color: var(--mist);
      margin-top: 14px;
      font-weight: 400;
    }

    .section-alt { background: var(--paper-alt); }
    .section-dark { background: var(--moss-deep); color: var(--paper); }
    .section-dark .section-header h2 { color: var(--paper); }
    .section-dark .section-header p { color: rgba(247, 242, 230, 0.7); }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 32px;
      background: var(--moss);
      color: var(--paper);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.88rem;
      border-radius: 50px;
      transition: all 0.35s var(--transition);
      border: none;
      cursor: pointer;
      font-family: 'Inter', sans-serif;
    }

    .btn-primary:hover {
      background: var(--moss-deep);
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(22, 40, 26, 0.3);
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 32px;
      background: transparent;
      color: #fff;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.88rem;
      border-radius: 50px;
      border: 1.5px solid rgba(255,255,255,0.3);
      transition: all 0.35s var(--transition);
      cursor: pointer;
      font-family: 'Inter', sans-serif;
    }

    .btn-secondary:hover {
      border-color: #fff;
      color: #fff;
      background: rgba(255,255,255,0.08);
      transform: translateY(-3px);
    }

    .btn-icon { font-size: 1rem; }

    .hero {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      min-height: 85vh;
      background: var(--moss-deep);
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
      will-change: transform;
      transition: opacity 1.8s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      filter: saturate(0.9);
    }

    .hero-slide-bg.active {
      opacity: 1;
    }

    .hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(22, 40, 26, 0.3);
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

    .hero-content h1 .highlight {
      color: #C89BE8;
      font-weight: 900;
    }

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

    .section-nav {
      position: sticky;
      top: var(--site-header-offset, 80px);
      z-index: 40;
      background: rgba(255, 253, 247, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--line);
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
      color: var(--mist);
      text-decoration: none;
      border-bottom: 2px solid transparent;
      transition: all 0.25s var(--transition);
      font-family: 'Inter', sans-serif;
    }

    .section-nav a:hover { color: var(--ink); }
    .section-nav a.active {
      color: var(--moss);
      border-bottom-color: var(--gold);
    }

    .section {
      padding: 80px 0;
      scroll-margin-top: calc(var(--site-header-offset, 80px) + 24px);
    }

    .sectiono {
      padding: 80px 10px;
      scroll-margin-top: calc(var(--site-header-offset, 80px) + 24px);
      background: white;
    }

    .overview-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 56px;
      align-items: stretch;
      background: white;
    }

    .overview-text {
      flex: 1 1 55%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .overview-text h2 {
      font-size: 2.4rem;
      font-weight: 800;
      color: var(--ink);
      line-height: 1.08;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }

    .overview-text h2 .highlight {
      color: var(--moss);
    }

    .overview-text p {
      font-size: 1.02rem;
      color: var(--ink-soft);
      line-height: 1.8;
      margin-bottom: 16px;
    }

    .overview-text .highlight-box {
      background: var(--paper-card);
      border-left: 3px solid var(--gold);
      padding: 22px 26px;
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      margin: 22px 0;
      box-shadow: var(--shadow-sm);
    }

    .overview-text .highlight-box strong {
      color: var(--ink);
      display: block;
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .overview-text .highlight-box p {
      margin: 0;
      font-size: 0.96rem;
      color: var(--mist);
    }

    .overview-image {
      flex: 1 1 40%;
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: none;
      display: flex;
    }

    .overview-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .benefits-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: center;
    }

    .benefit-card {
      flex: 1 1 calc(50% - 12px);
      min-width: 280px;
      max-width: 580px;
      background: var(--paper-card);
      border-radius: var(--radius-md);
      padding: 36px 30px;
      box-shadow: var(--shadow-neu);
      border: 1px solid rgba(255, 255, 255, 0.5);
      transition: all 0.4s var(--transition);
      display: flex;
      gap: 18px;
      align-items: flex-start;
    }

    .impact-layout {
      display: grid;
      grid-template-columns: minmax(280px, .9fr) 1.1fr;
      gap: 56px;
      align-items: stretch;
    }

    .impact-image {
      position: relative;
      min-height: 640px;
      overflow: hidden;
      border-radius: var(--radius-lg);
      background: var(--moss-deep);
      box-shadow: var(--shadow-lg);
    }

    .impact-image::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 45%, rgba(22, 40, 26, .82));
    }

    .impact-image img { width: 100%; height: 100%; min-height: 640px; object-fit: cover; transition: transform .8s var(--transition); }
    .impact-image:hover img { transform: scale(1.04); }
    .impact-image-caption { position: absolute; z-index: 1; right: 28px; bottom: 28px; left: 28px; color: var(--paper); font: 500 .82rem/1.6 'IBM Plex Mono', monospace; }

    .impact-list { display: grid; align-content: center; gap: 0; }
    .impact-item { display: grid; grid-template-columns: 48px 1fr; gap: 18px; padding: 20px 0; border-bottom: 1px solid var(--line); }
    .impact-item:first-child { border-top: 1px solid var(--line); }
    .impact-item > span { color: var(--growlight-deep); font: 600 .72rem 'IBM Plex Mono', monospace; padding-top: 4px; }
    .impact-item h4 { margin: 0 0 4px; color: var(--ink); font-size: 1.12rem; }
    .impact-item p { margin: 0; color: var(--mist); font-size: .9rem; line-height: 1.65; }

    .benefit-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
      border-color: var(--growlight-tint);
    }

    .benefit-card .benefit-icon {
      width: 56px;
      height: 56px;
      flex-shrink: 0;
      border-radius: 50%;
      background: var(--growlight-tint);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      color: var(--growlight-deep);
    }

    .benefit-card .benefit-content h4 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 4px;
    }

    .benefit-card .benefit-content p {
      font-size: 0.9rem;
      color: var(--mist);
      line-height: 1.7;
      margin: 0;
    }

    .objectives-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: center;
    }

    .objective-card {
      flex: 1 1 calc(50% - 12px);
      min-width: 280px;
      max-width: 580px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius-md);
      padding: 30px 28px;
      transition: all 0.4s var(--transition);
      display: flex;
      gap: 18px;
      align-items: flex-start;
    }

    .objective-card:hover {
      transform: translateY(-4px);
      border-color: rgba(200, 149, 47, 0.4);
      background: rgba(255, 255, 255, 0.06);
    }

    .objective-card .obj-number {
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1.5px solid rgba(200, 149, 47, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--gold-soft);
      font-family: 'Inter', sans-serif;
    }

    .objective-card .obj-content h4 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--paper);
      margin-bottom: 4px;
    }

    .objective-card .obj-content p {
      font-size: 0.9rem;
      color: rgba(247, 242, 230, 0.7);
      line-height: 1.7;
      margin: 0;
    }

    .countries-grid {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .country-card-link {
      display: block;
      width: 100%;
      color: inherit;
      text-decoration: none;
    }

    .country-card {
      display: grid;
      grid-template-columns: minmax(280px, 38%) 1fr;
      width: 100%;
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all 0.4s var(--transition);
      background: var(--paper-card);
      border: 1px solid var(--growlight);
    }

    .country-card-link:hover .country-card {
      box-shadow: var(--shadow-lg);
      border-color: var(--growlight);
      transform: translateY(-3px);
    }

    .country-card-link { position: relative; }
    .country-card-link::after { content: '\\2197'; position: absolute; right: 24px; bottom: 22px; z-index: 2; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; color: var(--paper); background: var(--growlight-deep); font-size: 1rem; transition: transform .3s ease, background .3s ease; }
    .country-card-link:hover::after { transform: translate(3px, -3px); background: var(--moss); }

    .country-card .card-image {
      min-height: 300px;
      overflow: hidden;
      background: var(--moss-deep);
    }

    .country-card .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s var(--transition);
    }

    .country-card .card-body {
      padding: 24px 26px 28px;
    }

    .country-card .card-body .card-badge {
      display: inline-block;
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--paper);
      background: var(--moss);
      padding: 3px 14px;
      border-radius: 50px;
      margin-bottom: 8px;
      font-family: 'Inter', sans-serif;
    }

    .country-card .card-body h4 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 4px;
    }

    .country-card .card-body .country-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--growlight-deep);
      display: block;
      margin-bottom: 8px;
      font-family: 'Inter', sans-serif;
    }

    .country-card .card-body p {
      font-size: 0.92rem;
      color: var(--mist);
      line-height: 1.7;
      margin: 0;
    }

    .country-card .card-body .tech-tag {
      display: inline-block;
      background: var(--growlight-tint);
      color: var(--growlight-deep);
      padding: 3px 14px;
      border-radius: 50px;
      font-size: 0.65rem;
      font-weight: 600;
      margin-top: 10px;
      font-family: 'Inter', sans-serif;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }

    .tech-card {
      min-width: 0;
      background: var(--paper-card);
      border-radius: var(--radius-md);
      padding: 30px 28px;
      box-shadow: var(--shadow-neu);
      border: 1px solid rgba(255, 255, 255, 0.5);
      transition: all 0.4s var(--transition);
      display: flex;
      gap: 18px;
      align-items: flex-start;
    }

    .tech-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
      border-color: var(--clay-tint);
    }

    .tech-card .tech-icon {
      width: 52px;
      height: 52px;
      flex-shrink: 0;
      border-radius: 50%;
      background: var(--clay-tint);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      color: var(--clay);
    }

    .tech-card .tech-content h4 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 4px;
    }

    .tech-card .tech-content p {
      font-size: 0.9rem;
      color: var(--mist);
      line-height: 1.7;
      margin: 0;
    }

    .timeline-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: center;
    }

    .timeline-card {
      flex: 1 1 calc(50% - 12px);
      min-width: 280px;
      max-width: 580px;
      background: var(--paper-card);
      border-radius: var(--radius-md);
      padding: 28px 26px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--line);
      transition: all 0.4s var(--transition);
    }

    .timeline-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: var(--gold);
    }

    .timeline-card .tl-number {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--paper);
      background: var(--moss);
      display: inline-block;
      padding: 2px 14px;
      border-radius: 50px;
      margin-bottom: 8px;
      font-family: 'Inter', sans-serif;
    }

    .timeline-card .tl-period {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--gold);
      display: block;
      margin-bottom: 4px;
      font-family: 'Inter', sans-serif;
    }

    .timeline-card h4 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 4px;
    }

    .timeline-card p {
      font-size: 0.9rem;
      color: var(--mist);
      line-height: 1.7;
      margin: 0;
    }

    .methodology-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 48px;
      align-items: center;
    }

    .methodology-image {
      flex: 1 1 40%;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      min-height: 280px;
      background: var(--moss-deep);
    }

    .methodology-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      min-height: 280px;
    }

    .methodology-content {
      flex: 1 1 50%;
    }

    .methodology-content h2 {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--paper);
      line-height: 1.08;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }

    .methodology-content h2 .highlight {
      color: var(--gold-soft);
    }

    .methodology-content p {
      font-size: 1rem;
      color: rgba(247, 242, 230, 0.8);
      line-height: 1.8;
      margin-bottom: 12px;
    }

    .methodology-content .method-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .methodology-content .method-item:last-child {
      border-bottom: none;
    }

    .methodology-content .method-item i {
      font-size: 1.1rem;
      color: var(--gold-soft);
      width: 28px;
      text-align: center;
    }

    .methodology-content .method-item span {
      font-size: 0.92rem;
      color: rgba(247, 242, 230, 0.8);
      font-weight: 400;
    }

    .reveal {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .reveal.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    .btn-primary:focus-visible,
    .btn-secondary:focus-visible,
    .section-nav a:focus-visible {
      outline: 2px solid var(--growlight);
      outline-offset: 2px;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--paper-alt); }
    ::-webkit-scrollbar-thumb { background: var(--moss-mid); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--moss); }

    @media (max-width: 1024px) {
      .hero-content h1 { font-size: 2.8rem; }
      .section-header h2 { font-size: 2.2rem; }
      .benefit-card { flex: 1 1 100%; max-width: 100%; }
      .objective-card { flex: 1 1 100%; max-width: 100%; }
      .country-card { grid-template-columns: minmax(220px, 34%) 1fr; }
      .tech-grid { grid-template-columns: 1fr; }
      .timeline-card { flex: 1 1 100%; max-width: 100%; }
      .overview-text { flex: 1 1 100%; }
      .overview-image { flex: 1 1 100%; min-height: 240px; }
      .methodology-image { flex: 1 1 100%; min-height: 200px; }
      .methodology-content { flex: 1 1 100%; }
      .impact-layout { grid-template-columns: 1fr; gap: 32px; }
      .impact-image { min-height: 360px; }
      .impact-image img { min-height: 360px; }
    }

    @media (max-width: 768px) {
      :host {
        padding-top: 0;
      }

      .hero { min-height: 70vh; }
      .hero-content-wrapper { padding: 40px 24px; }
      .hero-content h1 { font-size: 2.2rem; }
      .hero-content .hero-sub { font-size: 1rem; }
      .hero-content .hero-description { font-size: 0.92rem; }
      .hero-buttons { flex-direction: column; width: 100%; }
      .hero-buttons .btn-primary,
      .hero-buttons .btn-secondary { width: 100%; justify-content: center; }

      .section-nav a { padding: 10px 14px; font-size: 0.6rem; }
      .section { padding: 60px 0; }
      .section-header h2 { font-size: 1.8rem; }
      .section-header p { font-size: 0.95rem; }

      .overview-text { text-align: center; }
      .overview-text h2 { font-size: 1.8rem; }
      .overview-text .highlight-box { text-align: left; }
      .methodology-content { text-align: center; }
      .methodology-content h2 { font-size: 1.8rem; }
      .methodology-content .method-item { justify-content: center; }

      .benefit-card { padding: 28px 24px; flex-direction: column; }
      .objective-card { padding: 24px 22px; flex-direction: column; }
      .tech-card { padding: 24px 22px; flex-direction: column; }
      .benefit-card,
      .objective-card,
      .tech-card,
      .timeline-card { text-align: center; align-items: center; }
      .country-card .card-body { text-align: center; }
      .impact-item { grid-template-columns: 38px 1fr; gap: 12px; text-align: left; }
      .methodology-content .method-item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .methodology-content .method-item:last-child { border-bottom: none; }
      .methodology-content .method-item i {
        font-size: 1.1rem;
        color: var(--gold-soft);
        width: 28px;
        text-align: center;
        flex-shrink: 0;
      }
      .methodology-content .method-item span {
        font-size: 0.92rem;
        color: rgba(247, 242, 230, 0.8);
        font-weight: 400;
        text-align: left;
      }

      .country-card { grid-template-columns: 1fr; }
      .country-card .card-image { min-height: 230px; }
    }

    @media (max-width: 480px) {
      .container { padding: 0 16px; }
      .hero-content h1 { font-size: 1.8rem; }
      .hero-content .hero-sub { font-size: 0.9rem; }
      .hero-content .hero-description { font-size: 0.85rem; }
      .section-header h2 { font-size: 1.5rem; }
      .overview-text h2 { font-size: 1.5rem; }
      .methodology-content h2 { font-size: 1.5rem; }
      .country-card .card-body { padding: 20px; }
      .benefit-card { padding: 24px 20px; }
      .tech-card { padding: 20px 18px; }
      .timeline-card { padding: 22px 20px; }
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
export class AboutComponent implements OnInit {
  ngOnInit(): void {
    this.syncStickyOffset();
    window.addEventListener('resize', this.syncStickyOffset.bind(this));
    this.initPageEffects();
  }

  private syncStickyOffset(): void {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const headerHeight = header ? header.offsetHeight : 92;
    document.documentElement.style.setProperty('--site-header-offset', `${headerHeight}px`);
  }

  private initPageEffects(): void {
    const loader = document.getElementById('page-loader');

    const hideLoader = () => {
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
        }, 700);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hideLoader, { once: true });
    } else {
      hideLoader();
    }
    setTimeout(hideLoader, 3000);

    const navLinks = Array.from(document.querySelectorAll('.section-nav a'));
    const sections = navLinks
      .map((link) => document.getElementById(link.getAttribute('data-section') ?? ''))
      .filter((section): section is HTMLElement => !!section);

    if (sections.length && 'IntersectionObserver' in window) {
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const link = document.querySelector(`.section-nav a[data-section="${entry.target.id}"]`);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((item) => item.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

      sections.forEach((section) => navObserver.observe(section));
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealEls = document.querySelectorAll('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('in-view'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach((el) => revealObserver.observe(el));
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const anchor = event.currentTarget as HTMLAnchorElement;
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        event.preventDefault();
        const header = document.querySelector('.site-header');
        const headerHeight = header ? (header as HTMLElement).offsetHeight : 0;
        const navHeight = document.querySelector('.section-nav')?.getBoundingClientRect().height ?? 0;
        const offset = headerHeight + navHeight + 18;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }
}

const pilotPageStyles = [`
  :host { display: block; --paper: #f7f2e6; --ink: #17241b; --moss: #26432b; --purple: #7c4fa3; --mist: #6e7767; --line: #e1d8c0; color: var(--ink); font-family: Inter, sans-serif; }
  * { box-sizing: border-box; }
  .pilot-page { min-height: 100vh; background: var(--paper); }
  .pilot-hero { min-height: 560px; display: flex; align-items: flex-end; position: relative; color: #fff; background-size: cover; background-position: center; }
  .pilot-hero::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(10, 23, 15, .88), rgba(10, 23, 15, .2)); }
  .nigeria { background-image: url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1800&q=85'); }
  .tunisia { background-image: url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=85'); }
  .hero-content { position: relative; z-index: 1; width: min(1280px, calc(100% - 48px)); margin: 0 auto; padding: 70px 0; max-width: 820px; }
  .breadcrumb { display: block; color: rgba(255, 255, 255, .75); font-size: .75rem; margin-bottom: 46px; text-decoration: none; }
  .eyebrow { display: block; color: #d8e86b; font: 600 .68rem 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; }
  h1 { font: 600 clamp(3rem, 7vw, 6rem)/1 Fraunces, serif; margin: 12px 0 18px; } h1 em { color: #d8e86b; font-weight: 400; }
  .pilot-hero p { max-width: 560px; color: rgba(255, 255, 255, .84); font-size: 1.08rem; line-height: 1.7; }
  .button { display: inline-flex; gap: 10px; align-items: center; margin-top: 24px; padding: 13px 22px; border-radius: 40px; color: #fff; background: var(--moss); text-decoration: none; font-weight: 700; }
  .button:hover { background: var(--purple); }
  .content-section { padding: 96px 0; } .content-container { width: min(1180px, calc(100% - 48px)); margin: 0 auto; }
  .intro { max-width: 680px; margin-bottom: 44px; } .intro h2 { font: 600 2.7rem/1.1 Fraunces, serif; margin: 10px 0 14px; } .intro p, .feature-grid p { color: var(--mist); line-height: 1.75; }
  .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; } .feature-grid article { overflow: hidden; background: #fffdf7; border: 1px solid var(--line); } .feature-grid img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; } .feature-grid h3, .feature-grid p { margin-left: 20px; margin-right: 20px; } .feature-grid h3 { margin-top: 20px; margin-bottom: 6px; } .feature-grid p { margin-bottom: 22px; }
  @media (max-width: 700px) { .hero-content, .content-container { width: min(100% - 32px, 600px); } .pilot-hero { min-height: 540px; } .feature-grid { grid-template-columns: 1fr; } .content-section { padding: 62px 0; } .intro h2 { font-size: 2.2rem; } }
`];

@Component({
  selector: 'app-pilot-nigeria',
  imports: [RouterModule],
  template: `<main class="pilot-page"><section class="pilot-hero nigeria"><div class="hero-content"><a routerLink="/about" class="breadcrumb">BRIDGE-AI / Pilot Regions</a><span class="eyebrow">Nigeria pilot</span><h1>Maize <em>Production</em></h1><p>Practical climate and crop intelligence for maize farmers, cooperatives and local agribusinesses.</p><a routerLink="/about" fragment="countries" class="button">Back to pilot regions <span aria-hidden="true">&#8594;</span></a></div></section><section class="content-section"><div class="content-container"><div class="intro"><span class="eyebrow">The focus</span><h2>Better decisions in changing conditions</h2><p>BRIDGE-AI combines weather, satellite and field information to help maize producers plan, respond to climate pressure and improve crop management.</p></div><div class="feature-grid"><article><img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&amp;fit=crop&amp;w=900&amp;q=85" alt="Maize field in Nigeria" loading="lazy"><h3>Seasonal planning</h3><p>Use timely information to support planting and harvest decisions.</p></article><article><img src="https://images.unsplash.com/photo-1464226184884-fa52ac9fcf8b?auto=format&amp;fit=crop&amp;w=900&amp;q=85" alt="Farmer reviewing a crop" loading="lazy"><h3>Digital support</h3><p>Translate complex signals into clear, usable recommendations.</p></article><article><img src="https://images.unsplash.com/photo-1523742810366-5a8d2a8c5f1a?auto=format&amp;fit=crop&amp;w=900&amp;q=85" alt="Agricultural landscape" loading="lazy"><h3>Local validation</h3><p>Test tools with local partners and agricultural communities.</p></article></div></div></section></main>`,
  styles: pilotPageStyles
})
export class PilotNigeriaComponent {}

@Component({
  selector: 'app-pilot-tunisia',
  imports: [RouterModule],
  template: `<main class="pilot-page"><section class="pilot-hero tunisia"><div class="hero-content"><a routerLink="/about" class="breadcrumb">BRIDGE-AI / Pilot Regions</a><span class="eyebrow">Tunisia pilot</span><h1>Pasture &amp; <em>Pomegranate</em></h1><p>Decision support for pasture communities and pomegranate growers managing water, weather and crop conditions.</p><a routerLink="/about" fragment="countries" class="button">Back to pilot regions <span aria-hidden="true">&#8594;</span></a></div></section><section class="content-section"><div class="content-container"><div class="intro"><span class="eyebrow">The focus</span><h2>Local insight for water-smart agriculture</h2><p>BRIDGE-AI brings environmental information and digital tools closer to farming decisions in Tunisia, supporting pasture management, irrigation and crop planning.</p></div><div class="feature-grid"><article><img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&amp;fit=crop&amp;w=900&amp;q=85" alt="Pasture landscape in Tunisia" loading="lazy"><h3>Pasture intelligence</h3><p>Understand pasture growth and changing environmental conditions.</p></article><article><img src="https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&amp;fit=crop&amp;w=900&amp;q=85" alt="Pomegranate orchard in Tunisia" loading="lazy"><h3>Crop planning</h3><p>Support irrigation, crop care and harvest planning with data.</p></article><article><img src="https://images.unsplash.com/photo-1523742810366-5a8d2a8c5f1a?auto=format&amp;fit=crop&amp;w=900&amp;q=85" alt="Agricultural landscape and field work" loading="lazy"><h3>Shared learning</h3><p>Validate tools with farmers, researchers and local partners.</p></article></div></div></section></main>`,
  styles: pilotPageStyles
})
export class PilotTunisiaComponent {}