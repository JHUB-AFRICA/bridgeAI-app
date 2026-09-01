// ============================================================
// BRIDGE-AI Kenya - Community Submission Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { CommunitySubmission } from '../features/core/models/submission.model';

@Injectable({
  providedIn: 'root'
})
export class CommunitySubmissionService {
  constructor(private api: ApiService) {}

  getSubmissions(): Observable<CommunitySubmission[]> {
    return this.api.get<CommunitySubmission[]>(API_ENDPOINTS.COMMUNITY_SUBMISSIONS.GET_ALL);
  }

  getUnreadSubmissions(): Observable<CommunitySubmission[]> {
    return this.api.get<CommunitySubmission[]>(API_ENDPOINTS.COMMUNITY_SUBMISSIONS.GET_ALL, { is_read: false });
  }

  getSubmission(id: number): Observable<CommunitySubmission> {
    return this.api.getWithId<CommunitySubmission>(API_ENDPOINTS.COMMUNITY_SUBMISSIONS.GET_BY_ID, id);
  }

  markAsRead(id: number): Observable<CommunitySubmission> {
    return this.api.patch<CommunitySubmission>(API_ENDPOINTS.COMMUNITY_SUBMISSIONS.UPDATE(id), { is_read: true });
  }

  markAsResponded(id: number): Observable<CommunitySubmission> {
    return this.api.patch<CommunitySubmission>(API_ENDPOINTS.COMMUNITY_SUBMISSIONS.UPDATE(id), { is_responded: true });
  }

  deleteSubmission(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.COMMUNITY_SUBMISSIONS.DELETE(id));
  }

  clearAllSubmissions(): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.COMMUNITY_SUBMISSIONS.CLEAR_ALL);
  }

  submitCommunityInterest(data: CommunitySubmission): Observable<CommunitySubmission> {
    return this.api.post<CommunitySubmission>(API_ENDPOINTS.COMMUNITY_SUBMISSIONS.CREATE, data);
  }
}