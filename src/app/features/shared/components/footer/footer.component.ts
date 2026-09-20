// ============================================================
// Smart Mushroom Kenya Pilot - Footer Component
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { APP, SOCIAL_LINKS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer-ultimate" role="contentinfo">
      <div class="footer-container">
        <div class="footer-logos-row" aria-label="Project partners">
          <div class="footer-logo-item footer-logo-item-bridge">
            <img src="/images/logos/mushlogo.jpeg" alt="Smart Mushroom Kenya Pilot" class="footer-logo footer-logo-bridge" loading="lazy" />
          </div>
          <a class="footer-logo-item footer-logo-item-eu" href="/partners/eu" aria-label="View the European Union grant page">
            <img src="/images/logos/eu_emblem.svg" alt="Funded by the European Union" class="footer-logo footer-logo-eu" loading="lazy" />
          </a>
          <a class="footer-logo-item footer-logo-item-partner" href="/partners/jkuat" aria-label="View the JKUAT partner page">
            <img src="/images/logos/jkuat_logo.svg" alt="Jomo Kenyatta University of Agriculture and Technology" class="footer-logo footer-logo-partner" loading="lazy" />
          </a>
          <a class="footer-logo-item footer-logo-item-partner" href="/partners/jhub" aria-label="View the JHUB Africa partner page">
            <img src="/images/logos/jhub_logo.svg" alt="JHUB Africa" class="footer-logo footer-logo-partner" loading="lazy" />
          </a>
          <a class="footer-logo-item footer-logo-item-partner footer-logo-item-mush" href="/partners/mush%26" aria-label="View the Mush& partner page">
            <img src="/images/logos/mush.jpeg" alt="Mush&" class="footer-logo footer-logo-partner footer-logo-mush" loading="lazy" />
          </a>
          <p class="footer-description">Smart Mushroom Kenya Pilot helps farmers build better growing rooms, understand their crop environment and use connected tools with confidence.</p>
        </div>

        <div class="footer-middle">
          <div class="footer-col">
            <h4 class="footer-col-title">Project</h4>
            <ul class="footer-col-links">
              <li><a [routerLink]="['/smart-mushrooms']">Mushroom farm</a></li>
              <li><a [routerLink]="['/partners']">JKUAT &amp; team</a></li>
              <li><a [routerLink]="['/privacy-ethics']">Privacy</a></li>
              <li><a [routerLink]="['/activities']">Journey &amp; news</a></li>
              <li><a [routerLink]="['/contact']">Contact</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">Activities</h4>
            <ul class="footer-col-links">
              <li><a [routerLink]="['/smart-mushrooms']">How it works</a></li>
              <li><a [routerLink]="['/training-events']">Training events</a></li>
              <li><a [routerLink]="['/activities']">Journey and updates</a></li>
              <li><a [routerLink]="['/gallery']">Gallery</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">Resources</h4>
            <ul class="footer-col-links">
              <li><a [routerLink]="['/resources']" [queryParams]="{ type: 'deliverable' }">Deliverables</a></li>
              <li><a [routerLink]="['/resources']">Training Materials</a></li>
              <li><a [routerLink]="['/resources']" [queryParams]="{ type: 'policy_brief' }">Policy Briefs</a></li>
              <li><a [routerLink]="['/resources']" [queryParams]="{ type: 'publication' }">Publications</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">Connect</h4>
            <ul class="footer-col-links">
              <li><a [routerLink]="['/contact']">Contact Us</a></li>
              <li>
                <a [href]="socialLinks.LINKEDIN" target="_blank" rel="noopener noreferrer">
                  <svg class="footer-social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="footer-copyright">
            © 2026 Smart Mushroom Kenya Pilot · JKUAT
          </p>
          <div class="footer-bottom-right">
            <span class="eu-mark" aria-label="Funded by the European Union">★ Funded by the European Union</span>
            <span class="footer-builders">
              Built by <a href="https://jhubafrica.com" target="_blank" rel="noopener noreferrer">JHUB Africa</a>
              <span class="footer-sep">·</span>
              <a href="https://www.bradon.space" target="_blank" rel="noopener noreferrer">B.M.M</a>
            </span>
            <a href="#top" class="footer-back-top" (click)="scrollToTop($event)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"/>
              </svg>
              <span>Back to Top</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }

    .footer-ultimate {
      --footer-bg: #ffffff;
      --footer-text: #061420;
      --footer-text-strong: #081a28;
      --footer-text-muted: #3a4a5a;
      --footer-text-light: #6a7a8a;
      --footer-border: #dce2e8;
      --footer-primary: #0b4d3b;
      --footer-primary-light: #1a7a5e;
      --footer-primary-dim: rgba(11, 77, 59, 0.06);
      --footer-shadow: 0 -4px 40px rgba(0, 0, 0, 0.04);
      --footer-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

      background: var(--footer-bg);
      padding: 48px 24px 20px;
      margin-top: 72px;
      font-family: var(--footer-font);
      border-top: 1px solid var(--footer-border);
      box-shadow: var(--footer-shadow);
      position: relative;
      color: var(--footer-text);
    }

    .footer-ultimate::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--footer-primary), var(--footer-primary-light), var(--footer-primary), transparent);
      opacity: 0.2;
    }

    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
    }

    .footer-logos-row {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-items: center;
      gap: 20px 32px;
      padding-bottom: 28px;
      border-bottom: 1px solid var(--footer-border);
    }

    .footer-logo-item {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      min-height: 82px;
    }

    .footer-logo-item-bridge {
      min-width: 0;
    }

    .footer-description {
      max-width: 520px;
      grid-column: 1 / -1;
      justify-self: center;
      margin: 0;
      color: var(--footer-text-muted);
      font-size: .82rem;
      line-height: 1.65;
      text-align: center;
    }

    .footer-logo {
      display: block;
      height: 58px;
      width: auto;
      opacity: 0.9;
      transition: opacity 0.3s ease, transform 0.3s ease;
      object-fit: contain;
    }

    .footer-logo:hover {
      opacity: 1;
      transform: scale(1.02);
    }

    .footer-logo-bridge {
      height: 78px;
    }

    .footer-logo-item-eu { min-width: 0; }
    .footer-logo-eu { height: 70px; }

    .footer-logo-item-partner {
      min-width: 0;
      min-height: 82px;
      padding: 6px 12px;
      border-radius: 8px;
      transition: background-color 0.25s ease, transform 0.25s ease;
    }

    .footer-logo-item-partner:hover {
      background: var(--footer-primary-dim);
      transform: translateY(-2px);
    }

    .footer-logo-item-partner:focus-visible {
      outline: 2px solid var(--footer-primary);
      outline-offset: 3px;
    }

    .footer-logo-item-mush {
      grid-column: 1 / -1;
      justify-self: center;
      width: min(100%, 220px);
    }

    .footer-logo-partner {
      height: 68px;
      max-width: 175px;
    }

    .footer-middle {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 32px;
      padding: 32px 0 28px;
      border-bottom: 1px solid var(--footer-border);
      text-align: center;
    }

    .footer-col {
      display: flex;
      flex-direction: column;
      gap: 2px;
      align-items: center;
    }

    .footer-col-title {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--footer-text-strong);
      margin: 0 0 12px 0;
      letter-spacing: 1px;
      text-transform: uppercase;
      opacity: 0.7;
    }

    .footer-col-title::after {
      content: '';
      display: block;
      width: 28px;
      height: 2.5px;
      background: var(--footer-primary);
      margin-top: 6px;
      border-radius: 2px;
    }

    .footer-col-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .footer-col-links a {
      color: var(--footer-text-muted);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 450;
      transition: all 0.25s ease;
      padding: 5px 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      position: relative;
      opacity: 0.8;
    }

    .footer-col-links a::before {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--footer-primary);
      transition: width 0.3s ease;
    }

    .footer-col-links a:hover {
      color: var(--footer-primary);
      opacity: 1;
      transform: translateY(-1px);
    }

    .footer-col-links a:hover::before {
      width: 100%;
    }

    .footer-social-icon {
      width: 16px;
      height: 16px;
      opacity: 0.5;
      flex-shrink: 0;
      transition: opacity 0.3s ease;
      color: var(--footer-text-muted);
    }

    .footer-col-links a:hover .footer-social-icon {
      opacity: 0.9;
      color: var(--footer-primary);
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 18px;
      flex-wrap: wrap;
      gap: 10px;
      text-align: left;
    }

    .footer-copyright {
      font-size: 0.75rem;
      font-weight: 450;
      color: var(--footer-text-muted);
      margin: 0;
      opacity: 0.7;
    }

    .footer-bottom-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .footer-builders {
      color: var(--footer-text-muted);
      font-size: .75rem;
      opacity: .7;
    }

    .footer-builders a {
      color: inherit;
      text-decoration: none;
    }

    .footer-builders a:hover {
      color: var(--footer-primary);
      opacity: 1;
    }

    .footer-badge {
      font-size: 0.55rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--footer-primary);
      background: var(--footer-primary-dim);
      padding: 3px 14px;
      border-radius: 40px;
      border: 1px solid rgba(11, 77, 59, 0.12);
      opacity: 0.8;
    }

    .footer-sep {
      color: var(--footer-border);
      font-size: 0.7rem;
      opacity: 0.5;
    }

    .footer-credit {
      font-size: 0.75rem;
      font-weight: 450;
      color: var(--footer-text-muted);
      margin: 0;
      opacity: 0.7;
    }

    .footer-back-top {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--footer-text-muted);
      text-decoration: none;
      font-size: 0.72rem;
      font-weight: 500;
      padding: 5px 14px 5px 10px;
      border-radius: 40px;
      background: var(--footer-primary-dim);
      border: 1px solid var(--footer-border);
      opacity: 0.7;
      transition: all 0.3s ease;
    }

    .footer-back-top svg {
      width: 14px;
      height: 14px;
      transition: transform 0.3s ease;
      color: var(--footer-text-muted);
    }

    .footer-back-top:hover {
      opacity: 1;
      color: var(--footer-primary);
      border-color: var(--footer-primary);
      background: var(--footer-primary-dim);
      transform: translateY(-2px);
    }

    .footer-back-top:hover svg {
      transform: translateY(-3px);
      color: var(--footer-primary);
    }

    .footer-col-links a:focus-visible,
    .footer-back-top:focus-visible {
      outline: 2px solid var(--footer-primary);
      outline-offset: 3px;
      border-radius: 2px;
    }

    @media (max-width: 1024px) {
      .footer-logos-row {
        gap: 16px 18px;
      }

      .footer-middle {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 28px;
      }

      .footer-logo-item {
        min-height: 72px;
      }

      .footer-logo-item-bridge {
        min-width: 0;
      }

    }

    @media (max-width: 768px) {
      .footer-ultimate {
        padding: 32px 16px 16px;
        margin-top: 48px;
      }

      .footer-logos-row {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px 12px;
        padding-bottom: 20px;
      }

      .footer-logo {
        height: 44px;
      }

      .footer-logo-bridge {
        height: 54px;
      }

      .footer-description {
        flex: 1 1 100%;
        max-width: 560px;
        text-align: center;
      }

      .footer-logo-eu {
        height: 48px;
      }

      .footer-logo-item-partner {
        min-width: 0;
        min-height: 58px;
      }

      .footer-logo-partner {
        height: 48px;
        max-width: 140px;
      }

      .footer-middle {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px;
        padding: 24px 0 20px;
        text-align: center;
      }

      .footer-col {
        align-items: center;
      }

      .footer-col-title::after {
        margin: 6px auto 0;
      }

      .footer-col-links {
        align-items: center;
      }

      .footer-col-links a {
        font-size: 0.8rem;
        padding: 4px 0;
      }

      .footer-col-links a::before {
        display: none;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
        gap: 6px;
      }

      .footer-bottom-right {
        justify-content: center;
      }

      .footer-copyright,
      .footer-credit {
        font-size: 0.7rem;
      }

      .footer-back-top span {
        display: none;
      }

      .footer-back-top svg {
        width: 18px;
        height: 18px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .footer-logo:hover,
      .footer-logo-item-partner:hover,
      .footer-col-links a:hover,
      .footer-back-top:hover,
      .footer-back-top:hover svg {
        transform: none !important;
      }

      .footer-col-links a::before,
      .footer-back-top,
      .footer-logo {
        transition: none !important;
      }
    }

    @media (prefers-contrast: high) {
      .footer-ultimate {
        border-top: 2px solid var(--footer-primary);
      }

      .footer-col-title::after {
        background: var(--footer-primary);
      }

      .footer-col-links a::before {
        background: var(--footer-primary);
      }

      .footer-badge {
        border-color: var(--footer-primary);
      }
    }

    @media print {
      .footer-ultimate {
        background: #ffffff !important;
        border-top: 1px solid #ddd !important;
        padding: 20px 0 !important;
        margin-top: 40px !important;
        box-shadow: none !important;
      }

      .footer-ultimate::before,
      .footer-back-top,
      .footer-social-icon,
      .footer-badge {
        display: none !important;
      }

      .footer-col-links a {
        color: #333 !important;
      }
    }
  `]
})
export class FooterComponent {
  protected appName = APP.ACRONYM;
  protected currentYear = new Date().getFullYear();
  protected socialLinks = SOCIAL_LINKS;

  scrollToTop(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}