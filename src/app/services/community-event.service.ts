// ============================================================
// BRIDGE-AI Kenya - Community Event Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { CommunityEvent, CommunityEventFilterParams } from '../features/core/models/community-event.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityEventService {
  constructor(private api: ApiService) {}

  getEvents(): Observable<CommunityEvent[]> {
    return this.api.get<CommunityEvent[]>(API_ENDPOINTS.COMMUNITY_EVENTS.GET_ALL);
  }

  getFilteredEvents(params: CommunityEventFilterParams): Observable<CommunityEvent[]> {
    return this.api.get<CommunityEvent[]>(API_ENDPOINTS.COMMUNITY_EVENTS.GET_ALL, params);
  }

  getUpcomingEvents(): Observable<CommunityEvent[]> {
    return this.api.get<CommunityEvent[]>(API_ENDPOINTS.COMMUNITY_EVENTS.GET_ALL, { status: 'upcoming' });
  }

  getEvent(id: number): Observable<CommunityEvent> {
    return this.api.getWithId<CommunityEvent>(API_ENDPOINTS.COMMUNITY_EVENTS.GET_BY_ID, id);
  }

  createEvent(event: Partial<CommunityEvent>): Observable<CommunityEvent> {
    return this.api.post<CommunityEvent>(API_ENDPOINTS.COMMUNITY_EVENTS.CREATE, event);
  }

  updateEvent(id: number, event: Partial<CommunityEvent>): Observable<CommunityEvent> {
    return this.api.put<CommunityEvent>(API_ENDPOINTS.COMMUNITY_EVENTS.UPDATE(id), event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.COMMUNITY_EVENTS.DELETE(id));
  }
}