// ============================================================
// BRIDGE-AI Kenya - About Component
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP, FUNDING, PARTNER_GROUPS } from '../../../core/constants/app.constants';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, EuFundingBannerComponent],
  template: `
    <div class="about-page">
      <div class="container">
        <h1 class="page-title">About BRIDGE-AI</h1>

        <div class="content-section">
          <div class="content-card">
            <h2 class="section-heading">Project Overview</h2>
            <p class="section-text">{{ projectDescription }}</p>
            <div class="project-facts">
              <div class="fact-item">
                <span class="fact-label">Project Acronym</span>
                <span class="fact-value">{{ projectAcronym }}</span>
              </div>
              <div class="fact-item">
                <span class="fact-label">Grant Agreement</span>
                <span class="fact-value">{{ grantNumber }}</span>
              </div>
              <div class="fact-item">
                <span class="fact-label">Programme</span>
                <span class="fact-value">{{ programme }}</span>
              </div>
              <div class="fact-item">
                <span class="fact-label">Countries</span>
                <span class="fact-value">Kenya, Tunisia, Nigeria</span>
              </div>
            </div>
          </div>

          <div class="content-card">
            <h2 class="section-heading">Technology</h2>
            <p class="section-text">{{ technologyDescription }}</p>
            <ul class="tech-list">
              <li>Generative AI (GenAI) for predictive analytics</li>
              <li>IoT sensors for real-time environmental monitoring</li>
              <li>Digital Shadows for what-if scenario modeling</li>
              <li>Earth Observation data integration</li>
              <li>Semantic interoperability with FIWARE/NGSI-LD</li>
              <li>Low-bandwidth advisory interfaces</li>
            </ul>
          </div>

          <div class="content-card">
            <h2 class="section-heading">Countries of Implementation</h2>
            <div class="countries-grid">
              <div class="country-item">
                <span class="country-flag">🇰🇪</span>
                <span class="country-name">Kenya</span>
                <span class="country-role">Smart Mushroom Pilot</span>
              </div>
              <div class="country-item">
                <span class="country-flag">🇹🇳</span>
                <span class="country-name">Tunisia</span>
                <span class="country-role">Pomegranate Cultivation</span>
              </div>
              <div class="country-item">
                <span class="country-flag">🇳🇬</span>
                <span class="country-name">Nigeria</span>
                <span class="country-role">Maize & Pasture Production</span>
              </div>
            </div>
          </div>
        </div>

        <div class="eu-section">
          <app-eu-funding-banner></app-eu-funding-banner>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-page {
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

    .content-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .content-card {
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
      margin: 0 0 16px 0;
    }

    .project-facts {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 16px;
    }

    .fact-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .fact-label {
      font-size: 12px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .fact-value {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
    }

    .tech-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 16px;
    }

    .tech-list li {
      padding: 6px 0 6px 20px;
      position: relative;
      font-size: 14px;
      color: #4b5563;
    }

    .tech-list li::before {
      content: '▸';
      position: absolute;
      left: 0;
      color: #3b82f6;
      font-weight: 700;
    }

    .countries-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 12px;
    }

    .country-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .country-flag {
      font-size: 32px;
      margin-bottom: 4px;
    }

    .country-name {
      font-weight: 600;
      color: #1f2937;
    }

    .country-role {
      font-size: 13px;
      color: #6b7280;
    }

    .eu-section {
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .project-facts {
        grid-template-columns: repeat(2, 1fr);
      }

      .tech-list {
        grid-template-columns: 1fr;
      }

      .countries-grid {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 26px;
      }
    }
  `]
})
export class AboutComponent {
  protected projectDescription = `
    BRIDGE-AI - Building ResIlient Development with GEnerative AI in Education &
    Agriculture - is a Horizon Europe Research and Innovation Action that aims to
    improve African rural societies by integrating GenAI-based solutions into
    agricultural optimisation and digital skills acquisition. The project operates
    across Kenya, Tunisia and Nigeria and develops use cases in mushroom cultivation,
    maize production, pasture prediction and pomegranate cultivation.
  `;

  protected technologyDescription = `
    The project combines GenAI, Earth Observation data, IoT sensor measurements,
    digital shadows, semantic interoperability and low-bandwidth advisory interfaces.
    Its goal is to make context-specific agricultural decision support more accessible
    to farmers, agronomists, SMEs, developers and local innovation ecosystems.
  `;

  protected projectAcronym = APP.ACRONYM;
  protected grantNumber = FUNDING.GRANT_AGREEMENT;
  protected programme = FUNDING.PROGRAMME;
}