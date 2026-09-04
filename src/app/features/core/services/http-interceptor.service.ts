// ============================================================
// BRIDGE-AI Kenya - HTTP Interceptor Service
// ============================================================

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { HTTP_HEADERS, HTTP_STATUS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isCloudinaryRequest = request.url.includes('cloudinary.com');

    if (request.method === 'DELETE') {
      this.notificationService.showInfo('Deleting...');
    }

    let modifiedRequest = request;

    if (!isCloudinaryRequest) {
      const token = this.authService.getToken();
      if (token) {
        modifiedRequest = request.clone({
          setHeaders: {
            Authorization: `${HTTP_HEADERS.AUTH_HEADER_PREFIX} ${token}`
          }
        });
      }
    }

    return next.handle(modifiedRequest).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === HTTP_STATUS.CREATED) {
            this.notificationService.showSuccess('Resource created successfully');
          } else if (event.status === HTTP_STATUS.NO_CONTENT) {
            this.notificationService.showSuccess('Resource deleted successfully');
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred. Please try again.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Client error: ${error.error.message}`;
        } else {
          switch (error.status) {
            case HTTP_STATUS.UNAUTHORIZED:
              errorMessage = 'Your session has expired. Please log in again.';
              this.authService.logout();
              break;
            case HTTP_STATUS.FORBIDDEN:
              errorMessage = 'You do not have permission to perform this action.';
              break;
            case HTTP_STATUS.NOT_FOUND:
              errorMessage = 'The requested resource was not found.';
              break;
            case HTTP_STATUS.BAD_REQUEST:
              errorMessage = this.extractErrorMessage(error);
              break;
            case HTTP_STATUS.UNPROCESSABLE_ENTITY:
              errorMessage = this.extractValidationErrors(error);
              break;
            case HTTP_STATUS.INTERNAL_SERVER_ERROR:
              errorMessage = 'A server error occurred. Please try again later.';
              break;
            default:
              if (error.error?.message) {
                errorMessage = error.error.message;
              }
          }
        }

        this.notificationService.showError(errorMessage);

        return throwError(() => ({
          status: error.status,
          message: errorMessage,
          error: error.error
        }));
      })
    );
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.error?.error) {
      return error.error.error;
    }
    return 'Invalid request. Please check your input and try again.';
  }

  private extractValidationErrors(error: HttpErrorResponse): string {
    if (error.error?.errors) {
      const errors = error.error.errors;
      if (Array.isArray(errors)) {
        return errors.join(', ');
      }
      if (typeof errors === 'object') {
        const messages: string[] = [];
        for (const [field, msg] of Object.entries(errors)) {
          messages.push(`${field}: ${msg}`);
        }
        return messages.join('; ');
      }
    }
    if (error.error?.message) {
      return error.error.message;
    }
    return 'Validation failed. Please check your input.';
  }
}