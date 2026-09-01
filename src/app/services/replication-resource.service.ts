// ============================================================
// BRIDGE-AI Kenya - Replication Resource Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { ReplicationResource } from '../features/core/models/replication-resource.model';

@Injectable({
  providedIn: 'root'
})
export class ReplicationResourceService {
  constructor(private api: ApiService) {}

  getResources(): Observable<ReplicationResource[]> {
    return this.api.get<ReplicationResource[]>(API_ENDPOINTS.REPLICATION_RESOURCES.GET_ALL);
  }

  getPublicResources(): Observable<ReplicationResource[]> {
    return this.api.get<ReplicationResource[]>(API_ENDPOINTS.REPLICATION_RESOURCES.GET_ALL, { is_public: true });
  }

  getResource(id: number): Observable<ReplicationResource> {
    return this.api.getWithId<ReplicationResource>(API_ENDPOINTS.REPLICATION_RESOURCES.GET_BY_ID, id);
  }

  createResource(resource: FormData): Observable<ReplicationResource> {
    return this.api.postFormData<ReplicationResource>(API_ENDPOINTS.REPLICATION_RESOURCES.CREATE, resource);
  }

  createResourceJson(resource: Partial<ReplicationResource>): Observable<ReplicationResource> {
    return this.api.post<ReplicationResource>(API_ENDPOINTS.REPLICATION_RESOURCES.CREATE, resource);
  }

  updateResource(id: number, resource: FormData): Observable<ReplicationResource> {
    return this.api.putFormData<ReplicationResource>(API_ENDPOINTS.REPLICATION_RESOURCES.UPDATE(id), resource);
  }

  updateResourceJson(id: number, resource: Partial<ReplicationResource>): Observable<ReplicationResource> {
    return this.api.put<ReplicationResource>(API_ENDPOINTS.REPLICATION_RESOURCES.UPDATE(id), resource);
  }

  deleteResource(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.REPLICATION_RESOURCES.DELETE(id));
  }
}