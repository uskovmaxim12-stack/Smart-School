import { mockApi } from './mockApi';

// Для совместимости с существующим кодом, просто экспортируем mockApi как api
export const api = {
  get: async (url) => {
    // Простейшая имитация GET-запросов
    if (url === '/users/me') {
      const user = mockApi.getCurrentUser();
      return { data: user };
    }
    // По необходимости добавляй другие заглушки
    return { data: [] };
  },
  post: async (url, data) => {
    if (url === '/auth/login') {
      const { email, password } = data;
      // В role передаётся отдельно, но в нашем login она приходит не так, упростим
      const user = await mockApi.login(email, password, data.role || 'student');
      return { data: { accessToken: 'fake-token', user } };
    }
    return { data: {} };
  },
  // Добавь другие методы (put, delete) по необходимости
};

export default api;
