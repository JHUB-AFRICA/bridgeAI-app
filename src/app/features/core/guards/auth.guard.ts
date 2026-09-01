// ============================================================
// BRIDGE-AI Kenya - Authentication Guard
// ============================================================

import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication('/admin');
  }

  private checkAuthentication(url: string): Observable<boolean | UrlTree> {
    const currentUser = this.authService.getCurrentUser();
    const isLoggedIn = this.authService.isLoggedIn();

    if (isLoggedIn && currentUser) {
      return of(true);
    }

    if (!isLoggedIn) {
      this.notificationService.showWarning('Please log in to access this page.');
      return of(this.router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: url } }));
    }

    return this.authService.verifySession().pipe(
      take(1),
      switchMap((isValid) => {
        if (isValid) {
          return of(true);
        } else {
          this.notificationService.showWarning('Your session has expired. Please log in again.');
          return of(this.router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: url } }));
        }
      }),
      catchError(() => {
        this.notificationService.showError('Authentication failed. Please log in again.');
        return of(this.router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: url } }));
      })
    );
  }
}