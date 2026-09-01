// ============================================================
// BRIDGE-AI Kenya - Replication Template Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { ReplicationTemplate } from '../features/core/models/replication-template.model';

@Injectable({
  providedIn: 'root'
})
export class ReplicationTemplateService {
  constructor(private api: ApiService) {}

  getTemplates(): Observable<ReplicationTemplate[]> {
    return this.api.get<ReplicationTemplate[]>(API_ENDPOINTS.REPLICATION_TEMPLATES.GET_ALL);
  }

  getPublicTemplates(): Observable<ReplicationTemplate[]> {
    return this.api.get<ReplicationTemplate[]>(API_ENDPOINTS.REPLICATION_TEMPLATES.GET_ALL, { is_public: true });
  }

  getTemplate(id: number): Observable<ReplicationTemplate> {
    return this.api.getWithId<ReplicationTemplate>(API_ENDPOINTS.REPLICATION_TEMPLATES.GET_BY_ID, id);
  }

  createTemplate(template: FormData): Observable<ReplicationTemplate> {
    return this.api.postFormData<ReplicationTemplate>(API_ENDPOINTS.REPLICATION_TEMPLATES.CREATE, template);
  }

  createTemplateJson(template: Partial<ReplicationTemplate>): Observable<ReplicationTemplate> {
    return this.api.post<ReplicationTemplate>(API_ENDPOINTS.REPLICATION_TEMPLATES.CREATE, template);
  }

  updateTemplate(id: number, template: FormData): Observable<ReplicationTemplate> {
    return this.api.putFormData<ReplicationTemplate>(API_ENDPOINTS.REPLICATION_TEMPLATES.UPDATE(id), template);
  }

  updateTemplateJson(id: number, template: Partial<ReplicationTemplate>): Observable<ReplicationTemplate> {
    return this.api.put<ReplicationTemplate>(API_ENDPOINTS.REPLICATION_TEMPLATES.UPDATE(id), template);
  }

  deleteTemplate(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.REPLICATION_TEMPLATES.DELETE(id));
  }
}