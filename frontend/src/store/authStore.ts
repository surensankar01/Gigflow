import { create } from 'zustand';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user: User, token: string) => {
    localStorage.setItem('gigflow_token', token);
    localStorage.setItem('gigflow_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem('gigflow_token');
    localStorage.removeItem('gigflow_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  initAuth: () => {
    const token = localStorage.getItem('gigflow_token');
    const userStr = localStorage.getItem('gigflow_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('gigflow_token');
        localStorage.removeItem('gigflow_user');
      }
    }
  },
}));
