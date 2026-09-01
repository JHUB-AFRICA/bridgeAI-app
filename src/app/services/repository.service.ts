// ============================================================
// BRIDGE-AI Kenya - Repository Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { Repository } from '../features/core/models/repository.model';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  constructor(private api: ApiService) {}

  getRepositories(): Observable<Repository[]> {
    return this.api.get<Repository[]>(API_ENDPOINTS.REPOSITORIES.GET_ALL);
  }

  getPublishedRepositories(): Observable<Repository[]> {
    return this.api.get<Repository[]>(API_ENDPOINTS.REPOSITORIES.GET_ALL, { is_published: true });
  }

  getRepository(id: number): Observable<Repository> {
    return this.api.getWithId<Repository>(API_ENDPOINTS.REPOSITORIES.GET_BY_ID, id);
  }

  createRepository(repository: Partial<Repository>): Observable<Repository> {
    return this.api.post<Repository>(API_ENDPOINTS.REPOSITORIES.CREATE, repository);
  }

  updateRepository(id: number, repository: Partial<Repository>): Observable<Repository> {
    return this.api.put<Repository>(API_ENDPOINTS.REPOSITORIES.UPDATE(id), repository);
  }

  deleteRepository(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.REPOSITORIES.DELETE(id));
  }
}