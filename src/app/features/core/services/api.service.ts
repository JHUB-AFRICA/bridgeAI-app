// ============================================================
// BRIDGE-AI Kenya - Base API Service
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  public get<T>(endpoint: string, params?: HttpParams | Record<string, any>): Observable<T> {
    const url = this.buildUrl(endpoint);
    const options = params ? { params: this.buildParams(params) } : {};
    return this.http.get<T>(url, options);
  }

  public post<T>(endpoint: string, body: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.post<T>(url, body);
  }

  public put<T>(endpoint: string, body: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.put<T>(url, body);
  }

  public patch<T>(endpoint: string, body: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.patch<T>(url, body);
  }

  public delete<T>(endpoint: string): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.delete<T>(url);
  }

  public getWithId<T>(endpoint: (id: number | string) => string, id: number | string): Observable<T> {
    const url = this.buildUrl(endpoint(id));
    return this.http.get<T>(url);
  }

  public postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.post<T>(url, formData);
  }

  public putFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.http.put<T>(url, formData);
  }

  public buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  public buildParams(params: Record<string, any> | HttpParams): HttpParams {
    if (params instanceof HttpParams) {
      return params;
    }

    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }

  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  protected getFormDataHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json'
    });
  }
}