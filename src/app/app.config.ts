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
    '': 'Home', about: 'About BRIDGE-AI', activities: 'Activities and News',
    'training-wp5': 'Training and WP5', 'training-events': 'Training Events',
    'sme-mentoring': 'SME Mentoring', 'community-practice': 'Community of Practice',
    'replication-toolkit': 'Replication Toolkit', resources: 'Resources',
    partners: 'Project Partners', gallery: 'Project Gallery', contact: 'Contact BRIDGE-AI',
    'smart-mushrooms': 'Smart Mushroom Pilot', 'pilot-nigeria': 'Nigeria Pilot',
    'pilot-tunisia': 'Tunisia Pilot', 'jkuat-role': 'JKUAT and BRIDGE-AI',
    'privacy-ethics': 'Privacy and Ethics', admin: 'Admin Dashboard',
    'admin/login': 'Admin Login', '404': 'Page Not Found'
  };

  constructor(private readonly title: Title, private readonly meta: Meta) { super(); }

  override updateTitle(state: RouterStateSnapshot): void {
    const segments = this.getUrlSegments(state.root);
    const pageTitle = this.getPageTitle(segments);
    this.title.setTitle(`${pageTitle} | ${APP.NAME}`);
    this.meta.updateTag({ name: 'description', content: APP.DESCRIPTION });
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