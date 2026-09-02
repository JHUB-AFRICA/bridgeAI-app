// ============================================================
// BRIDGE-AI Kenya - Login Component
// ============================================================

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <img src="/images/logos/bridge_ai_logo.svg" alt="BRIDGE-AI Logo" class="login-logo" />
            <h1 class="login-title">BRIDGE-AI Kenya</h1>
            <p class="login-subtitle">Administration Panel</p>
          </div>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                [(ngModel)]="username"
                required
                class="form-control"
                placeholder="Enter your username"
                autocomplete="username"
                [disabled]="isLoading()"
              />
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="password"
                required
                class="form-control"
                placeholder="Enter your password"
                autocomplete="current-password"
                [disabled]="isLoading()"
              />
            </div>

            <div *ngIf="errorMessage()" class="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {{ errorMessage() }}
            </div>

            <button type="submit" class="btn-login" [disabled]="isLoading()">
              {{ isLoading() ? 'Logging in...' : 'Sign In' }}
            </button>
          </form>

          <div class="login-footer">
            <p class="grant-text">Grant Agreement No. 101299050</p>
            <p class="disclaimer-text">Funded by the European Union. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Health and Digital Executive Agency. Neither the European Union nor the granting authority can be held responsible for them.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a3a5c 0%, #2d6a9f 100%);
      padding: 20px;
    }

    .login-container {
      width: 100%;
      max-width: 420px;
    }

    .login-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 40px 36px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-logo {
      height: 60px;
      width: auto;
      margin-bottom: 12px;
    }

    .login-title {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 4px 0;
    }

    .login-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-group label {
      font-size: 13px;
      font-weight: 500;
      color: #374151;
    }

    .form-control {
      padding: 10px 14px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-control:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #fef2f2;
      border-radius: 8px;
      color: #991b1b;
      font-size: 14px;
    }

    .error-message svg {
      flex-shrink: 0;
      stroke: #ef4444;
    }

    .btn-login {
      padding: 12px;
      background: #3b82f6;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 8px;
    }

    .btn-login:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login-footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #f3f4f6;
      text-align: center;
    }

    .grant-text {
      font-size: 12px;
      color: #6b7280;
      margin: 0 0 8px 0;
    }

    .disclaimer-text {
      font-size: 11px;
      color: #9ca3af;
      line-height: 1.5;
      margin: 0;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 28px 20px;
      }

      .login-title {
        font-size: 20px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isLoading = signal(false);
  errorMessage = signal('');
  returnUrl: string = '/admin';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';

    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage.set('Please enter your username and password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.errorMessage.set(response.message || 'Invalid credentials.');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Login failed. Please try again.');
      }
    });
  }
}