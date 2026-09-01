// ============================================================
// BRIDGE-AI Kenya - SME Submission Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { SMESubmission } from '../features/core/models/submission.model';

@Injectable({
  providedIn: 'root'
})
export class SmeSubmissionService {
  constructor(private api: ApiService) {}

  getSubmissions(): Observable<SMESubmission[]> {
    return this.api.get<SMESubmission[]>(API_ENDPOINTS.SME_SUBMISSIONS.GET_ALL);
  }

  getUnreadSubmissions(): Observable<SMESubmission[]> {
    return this.api.get<SMESubmission[]>(API_ENDPOINTS.SME_SUBMISSIONS.GET_ALL, { is_read: false });
  }

  getSubmission(id: number): Observable<SMESubmission> {
    return this.api.getWithId<SMESubmission>(API_ENDPOINTS.SME_SUBMISSIONS.GET_BY_ID, id);
  }

  markAsRead(id: number): Observable<SMESubmission> {
    return this.api.patch<SMESubmission>(API_ENDPOINTS.SME_SUBMISSIONS.UPDATE(id), { is_read: true });
  }

  markAsResponded(id: number): Observable<SMESubmission> {
    return this.api.patch<SMESubmission>(API_ENDPOINTS.SME_SUBMISSIONS.UPDATE(id), { is_responded: true });
  }

  deleteSubmission(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.SME_SUBMISSIONS.DELETE(id));
  }

  clearAllSubmissions(): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.SME_SUBMISSIONS.CLEAR_ALL);
  }

  submitSMEInterest(data: SMESubmission): Observable<SMESubmission> {
    return this.api.post<SMESubmission>(API_ENDPOINTS.SME_SUBMISSIONS.CREATE, data);
  }
}