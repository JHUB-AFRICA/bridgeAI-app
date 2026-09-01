// ============================================================
// BRIDGE-AI Kenya - Challenge Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { Challenge } from '../features/core/models/challenge.model';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  constructor(private api: ApiService) {}

  getChallenges(): Observable<Challenge[]> {
    return this.api.get<Challenge[]>(API_ENDPOINTS.CHALLENGES.GET_ALL);
  }

  getOpenChallenges(): Observable<Challenge[]> {
    return this.api.get<Challenge[]>(API_ENDPOINTS.CHALLENGES.GET_ALL, { status: 'open' });
  }

  getPublishedChallenges(): Observable<Challenge[]> {
    return this.api.get<Challenge[]>(API_ENDPOINTS.CHALLENGES.GET_ALL, { is_published: true });
  }

  getChallenge(id: number): Observable<Challenge> {
    return this.api.getWithId<Challenge>(API_ENDPOINTS.CHALLENGES.GET_BY_ID, id);
  }

  createChallenge(challenge: Partial<Challenge>): Observable<Challenge> {
    return this.api.post<Challenge>(API_ENDPOINTS.CHALLENGES.CREATE, challenge);
  }

  updateChallenge(id: number, challenge: Partial<Challenge>): Observable<Challenge> {
    return this.api.put<Challenge>(API_ENDPOINTS.CHALLENGES.UPDATE(id), challenge);
  }

  deleteChallenge(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.CHALLENGES.DELETE(id));
  }
}