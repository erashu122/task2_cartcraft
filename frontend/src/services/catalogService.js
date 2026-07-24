import { api } from './api.js';

export const catalogService = {
  async getCategories() {
    const { data } = await api.get('/categories');
    return data;
  },

  async createCategory(payload) {
    const { data } = await api.post('/categories', payload);
    return data;
  },

  async getProducts(params = {}) {
    const { data } = await api.get('/products', { params });
    return data;
  },

  async getProduct(id) {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  async createProduct(payload) {
    const { data } = await api.post('/products', payload);
    return data;
  },

  async updateProduct(id, payload) {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
  },

  async deleteProduct(id) {
    await api.delete(`/products/${id}`);
  },
};
