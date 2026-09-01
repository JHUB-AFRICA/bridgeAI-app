// ============================================================
// BRIDGE-AI Kenya - Success Story Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { SuccessStory } from '../features/core/models/success-story.model';

@Injectable({
  providedIn: 'root'
})
export class SuccessStoryService {
  constructor(private api: ApiService) {}

  getStories(): Observable<SuccessStory[]> {
    return this.api.get<SuccessStory[]>(API_ENDPOINTS.SUCCESS_STORIES.GET_ALL);
  }

  getPublishedStories(): Observable<SuccessStory[]> {
    return this.api.get<SuccessStory[]>(API_ENDPOINTS.SUCCESS_STORIES.GET_ALL, { is_published: true });
  }

  getStory(id: number): Observable<SuccessStory> {
    return this.api.getWithId<SuccessStory>(API_ENDPOINTS.SUCCESS_STORIES.GET_BY_ID, id);
  }

  createStory(story: FormData): Observable<SuccessStory> {
    return this.api.postFormData<SuccessStory>(API_ENDPOINTS.SUCCESS_STORIES.CREATE, story);
  }

  createStoryJson(story: Partial<SuccessStory>): Observable<SuccessStory> {
    return this.api.post<SuccessStory>(API_ENDPOINTS.SUCCESS_STORIES.CREATE, story);
  }

  updateStory(id: number, story: FormData): Observable<SuccessStory> {
    return this.api.putFormData<SuccessStory>(API_ENDPOINTS.SUCCESS_STORIES.UPDATE(id), story);
  }

  updateStoryJson(id: number, story: Partial<SuccessStory>): Observable<SuccessStory> {
    return this.api.put<SuccessStory>(API_ENDPOINTS.SUCCESS_STORIES.UPDATE(id), story);
  }

  deleteStory(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.SUCCESS_STORIES.DELETE(id));
  }
}