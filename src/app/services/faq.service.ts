// ============================================================
// BRIDGE-AI Kenya - FAQ Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { FAQ } from '../features/core/models/faq.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  constructor(private api: ApiService) {}

  getFaqs(): Observable<FAQ[]> {
    return this.api.get<FAQ[]>(API_ENDPOINTS.FAQS.GET_ALL);
  }

  getPublishedFaqs(): Observable<FAQ[]> {
    return this.api.get<FAQ[]>(API_ENDPOINTS.FAQS.GET_ALL, { is_published: true });
  }

  getFaqsByAudience(audience: string): Observable<FAQ[]> {
    return this.api.get<FAQ[]>(API_ENDPOINTS.FAQS.GET_ALL, { audience });
  }

  getFaq(id: number): Observable<FAQ> {
    return this.api.getWithId<FAQ>(API_ENDPOINTS.FAQS.GET_BY_ID, id);
  }

  createFaq(faq: Partial<FAQ>): Observable<FAQ> {
    return this.api.post<FAQ>(API_ENDPOINTS.FAQS.CREATE, faq);
  }

  updateFaq(id: number, faq: Partial<FAQ>): Observable<FAQ> {
    return this.api.put<FAQ>(API_ENDPOINTS.FAQS.UPDATE(id), faq);
  }

  deleteFaq(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.FAQS.DELETE(id));
  }
}