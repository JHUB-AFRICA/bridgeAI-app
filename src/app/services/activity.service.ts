// ============================================================
// BRIDGE-AI Kenya - Activity Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { Activity, ActivityFilterParams, ActivityTypeCount } from '../features/core/models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(private api: ApiService) {}

  getActivities(): Observable<Activity[]> {
    return this.api.get<Activity[]>(API_ENDPOINTS.ACTIVITIES.GET_ALL);
  }

  getFilteredActivities(params: ActivityFilterParams): Observable<Activity[]> {
    return this.api.get<Activity[]>(API_ENDPOINTS.ACTIVITIES.FILTERED, params);
  }

  getActivity(id: number): Observable<Activity> {
    return this.api.getWithId<Activity>(API_ENDPOINTS.ACTIVITIES.GET_BY_ID, id);
  }

  getActivityBySlug(slug: string): Observable<Activity> {
    return this.api.get<Activity>(API_ENDPOINTS.ACTIVITIES.GET_BY_SLUG(slug));
  }

  createActivity(activity: FormData): Observable<Activity> {
    return this.api.postFormData<Activity>(API_ENDPOINTS.ACTIVITIES.CREATE, activity);
  }

  createActivityJson(activity: Partial<Activity>): Observable<Activity> {
    return this.api.post<Activity>(API_ENDPOINTS.ACTIVITIES.CREATE, activity);
  }

  updateActivity(id: number, activity: FormData): Observable<Activity> {
    return this.api.putFormData<Activity>(API_ENDPOINTS.ACTIVITIES.UPDATE(id), activity);
  }

  updateActivityJson(id: number, activity: Partial<Activity>): Observable<Activity> {
    return this.api.put<Activity>(API_ENDPOINTS.ACTIVITIES.UPDATE(id), activity);
  }

  deleteActivity(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.ACTIVITIES.DELETE(id));
  }

  getActivityTypeCounts(): Observable<ActivityTypeCount[]> {
    return this.api.get<ActivityTypeCount[]>('/activities/type-counts');
  }
}