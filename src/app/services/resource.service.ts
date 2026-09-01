// ============================================================
// BRIDGE-AI Kenya - Resource Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { Resource, ResourceFilterParams } from '../features/core/models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  constructor(private api: ApiService) {}

  getResources(): Observable<Resource[]> {
    return this.api.get<Resource[]>(API_ENDPOINTS.RESOURCES.GET_ALL);
  }

  getFilteredResources(params: ResourceFilterParams): Observable<Resource[]> {
    return this.api.get<Resource[]>(API_ENDPOINTS.RESOURCES.GET_ALL, params);
  }

  getResource(id: number): Observable<Resource> {
    return this.api.getWithId<Resource>(API_ENDPOINTS.RESOURCES.GET_BY_ID, id);
  }

  getResourceBySlug(slug: string): Observable<Resource> {
    return this.api.get<Resource>(API_ENDPOINTS.RESOURCES.GET_BY_SLUG(slug));
  }

  createResource(resource: FormData): Observable<Resource> {
    return this.api.postFormData<Resource>(API_ENDPOINTS.RESOURCES.CREATE, resource);
  }

  createResourceJson(resource: Partial<Resource>): Observable<Resource> {
    return this.api.post<Resource>(API_ENDPOINTS.RESOURCES.CREATE, resource);
  }

  updateResource(id: number, resource: FormData): Observable<Resource> {
    return this.api.putFormData<Resource>(API_ENDPOINTS.RESOURCES.UPDATE(id), resource);
  }

  updateResourceJson(id: number, resource: Partial<Resource>): Observable<Resource> {
    return this.api.put<Resource>(API_ENDPOINTS.RESOURCES.UPDATE(id), resource);
  }

  deleteResource(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.RESOURCES.DELETE(id));
  }

  incrementDownloadCount(id: number): Observable<Resource> {
    return this.api.post<Resource>(`/resources/${id}/download`, {});
  }
}