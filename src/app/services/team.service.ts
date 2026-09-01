// ============================================================
// BRIDGE-AI Kenya - Team Service
// ============================================================

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../features/core/services/api.service';
import { API_ENDPOINTS } from '../features/core/constants/api.constants';
import { TeamMember } from '../features/core/models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor(private api: ApiService) {}

  getTeamMembers(): Observable<TeamMember[]> {
    return this.api.get<TeamMember[]>(API_ENDPOINTS.TEAM.GET_ALL);
  }

  getVisibleTeamMembers(): Observable<TeamMember[]> {
    return this.api.get<TeamMember[]>(API_ENDPOINTS.TEAM.GET_ALL, { is_visible: true });
  }

  getApprovedTeamMembers(): Observable<TeamMember[]> {
    return this.api.get<TeamMember[]>(API_ENDPOINTS.TEAM.GET_ALL, { consent_status: 'approved' });
  }

  getTeamMember(id: number): Observable<TeamMember> {
    return this.api.getWithId<TeamMember>(API_ENDPOINTS.TEAM.GET_BY_ID, id);
  }

  createTeamMember(member: FormData): Observable<TeamMember> {
    return this.api.postFormData<TeamMember>(API_ENDPOINTS.TEAM.CREATE, member);
  }

  createTeamMemberJson(member: Partial<TeamMember>): Observable<TeamMember> {
    return this.api.post<TeamMember>(API_ENDPOINTS.TEAM.CREATE, member);
  }

  updateTeamMember(id: number, member: FormData): Observable<TeamMember> {
    return this.api.putFormData<TeamMember>(API_ENDPOINTS.TEAM.UPDATE(id), member);
  }

  updateTeamMemberJson(id: number, member: Partial<TeamMember>): Observable<TeamMember> {
    return this.api.put<TeamMember>(API_ENDPOINTS.TEAM.UPDATE(id), member);
  }

  deleteTeamMember(id: number): Observable<void> {
    return this.api.delete<void>(API_ENDPOINTS.TEAM.DELETE(id));
  }
}