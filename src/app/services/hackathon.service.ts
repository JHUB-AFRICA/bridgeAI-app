// ============================================================
// BRIDGE-AI Kenya - Hackathon Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { Hackathon } from '../features/core/models/hackathon.model';

@Injectable({
  providedIn: 'root'
})
export class HackathonService {
  constructor(private api: ApiService) {}

  getHackathons(): Observable<Hackathon[]> {
    return this.api.get<Hackathon[]>(API_ENDPOINTS.HACKATHONS.GET_ALL);
  }

  getUpcomingHackathons(): Observable<Hackathon[]> {
    return this.api.get<Hackathon[]>(API_ENDPOINTS.HACKATHONS.GET_ALL, { status: 'upcoming' });
  }

  getPublishedHackathons(): Observable<Hackathon[]> {
    return this.api.get<Hackathon[]>(API_ENDPOINTS.HACKATHONS.GET_ALL, { is_published: true });
  }

  getHackathon(id: number): Observable<Hackathon> {
    return this.api.getWithId<Hackathon>(API_ENDPOINTS.HACKATHONS.GET_BY_ID, id);
  }

  createHackathon(hackathon: Partial<Hackathon>): Observable<Hackathon> {
    return this.api.post<Hackathon>(API_ENDPOINTS.HACKATHONS.CREATE, hackathon);
  }

  updateHackathon(id: number, hackathon: Partial<Hackathon>): Observable<Hackathon> {
    return this.api.put<Hackathon>(API_ENDPOINTS.HACKATHONS.UPDATE(id), hackathon);
  }

  deleteHackathon(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.HACKATHONS.DELETE(id));
  }
}