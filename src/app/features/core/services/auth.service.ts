// ============================================================
// BRIDGE-AI Kenya - Authentication Service
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadSession();
  }

  private loadSession(): void {
    const token = this.getToken();
    const user = this.getUserFromStorage();

    if (token && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.clearSession();
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/admin/login`;

    return this.http.post<LoginResponse>(url, { username, password }).pipe(
      tap((response) => {
        if (response.success && response.user) {
          this.setSession(response.user, response.token);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed. Please check your credentials and try again.'));
      })
    );
  }

  logout(): Observable<any> {
    const url = `${environment.apiUrl}/admin/logout`;

    return this.http.post(url, {}).pipe(
      tap(() => {
        this.clearSession();
        this.router.navigate(['/admin/login']);
      }),
      catchError((error) => {
        console.error('Logout error:', error);
        this.clearSession();
        this.router.navigate(['/admin/login']);
        return throwError(() => new Error('Logout failed.'));
      })
    );
  }

  private setSession(user: User, token?: string): void {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    }

    localStorage.setItem(this.userKey, JSON.stringify(user));

    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.userKey);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isEditor(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'editor' || user?.role === 'admin';
  }

  isReviewer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'reviewer' || user?.role === 'admin' || user?.role === 'editor';
  }

  hasRole(role: 'admin' | 'editor' | 'reviewer' | 'viewer'): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy: Record<string, number> = {
      'admin': 4,
      'editor': 3,
      'reviewer': 2,
      'viewer': 1
    };

    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[role] || 0;

    return userLevel >= requiredLevel;
  }

  verifySession(): Observable<boolean> {
    const url = `${environment.apiUrl}/admin/verify`;

    return this.http.get<{ valid: boolean }>(url).pipe(
      map((response) => response.valid),
      catchError(() => {
        this.clearSession();
        return of(false);
      })
    );
  }

  refreshUser(): void {
    const token = this.getToken();
    if (!token) {
      this.clearSession();
      return;
    }

    const url = `${environment.apiUrl}/admin/session`;

    this.http.get<{ user: User }>(url).pipe(
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    ).subscribe({
      next: (response) => {
        if (response && response.user) {
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }
      },
      error: () => {
        this.clearSession();
      }
    });
  }
}