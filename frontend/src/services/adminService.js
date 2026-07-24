import { api } from './api.js';

export const adminService = {
  async getDashboard() {
    const { data } = await api.get('/admin/dashboard');
    return data;
  },

  async getCustomers() {
    const { data } = await api.get('/admin/customers');
    return data;
  },

  async getLowStockProducts() {
    const { data } = await api.get('/admin/inventory/low-stock');
    return data;
  },

  async getTopProducts() {
    const { data } = await api.get('/admin/top-products');
    return data;
  },
};
