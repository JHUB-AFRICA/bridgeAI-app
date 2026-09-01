// ============================================================
// BRIDGE-AI Kenya - Submission Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { ContactSubmission, TrainingInterestSubmission, MediaRequestSubmission } from '../features/core/models/submission.model';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  constructor(private api: ApiService) {}

  getSubmissions(): Observable<any[]> {
    return this.api.get<any[]>(API_ENDPOINTS.SUBMISSIONS.GET_ALL);
  }

  getUnreadSubmissions(): Observable<any[]> {
    return this.api.get<any[]>(API_ENDPOINTS.SUBMISSIONS.GET_ALL, { is_read: false });
  }

  getSubmission(id: number): Observable<any> {
    return this.api.getWithId<any>(API_ENDPOINTS.SUBMISSIONS.GET_BY_ID, id);
  }

  markAsRead(id: number): Observable<any> {
    return this.api.patch<any>(API_ENDPOINTS.SUBMISSIONS.UPDATE(id), { is_read: true });
  }

  markAsResponded(id: number): Observable<any> {
    return this.api.patch<any>(API_ENDPOINTS.SUBMISSIONS.UPDATE(id), { is_responded: true });
  }

  deleteSubmission(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.SUBMISSIONS.DELETE(id));
  }

  clearAllSubmissions(): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.SUBMISSIONS.CLEAR_ALL);
  }

  submitContactForm(data: ContactSubmission): Observable<ContactSubmission> {
    return this.api.post<ContactSubmission>(API_ENDPOINTS.SUBMISSIONS.CREATE, data);
  }

  submitTrainingInterest(data: TrainingInterestSubmission): Observable<TrainingInterestSubmission> {
    return this.api.post<TrainingInterestSubmission>(API_ENDPOINTS.SUBMISSIONS.CREATE, data);
  }

  submitMediaRequest(data: MediaRequestSubmission): Observable<MediaRequestSubmission> {
    return this.api.post<MediaRequestSubmission>(API_ENDPOINTS.SUBMISSIONS.CREATE, data);
  }
}