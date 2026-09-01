// ============================================================
// BRIDGE-AI Kenya - Training Material Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { TrainingMaterial, TrainingMaterialFilterParams } from '../features/core/models/training-material.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingMaterialService {
  constructor(private api: ApiService) {}

  getMaterials(): Observable<TrainingMaterial[]> {
    return this.api.get<TrainingMaterial[]>(API_ENDPOINTS.TRAINING_MATERIALS.GET_ALL);
  }

  getFilteredMaterials(params: TrainingMaterialFilterParams): Observable<TrainingMaterial[]> {
    return this.api.get<TrainingMaterial[]>(API_ENDPOINTS.TRAINING_MATERIALS.GET_ALL, params);
  }

  getPublicMaterials(): Observable<TrainingMaterial[]> {
    return this.api.get<TrainingMaterial[]>(API_ENDPOINTS.TRAINING_MATERIALS.GET_ALL, { is_public: true });
  }

  getMaterial(id: number): Observable<TrainingMaterial> {
    return this.api.getWithId<TrainingMaterial>(API_ENDPOINTS.TRAINING_MATERIALS.GET_BY_ID, id);
  }

  getMaterialBySlug(slug: string): Observable<TrainingMaterial> {
    return this.api.get<TrainingMaterial>(API_ENDPOINTS.TRAINING_MATERIALS.GET_BY_SLUG(slug));
  }

  createMaterial(material: FormData): Observable<TrainingMaterial> {
    return this.api.postFormData<TrainingMaterial>(API_ENDPOINTS.TRAINING_MATERIALS.CREATE, material);
  }

  createMaterialJson(material: Partial<TrainingMaterial>): Observable<TrainingMaterial> {
    return this.api.post<TrainingMaterial>(API_ENDPOINTS.TRAINING_MATERIALS.CREATE, material);
  }

  updateMaterial(id: number, material: FormData): Observable<TrainingMaterial> {
    return this.api.putFormData<TrainingMaterial>(API_ENDPOINTS.TRAINING_MATERIALS.UPDATE(id), material);
  }

  updateMaterialJson(id: number, material: Partial<TrainingMaterial>): Observable<TrainingMaterial> {
    return this.api.put<TrainingMaterial>(API_ENDPOINTS.TRAINING_MATERIALS.UPDATE(id), material);
  }

  deleteMaterial(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.TRAINING_MATERIALS.DELETE(id));
  }
}