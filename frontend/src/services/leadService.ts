import api from './api';
import {
  ApiResponse,
  Lead,
  LeadFilters,
  LeadFormData,
  LeadStats,
} from '../types';

export const leadService = {
  async getLeads(
    filters: Partial<LeadFilters>
  ): Promise<ApiResponse<Lead[]>> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);

    const response = await api.get<ApiResponse<Lead[]>>(
      `/leads?${params.toString()}`
    );
    return response.data;
  },

  async getLead(id: string): Promise<ApiResponse<Lead>> {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return response.data;
  },

  async createLead(data: LeadFormData): Promise<ApiResponse<Lead>> {
    const response = await api.post<ApiResponse<Lead>>('/leads', data);
    return response.data;
  },

  async updateLead(
    id: string,
    data: Partial<LeadFormData>
  ): Promise<ApiResponse<Lead>> {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return response.data;
  },

  async deleteLead(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return response.data;
  },

  async getStats(): Promise<ApiResponse<LeadStats>> {
    const response = await api.get<ApiResponse<LeadStats>>('/leads/stats');
    return response.data;
  },

  async exportCSV(filters: Partial<LeadFilters>): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);

    const response = await api.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data as Blob;
  },
};
