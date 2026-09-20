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
    '': 'smart-mushroom farming', activities: 'smart-mushroom news & activities',
    'training-events': 'smart-mushroom training-events',
    'sme-mentoring': 'Support', 'community-practice': 'Community',
    'replication-toolkit': 'Toolkit', resources: 'smart-mushroom resources',
    partners: 'smart-mushroom team', gallery: 'smart-mushroom gallery', contact: 'Contact smart-mushroom Team',
    'smart-mushrooms': 'smart-mushroom farm setup', 'jkuat-role': 'JKUAT',
    'privacy-ethics': 'Privacy', admin: 'Admin Dashboard',
    'admin/login': 'Admin Login', '404': 'Page Not Found'
  };

  constructor(private readonly title: Title, private readonly meta: Meta) { super(); }

  override updateTitle(state: RouterStateSnapshot): void {
    const segments = this.getUrlSegments(state.root);
    const pageTitle = this.getPageTitle(segments);
    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: 'Smart Mushroom Kenya Pilot at JKUAT: growing rooms, IoT sensors, farmer training and remote dashboard monitoring.' });
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