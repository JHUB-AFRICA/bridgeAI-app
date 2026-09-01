// ============================================================
// BRIDGE-AI Kenya - Event Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { Event, EventFilterParams } from '../features/core/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private api: ApiService) {}

  getEvents(): Observable<Event[]> {
    return this.api.get<Event[]>(API_ENDPOINTS.EVENTS.GET_ALL);
  }

  getFilteredEvents(params: EventFilterParams): Observable<Event[]> {
    return this.api.get<Event[]>(API_ENDPOINTS.EVENTS.GET_ALL, params);
  }

  getEvent(id: number): Observable<Event> {
    return this.api.getWithId<Event>(API_ENDPOINTS.EVENTS.GET_BY_ID, id);
  }

  getEventBySlug(slug: string): Observable<Event> {
    return this.api.get<Event>(API_ENDPOINTS.EVENTS.GET_BY_SLUG(slug));
  }

  createEvent(event: FormData): Observable<Event> {
    return this.api.postFormData<Event>(API_ENDPOINTS.EVENTS.CREATE, event);
  }

  createEventJson(event: Partial<Event>): Observable<Event> {
    return this.api.post<Event>(API_ENDPOINTS.EVENTS.CREATE, event);
  }

  updateEvent(id: number, event: FormData): Observable<Event> {
    return this.api.putFormData<Event>(API_ENDPOINTS.EVENTS.UPDATE(id), event);
  }

  updateEventJson(id: number, event: Partial<Event>): Observable<Event> {
    return this.api.put<Event>(API_ENDPOINTS.EVENTS.UPDATE(id), event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.EVENTS.DELETE(id));
  }

  getUpcomingEvents(): Observable<Event[]> {
    return this.api.get<Event[]>(API_ENDPOINTS.EVENTS.GET_ALL, { status: 'upcoming' });
  }
}