import api from './api';
import { ApiResponse, User } from '../types';

interface AuthData {
  token: string;
  user: User;
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<ApiResponse<AuthData>> {
    const response = await api.post<ApiResponse<AuthData>>('/auth/register', data);
    return response.data;
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthData>> {
    const response = await api.post<ApiResponse<AuthData>>('/auth/login', data);
    return response.data;
  },

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  },
};
