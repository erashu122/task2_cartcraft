import { api } from './api.js';

export const orderService = {
  async getOrders() {
    const { data } = await api.get('/orders');
    return data;
  },

  async getOrder(id) {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  async getAdminOrders() {
    const { data } = await api.get('/orders/admin/all');
    return data;
  },

  async updateStatus(orderId, status) {
    const { data } = await api.put('/orders/status', { orderId, status });
    return data;
  },
};
