import { create } from 'zustand';
import { mockApi } from '../services/mockApi';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (email, password, role) => {
    try {
      const user = await mockApi.login(email, password, role);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        set({ user, isAuthenticated: true });
        return { success: true };
      } else {
        return { success: false, message: 'Неверный email или пароль' };
      }
    } catch (error) {
      return { success: false, message: 'Ошибка входа' };
    }
  },
  register: async (userData) => {
    try {
      const newUser = await mockApi.register(userData);
      if (newUser) {
        return { success: true };
      } else {
        return { success: false, message: 'Пользователь с таким email уже существует' };
      }
    } catch (error) {
      return { success: false, message: 'Ошибка регистрации' };
    }
  },
  logout: async () => {
    localStorage.removeItem('currentUser');
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      set({ user: JSON.parse(savedUser), isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
