// ============================================================
// BRIDGE-AI Kenya - Header Component
// ============================================================

import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { APP } from '../../../core/constants/app.constants';

interface NavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="site-header" role="banner">
      <div class="header-container">
        <div class="header-left">
          <div class="logo-group">
            <a [routerLink]="['/']" class="logo" aria-label="BRIDGE-AI home">
              <img src="/images/logos/bridge_ai_logo.svg" alt="BRIDGE-AI Logo" class="logo-img bridge-logo" />
            </a>
            <img src="/images/logos/eu_emblem.svg" alt="European Union emblem" class="logo-img eu-logo" />
          </div>
        </div>

        <div class="brand-center" aria-label="BRIDGE-AI Kenya">BRIDGE-AI Kenya</div>

        <button class="mobile-toggle" type="button" (click)="toggleMobileMenu()" aria-label="Toggle navigation" aria-expanded="{{ mobileOpen }}">
          @if (!mobileOpen) {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          } @else {
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          }
        </button>

        <nav class="main-nav" [class.open]="mobileOpen" aria-label="Main navigation">
          <ul class="nav-list">
            @for (item of navItems; track item.path) {
              <li class="nav-item">
                <a [routerLink]="[item.path]" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: false }" (click)="closeMobileMenu()">
                  {{ item.label }}
                </a>
              </li>
            }
            @if (isLoggedIn()) {
              <li class="nav-item admin-link">
                <a [routerLink]="['/admin']" routerLinkActive="active" class="admin-link-btn" (click)="closeMobileMenu()">
                  Dashboard
                </a>
              </li>
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }

    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #e8edf2;
      box-shadow: 0 4px 18px rgba(8, 32, 45, 0.04);
    }

    .header-container {
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      position: relative;
      min-height: 92px;
    }

    .header-left {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      z-index: 2;
    }

    .logo-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
    }

    .logo-img {
      display: block;
      width: auto;
      height: 56px;
    }

    .bridge-logo {
      height: 56px;
      max-width: 240px;
      object-fit: contain;
    }

    .eu-logo {
      height: 46px;
      max-width: 130px;
      object-fit: contain;
      opacity: 1;
      filter: drop-shadow(0 1px 0 rgba(15, 23, 42, 0.04));
    }

    .brand-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      color: #0b4d3b;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      white-space: nowrap;
      pointer-events: none;
      z-index: 1;
      display: none;
    }

    .main-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      z-index: 2;
    }

    .nav-list {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 6px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      padding: 8px 12px;
      color: #243742;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: none;
      border-radius: 999px;
      transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
      position: relative;
    }

    .nav-item a::after {
      content: '';
      position: absolute;
      left: 12px;
      right: 12px;
      bottom: 5px;
      height: 2px;
      border-radius: 999px;
      background: #0b4d3b;
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.25s ease;
    }

    .nav-item a:hover {
      color: #0b4d3b;
      background: rgba(11, 77, 59, 0.06);
      transform: translateY(-1px);
    }

    .nav-item a:hover::after,
    .nav-item a.active::after {
      transform: scaleX(1);
    }

    .nav-item a.active {
      color: #0b4d3b;
      background: rgba(11, 77, 59, 0.08);
      box-shadow: inset 0 0 0 1px rgba(11, 77, 59, 0.08);
    }

    .admin-link-btn {
      color: #0b4d3b !important;
      font-weight: 700;
    }

    .mobile-toggle {
      display: none;
      background: transparent;
      border: 1px solid #dfe7ee;
      border-radius: 10px;
      color: #1a2a35;
      width: 42px;
      height: 42px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease;
      z-index: 2;
    }

    .mobile-toggle:hover {
      background: rgba(11, 77, 59, 0.04);
      border-color: #cfe0d7;
    }

    .nav-item a:focus-visible,
    .mobile-toggle:focus-visible {
      outline: 2px solid #0b4d3b;
      outline-offset: 3px;
      border-radius: 999px;
    }

    @media (max-width: 1100px) {
      .header-container {
        padding-inline: 18px;
      }

      .nav-item a {
        padding: 7px 10px;
        font-size: 0.74rem;
      }
    }

    @media (max-width: 980px) {
      .site-header {
        border-bottom-color: #edf2f6;
      }

      .brand-center {
        display: none;
      }

      .mobile-toggle {
        display: inline-flex;
      }

      .header-container {
        position: relative;
      }

      .main-nav {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        padding: 14px 18px 20px;
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid #edf2f6;
        border-top: none;
        box-shadow: 0 20px 30px rgba(8, 32, 45, 0.08);
        display: none;
      }

      .main-nav.open {
        display: flex;
      }

      .nav-list {
        width: 100%;
        flex-direction: column;
        align-items: stretch;
        gap: 4px;
      }

      .nav-item a {
        width: 100%;
        justify-content: flex-start;
        padding: 12px 14px;
        font-size: 0.88rem;
        border-radius: 10px;
      }

      .nav-item a::after {
        left: 14px;
        right: 14px;
      }
    }

    @media (max-width: 640px) {
      .header-container {
        padding: 12px 16px;
        min-height: 78px;
      }

      .header-left {
        flex: 1;
      }

      .logo-group {
        gap: 8px;
      }

      .logo-img {
        height: 40px;
      }

      .bridge-logo {
        height: 44px;
        max-width: 170px;
      }

      .eu-logo {
        height: 32px;
        max-width: 74px;
      }

      .main-nav {
        padding-inline: 14px;
      }
    }
  `]
})
export class HeaderComponent {
  protected appName = APP.ACRONYM + ' Kenya';
  protected mobileOpen = false;

  protected navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/jkuat-role', label: 'JKUAT Role' },
    { path: '/smart-mushrooms', label: 'Smart Mushrooms' },
    { path: '/activities', label: 'Activities' },
    { path: '/training-wp5', label: 'Training & WP5' },
    { path: '/resources', label: 'Resources' },
    { path: '/partners', label: 'Partners' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' }
  ];

  constructor(private authService: AuthService) {}

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 980) {
      this.mobileOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobileMenu(): void {
    this.mobileOpen = false;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}