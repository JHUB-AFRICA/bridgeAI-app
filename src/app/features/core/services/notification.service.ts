// ============================================================
// BRIDGE-AI Kenya - Notification Service
// ============================================================

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  private clearSubject = new Subject<void>();
  private notificationId = 0;

  notifications$: Observable<Notification> = this.notificationSubject.asObservable();
  clear$: Observable<void> = this.clearSubject.asObservable();

  showSuccess(message: string, title?: string, duration?: number): void {
    this.show('success', message, title, duration);
  }

  showError(message: string, title?: string, duration?: number): void {
    this.show('error', message, title, duration);
  }

  showWarning(message: string, title?: string, duration?: number): void {
    this.show('warning', message, title, duration);
  }

  showInfo(message: string, title?: string, duration?: number): void {
    this.show('info', message, title, duration);
  }

  private show(
    type: Notification['type'],
    message: string,
    title?: string,
    duration: number = 5000
  ): void {
    const notification: Notification = {
      id: ++this.notificationId,
      type,
      message,
      title,
      duration
    };
    this.notificationSubject.next(notification);
  }

  clear(): void {
    this.clearSubject.next();
  }

  clearNotification(id: number): void {
    this.clearSubject.next();
  }

  showHttpError(error: any): void {
    let message = 'An error occurred. Please try again.';

    if (error?.error?.message) {
      message = error.error.message;
    } else if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    this.showError(message);
  }
}