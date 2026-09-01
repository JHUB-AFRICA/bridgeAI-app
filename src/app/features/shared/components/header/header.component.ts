// ============================================================
// BRIDGE-AI Kenya - Header Component
// ============================================================

import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { APP } from '../../../core/constants/app.constants';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="site-header">
      <div class="header-container">
        <!-- Logo -->
        <div class="header-left">
          <a [routerLink]="['/']" class="logo">
            <img src="/assets/images/logos/bridge_ai_logo.svg" alt="BRIDGE-AI Logo" class="logo-img" />
            <span class="logo-text">{{ appName }}</span>
          </a>
        </div>

        <!-- Mobile Toggle -->
        <button class="mobile-toggle" (click)="toggleMobileMenu()" aria-label="Toggle navigation">
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

        <!-- Navigation -->
        <nav class="main-nav" [class.open]="mobileOpen">
          <ul class="nav-list">
            @for (item of navItems; track item.path) {
              <li class="nav-item">
                <a [routerLink]="[item.path]" routerLinkActive="active" (click)="closeMobileMenu()">
                  {{ item.label }}
                </a>
              </li>
            }
            @if (isLoggedIn()) {
              <li class="nav-item admin-link">
                <a [routerLink]="['/admin']" routerLinkActive="active" class="admin-link-btn" (click)="closeMobileMenu()">
                  <i class="fas fa-user-shield"></i>
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
    /* ================================================================ */
    /* HEADER                                                           */
    /* ================================================================ */
    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      height: 80px;
      display: flex;
      align-items: center;
    }

    .header-container {
      max-width: 1280px;
      width: 100%;
      margin: 0 auto;
      padding: 0 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Logo */
    .header-left {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      gap: 12px;
    }

    .logo-img {
      height: 40px;
      width: auto;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: -0.5px;
      font-family: 'Inter', sans-serif;
    }

    /* Mobile Toggle */
    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      color: #374151;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .mobile-toggle:hover {
      background: #f3f4f6;
    }

    /* Navigation */
    .main-nav {
      display: flex;
      align-items: center;
    }

    .nav-list {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 4px;
      align-items: center;
    }

    .nav-item a {
      display: block;
      padding: 8px 12px;
      color: #4b5563;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.2s;
      font-family: 'Inter', sans-serif;
    }

    .nav-item a:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .nav-item a.active {
      color: #3b82f6;
      background: #eff6ff;
    }

    .admin-link-btn {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .admin-link-btn i {
      font-size: 14px;
    }

    /* ================================================================ */
    /* RESPONSIVE                                                       */
    /* ================================================================ */
    @media (max-width: 1024px) {
      .mobile-toggle {
        display: block;
      }

      .main-nav {
        position: absolute;
        top: 80px;
        left: 0;
        right: 0;
        background: #ffffff;
        border-bottom: 1px solid #e5e7eb;
        padding: 16px 20px;
        display: none;
        flex-direction: column;
        align-items: stretch;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        max-height: calc(100vh - 80px);
        overflow-y: auto;
      }

      .main-nav.open {
        display: flex;
      }

      .nav-list {
        flex-direction: column;
        gap: 4px;
        width: 100%;
      }

      .nav-item a {
        padding: 12px 16px;
        width: 100%;
        font-size: 15px;
      }

      .admin-link {
        border-top: 1px solid #f3f4f6;
        padding-top: 8px;
        margin-top: 4px;
      }
    }

    @media (max-width: 640px) {
      .site-header {
        height: 64px;
      }

      .main-nav {
        top: 64px;
        max-height: calc(100vh - 64px);
      }

      .header-container {
        padding: 0 16px;
      }

      .logo-img {
        height: 32px;
      }

      .logo-text {
        font-size: 15px;
      }
    }

    @media (max-width: 480px) {
      .logo-text {
        font-size: 13px;
      }

      .logo-img {
        height: 28px;
      }
    }

    /* ================================================================ */
    /* FOCUS VISIBLE                                                    */
    /* ================================================================ */
    .nav-item a:focus-visible,
    .mobile-toggle:focus-visible {
      outline: 2px solid #7C4FA3;
      outline-offset: 2px;
    }
  `]
})
export class HeaderComponent {
  protected appName = APP.ACRONYM + ' Kenya';
  protected mobileOpen = false;

  protected navItems: NavItem[] = [
    { path: '/about', label: 'About', icon: 'fa-about' },
    { path: '/jkuat-role', label: 'JKUAT Role', icon: 'fa-role' },
    { path: '/smart-mushrooms', label: 'Smart Mushrooms', icon: 'fa-mushroom' },
    { path: '/activities', label: 'Activities', icon: 'fa-activities' },
    { path: '/training-wp5', label: 'Training & WP5', icon: 'fa-training' },
    { path: '/resources', label: 'Resources', icon: 'fa-resources' },
    { path: '/partners', label: 'Partners', icon: 'fa-partners' },
    { path: '/gallery', label: 'Gallery', icon: 'fa-gallery' },
    { path: '/contact', label: 'Contact', icon: 'fa-contact' }
  ];

  constructor(private authService: AuthService) {}

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 1024) {
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