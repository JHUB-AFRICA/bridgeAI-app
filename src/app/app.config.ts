// ============================================================
// BRIDGE-AI Kenya - Application Configuration
// ============================================================

import { ApplicationConfig, Injectable, provideZoneChangeDetection } from '@angular/core';
import { ActivatedRouteSnapshot, provideRouter, RouterStateSnapshot, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

// Import HTTP Interceptor
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './features/core/services/http-interceptor.service';
import { APP } from './features/core/constants/app.constants';

@Injectable()
class AppTitleStrategy extends TitleStrategy {
  private readonly routeTitles: Record<string, string> = {
    '': 'Home', activities: 'Smart Mushroom Journey and News',
    'training-events': 'Smart Mushroom Training Events',
    'sme-mentoring': 'Smart Mushroom Enterprise Support', 'community-practice': 'Smart Mushroom Community',
    'replication-toolkit': 'Smart Mushroom Implementation Toolkit', resources: 'Smart Mushroom Resources',
    partners: 'JKUAT and Smart Mushroom Pilot Team', gallery: 'Smart Mushroom Visual Stories', contact: 'Contact Smart Mushroom Kenya Pilot',
    'smart-mushrooms': 'Smart Mushroom System', 'jkuat-role': 'JKUAT and Smart Mushroom Kenya Pilot',
    'privacy-ethics': 'Smart Mushroom Privacy and Ethics', admin: 'Admin Dashboard',
    'admin/login': 'Admin Login', '404': 'Page Not Found'
  };

  constructor(private readonly title: Title, private readonly meta: Meta) { super(); }

  override updateTitle(state: RouterStateSnapshot): void {
    const segments = this.getUrlSegments(state.root);
    const pageTitle = this.getPageTitle(segments);
    const siteTitle = 'BRIDGE-AI Smart Mushroom Kenya Pilot';
    this.title.setTitle(`${pageTitle} | ${siteTitle}`);
    this.meta.updateTag({ name: 'description', content: 'BRIDGE-AI Smart Mushroom Kenya Pilot at JKUAT: pumice growing rooms, IoT sensors, farmer training and remote dashboard monitoring.' });
  }

  private getUrlSegments(route: ActivatedRouteSnapshot): string[] {
    const segments: string[] = [];
    let current: ActivatedRouteSnapshot | null = route;
    while (current) {
      segments.push(...current.url.map(segment => segment.path));
      current = current.firstChild ?? null;
    }
    return segments;
  }

  private getPageTitle(segments: string[]): string {
    if (segments.length === 0) return this.routeTitles[''];
    const route = segments[0];
    const routeWithChild = segments.slice(0, 2).join('/');
    if (this.routeTitles[routeWithChild]) return this.routeTitles[routeWithChild];
    if (segments.length > 1) {
      return `${this.toTitleCase(segments[1])} | ${this.routeTitles[route] || this.toTitleCase(route)}`;
    }
    return this.routeTitles[route] || this.toTitleCase(route);
  }

  private toTitleCase(value: string): string {
    return decodeURIComponent(value).replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, character => character.toUpperCase()).slice(0, 52);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled'
    })),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    provideAnimations(),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    {
      provide: TitleStrategy,
      useClass: AppTitleStrategy
    }
  ]
};