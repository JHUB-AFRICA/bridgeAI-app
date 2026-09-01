// ============================================================
// BRIDGE-AI Kenya - Footer Component
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { APP, FUNDING, SOCIAL_LINKS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-section">
            <h3 class="footer-title">{{ appName }}</h3>
            <p class="footer-description">{{ appDescription }}</p>
            <div class="footer-socials">
              <a *ngIf="socialLinks.LINKEDIN" [href]="socialLinks.LINKEDIN" target="_blank" rel="noopener" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a *ngIf="socialLinks.YOUTUBE" [href]="socialLinks.YOUTUBE" target="_blank" rel="noopener" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a *ngIf="socialLinks.GITHUB" [href]="socialLinks.GITHUB" target="_blank" rel="noopener" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-section">
            <h4 class="footer-subtitle">Quick Links</h4>
            <ul class="footer-links">
              <li><a [routerLink]="['/about']">About BRIDGE-AI</a></li>
              <li><a [routerLink]="['/smart-mushrooms']">Smart Mushrooms</a></li>
              <li><a [routerLink]="['/activities']">Activities</a></li>
              <li><a [routerLink]="['/resources']">Resources</a></li>
              <li><a [routerLink]="['/contact']">Contact</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-subtitle">Contact</h4>
            <ul class="footer-contact">
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:bridge-ai@jkuat.ac.ke">bridge-ai@jkuat.ac.ke</a>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>JKUAT Smart Farm Zone, Juja, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="footer-copy">&copy; {{ currentYear }} {{ appName }}. All rights reserved.</p>
          <div class="footer-legal">
            <a [routerLink]="['/privacy-ethics']">Privacy &amp; Ethics</a>
            <span class="separator">|</span>
            <span class="grant-text">{{ grantNumber }}</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #111827;
      color: #9ca3af;
      padding: 48px 0 24px 0;
      margin-top: 48px;
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .footer-top {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 40px;
      padding-bottom: 32px;
      border-bottom: 1px solid #1f2937;
    }

    .footer-section {
      display: flex;
      flex-direction: column;
    }

    .footer-title {
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 8px 0;
    }

    .footer-description {
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }

    .footer-socials {
      display: flex;
      gap: 12px;
    }

    .footer-socials a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: #1f2937;
      border-radius: 50%;
      color: #9ca3af;
      transition: all 0.2s;
    }

    .footer-socials a:hover {
      background: #374151;
      color: #ffffff;
    }

    .footer-subtitle {
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      margin: 0 0 12px 0;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .footer-links a {
      color: #9ca3af;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s;
    }

    .footer-links a:hover {
      color: #ffffff;
    }

    .footer-contact {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .footer-contact li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }

    .footer-contact a {
      color: #9ca3af;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-contact a:hover {
      color: #ffffff;
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      font-size: 13px;
    }

    .footer-legal {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .footer-legal a {
      color: #9ca3af;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-legal a:hover {
      color: #ffffff;
    }

    .separator {
      color: #4b5563;
    }

    .grant-text {
      color: #6b7280;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .footer-top {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  protected appName = APP.ACRONYM + ' Kenya';
  protected appDescription = APP.DESCRIPTION;
  protected grantNumber = FUNDING.GRANT_AGREEMENT;
  protected currentYear = new Date().getFullYear();
  protected socialLinks = SOCIAL_LINKS;
}