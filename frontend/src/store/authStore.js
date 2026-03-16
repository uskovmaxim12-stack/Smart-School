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
        set({ user, isAuthenticated: true });
        return { success: true };
      } else {
        return { success: false, message: 'Неверный email или пароль' };
      }
    } catch (error) {
      return { success: false, message: error.message || 'Ошибка входа' };
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
      return { success: false, message: error.message || 'Ошибка регистрации' };
    }
  },
  logout: async () => {
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    // При загрузке пытаемся восстановить сессию из localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      set({ user: JSON.parse(savedUser), isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
