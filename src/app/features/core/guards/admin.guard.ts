// ============================================================
// BRIDGE-AI Kenya - Admin Guard
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
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAdminAccess(state.url);
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
    return this.checkAdminAccess('/admin');
  }

  private checkAdminAccess(url: string): Observable<boolean | UrlTree> {
    const currentUser = this.authService.getCurrentUser();
    const isLoggedIn = this.authService.isLoggedIn();

    if (!isLoggedIn) {
      this.notificationService.showWarning('Please log in to access the admin area.');
      return of(this.router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: url } }));
    }

    if (currentUser && this.authService.isAdmin()) {
      return of(true);
    }

    if (currentUser && !this.authService.isAdmin()) {
      this.notificationService.showError('You do not have administrator privileges.');
      return of(this.router.createUrlTree(['/']));
    }

    return this.authService.verifySession().pipe(
      take(1),
      switchMap((isValid) => {
        if (!isValid) {
          this.notificationService.showWarning('Your session has expired. Please log in again.');
          return of(this.router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: url } }));
        }

        const verifiedUser = this.authService.getCurrentUser();
        if (verifiedUser && this.authService.isAdmin()) {
          return of(true);
        }

        this.notificationService.showError('You do not have administrator privileges.');
        return of(this.router.createUrlTree(['/']));
      }),
      catchError(() => {
        this.notificationService.showError('Authorization check failed. Please try again.');
        return of(this.router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: url } }));
      })
    );
  }
}