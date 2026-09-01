// ============================================================
// BRIDGE-AI Kenya - Not Found Component
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-page">
      <div class="container">
        <div class="error-content">
          <div class="error-code">404</div>
          <h1 class="error-title">Page Not Found</h1>
          <p class="error-description">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          <div class="error-actions">
            <a [routerLink]="['/']" class="btn-primary">Go to Homepage</a>
            <a [routerLink]="['/activities']" class="btn-secondary">Browse Activities</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      padding: 48px 20px;
    }

    .container {
      max-width: 640px;
      margin: 0 auto;
      text-align: center;
    }

    .error-content {
      padding: 40px;
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #f3f4f6;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    }

    .error-code {
      font-size: 80px;
      font-weight: 800;
      color: #3b82f6;
      line-height: 1;
      margin-bottom: 12px;
    }

    .error-title {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 12px 0;
    }

    .error-description {
      font-size: 16px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 28px 0;
    }

    .error-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn-primary {
      padding: 12px 28px;
      background: #3b82f6;
      color: #ffffff;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-secondary {
      padding: 12px 28px;
      background: #f3f4f6;
      color: #374151;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      border: 1px solid #e5e7eb;
      transition: background 0.2s;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    @media (max-width: 640px) {
      .error-content {
        padding: 28px 20px;
      }

      .error-code {
        font-size: 56px;
      }

      .error-title {
        font-size: 22px;
      }

      .error-actions {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class NotFoundComponent {}