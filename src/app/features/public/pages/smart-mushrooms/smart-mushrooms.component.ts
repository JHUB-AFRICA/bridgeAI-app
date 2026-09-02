// ============================================================
// BRIDGE-AI Kenya - Smart Mushrooms Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaqService } from '../../../../services/faq.service';
import { FAQ } from '../../../core/models/faq.model';
import { EuFundingBannerComponent } from '../../../shared/components/eu-funding-banner/eu-funding-banner.component';

@Component({
  selector: 'app-smart-mushrooms',
  imports: [CommonModule, RouterLink, EuFundingBannerComponent],
  templateUrl: './smart-mushrooms.component.html',
  styleUrl: './smart-mushrooms.component.css'
  /* template: `
    <div class="smart-mushrooms-page">
      <div class="container">
        <h1 class="page-title">Smart Mushrooms: Harnessing Generative AI for Sustainable Mushroom Farming in Kenya</h1>

        <div class="content-section">
          <div class="content-grid">
            <div class="main-content">
              <div class="content-card">
                <h2 class="section-heading">The Challenge</h2>
                <p class="section-text">
                  Mushroom farming in Kenya is commercially attractive but highly sensitive to environmental control.
                  Small-scale and peri-urban farms often rely on manual monitoring of temperature, humidity,
                  carbon dioxide and light. This can make it difficult to detect microclimate drift,
                  contamination risk, poor ventilation or conditions that reduce yield.
                </p>
              </div>

              <div class="content-card">
                <h2 class="section-heading">The Solution</h2>
                <p class="section-text">
                  Through BRIDGE-AI, JKUAT is exploring GenAI-based predictive analytics, real-time anomaly detection,
                  digital shadows of grow rooms, IoT sensing, low-bandwidth dashboards and multilingual virtual
                  assistance for farmer training and extension. The pilot supports a locally co-developed
                  Smart Mushroom ecosystem with farmers, researchers, youth, women and extension partners.
                </p>
              </div>

              <div class="content-card">
                <h2 class="section-heading">Technology Components</h2>
                <div class="tech-grid">
                  <div class="tech-item">
                    <span class="tech-icon">🧠</span>
                    <span class="tech-name">GenAI Predictive Analytics</span>
                  </div>
                  <div class="tech-item">
                    <span class="tech-icon">📡</span>
                    <span class="tech-name">IoT Sensors</span>
                  </div>
                  <div class="tech-item">
                    <span class="tech-icon">🔮</span>
                    <span class="tech-name">Digital Shadows</span>
                  </div>
                  <div class="tech-item">
                    <span class="tech-icon">📊</span>
                    <span class="tech-name">Low-Bandwidth Dashboards</span>
                  </div>
                  <div class="tech-item">
                    <span class="tech-icon">🌐</span>
                    <span class="tech-name">LoRaWAN/Edge Devices</span>
                  </div>
                  <div class="tech-item">
                    <span class="tech-icon">💬</span>
                    <span class="tech-name">Virtual Assistants</span>
                  </div>
                </div>
              </div>

              <div class="content-card">
                <h2 class="section-heading">Sensors Monitored</h2>
                <ul class="sensor-list">
                  <li>Temperature</li>
                  <li>Relative Humidity</li>
                  <li>Carbon Dioxide (CO₂)</li>
                  <li>Light Intensity</li>
                  <li>Substrate Moisture</li>
                  <li>Optional Outdoor Microclimate Data</li>
                </ul>
              </div>
            </div>

            <div class="sidebar">
              <div class="faq-card">
                <h3 class="faq-title">Frequently Asked Questions</h3>
                <div *ngFor="let faq of faqs()" class="faq-item">
                  <button class="faq-question" (click)="toggleFaq(faq.id)">
                    {{ faq.question }}
                    <span class="faq-toggle">{{ expandedFaqId === faq.id ? '−' : '+' }}</span>
                  </button>
                  <div *ngIf="expandedFaqId === faq.id" class="faq-answer">
                    <p>{{ faq.answer }}</p>
                  </div>
                </div>
              </div>

              <div class="cta-card">
                <h3 class="cta-title">Get Involved</h3>
                <p class="cta-text">Interested in the Smart Mushroom pilot?</p>
                <div class="cta-actions">
                  <a [routerLink]="['/contact']" class="btn-cta">Contact Us</a>
                </div>
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
    .smart-mushrooms-page {
      padding: 48px 0 64px 0;
      background: #f8fafc;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .page-title {
      font-size: 30px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 32px 0;
      line-height: 1.3;
    }

    .content-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .main-content {
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
      margin: 0;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 8px;
    }

    .tech-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 8px;
    }

    .tech-icon {
      font-size: 18px;
    }

    .tech-name {
      font-size: 14px;
      color: #1f2937;
    }

    .sensor-list {
      list-style: none;
      padding: 0;
      margin: 8px 0 0 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px 16px;
    }

    .sensor-list li {
      padding: 6px 0 6px 20px;
      position: relative;
      font-size: 14px;
      color: #4b5563;
    }

    .sensor-list li::before {
      content: '●';
      position: absolute;
      left: 0;
      color: #3b82f6;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .faq-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 24px 20px;
      border: 1px solid #f3f4f6;
    }

    .faq-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 16px 0;
    }

    .faq-item {
      border-bottom: 1px solid #f3f4f6;
    }

    .faq-item:last-child {
      border-bottom: none;
    }

    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 12px 0;
      background: none;
      border: none;
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
      cursor: pointer;
      text-align: left;
    }

    .faq-question:hover {
      color: #3b82f6;
    }

    .faq-toggle {
      font-size: 18px;
      color: #6b7280;
      flex-shrink: 0;
    }

    .faq-answer {
      padding: 0 0 12px 0;
    }

    .faq-answer p {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0;
    }

    .cta-card {
      background: linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%);
      border-radius: 12px;
      padding: 24px 20px;
      color: #ffffff;
      text-align: center;
    }

    .cta-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .cta-text {
      font-size: 14px;
      color: #93c5fd;
      margin: 0 0 16px 0;
    }

    .btn-cta {
      display: inline-block;
      padding: 10px 28px;
      background: #3b82f6;
      color: #ffffff;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.2s;
    }

    .btn-cta:hover {
      background: #2563eb;
    }

    .eu-section {
      margin-top: 24px;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 24px;
      }

      .tech-grid,
      .sensor-list {
        grid-template-columns: 1fr;
      }
    }
  `] */
})
export class SmartMushroomsComponent implements OnInit {
  protected faqs = signal<FAQ[]>([]);
  protected expandedFaqId: number | null = null;

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.faqService.getFaqsByAudience('farmers').subscribe({
      next: (faqs) => this.faqs.set(faqs.filter((faq) => faq.is_published)),
      error: () => this.faqs.set([])
    });
  }


  toggleFaq(id: number | undefined): void {
    if (id === undefined) return;
    this.expandedFaqId = this.expandedFaqId === id ? null : id;
  }
}