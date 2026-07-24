import { api } from './api.js';

export const paymentService = {
  async createSession() {
    const { data } = await api.post('/payment/create-session');
    return data;
  },
};
