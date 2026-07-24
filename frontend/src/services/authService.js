import { api } from './api.js';

export const authService = {
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  async login(payload) {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },

  async me() {
    const { data } = await api.get('/users/me');
    return data;
  },

  async updateProfile(payload) {
    const { data } = await api.put('/users/me', payload);
    return data;
  },

  async changePassword(payload) {
    await api.put('/users/password', payload);
  },
};
