// ============================================================
// BRIDGE-AI Kenya - Replication Lesson Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { ReplicationLesson } from '../features/core/models/replication-lesson.model';

@Injectable({
  providedIn: 'root'
})
export class ReplicationLessonService {
  constructor(private api: ApiService) {}

  getLessons(): Observable<ReplicationLesson[]> {
    return this.api.get<ReplicationLesson[]>(API_ENDPOINTS.REPLICATION_LESSONS.GET_ALL);
  }

  getPublishedLessons(): Observable<ReplicationLesson[]> {
    return this.api.get<ReplicationLesson[]>(API_ENDPOINTS.REPLICATION_LESSONS.GET_ALL, { is_published: true });
  }

  getLesson(id: number): Observable<ReplicationLesson> {
    return this.api.getWithId<ReplicationLesson>(API_ENDPOINTS.REPLICATION_LESSONS.GET_BY_ID, id);
  }

  getLessonBySlug(slug: string): Observable<ReplicationLesson> {
    return this.api.get<ReplicationLesson>(API_ENDPOINTS.REPLICATION_LESSONS.GET_BY_SLUG(slug));
  }

  createLesson(lesson: Partial<ReplicationLesson>): Observable<ReplicationLesson> {
    return this.api.post<ReplicationLesson>(API_ENDPOINTS.REPLICATION_LESSONS.CREATE, lesson);
  }

  updateLesson(id: number, lesson: Partial<ReplicationLesson>): Observable<ReplicationLesson> {
    return this.api.put<ReplicationLesson>(API_ENDPOINTS.REPLICATION_LESSONS.UPDATE(id), lesson);
  }

  deleteLesson(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.REPLICATION_LESSONS.DELETE(id));
  }
}