// ============================================================
// BRIDGE-AI Kenya - Partner Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { Partner } from '../features/core/models/partner.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  constructor(private api: ApiService) {}

  getPartners(): Observable<Partner[]> {
    return this.api.get<Partner[]>(API_ENDPOINTS.PARTNERS.GET_ALL);
  }

  getPublishedPartners(): Observable<Partner[]> {
    return this.api.get<Partner[]>(API_ENDPOINTS.PARTNERS.GET_ALL, { is_published: true });
  }

  getConsortiumPartners(): Observable<Partner[]> {
    return this.api.get<Partner[]>(API_ENDPOINTS.PARTNERS.GET_ALL, { is_consortium: true });
  }

  getPartner(id: number): Observable<Partner> {
    return this.api.getWithId<Partner>(API_ENDPOINTS.PARTNERS.GET_BY_ID, id);
  }

  createPartner(partner: FormData): Observable<Partner> {
    return this.api.postFormData<Partner>(API_ENDPOINTS.PARTNERS.CREATE, partner);
  }

  createPartnerJson(partner: Partial<Partner>): Observable<Partner> {
    return this.api.post<Partner>(API_ENDPOINTS.PARTNERS.CREATE, partner);
  }

  updatePartner(id: number, partner: FormData): Observable<Partner> {
    return this.api.putFormData<Partner>(API_ENDPOINTS.PARTNERS.UPDATE(id), partner);
  }

  updatePartnerJson(id: number, partner: Partial<Partner>): Observable<Partner> {
    return this.api.put<Partner>(API_ENDPOINTS.PARTNERS.UPDATE(id), partner);
  }

  deletePartner(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.PARTNERS.DELETE(id));
  }
}