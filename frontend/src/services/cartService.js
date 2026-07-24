import { api } from './api.js';

export const cartService = {
  async getCart() {
    const { data } = await api.get('/cart');
    return data;
  },

  async addItem(productId, quantity = 1) {
    const { data } = await api.post('/cart/add', { productId, quantity });
    return data;
  },

  async updateItem(itemId, quantity) {
    const { data } = await api.put('/cart', { itemId, quantity });
    return data;
  },

  async removeItem(itemId) {
    const { data } = await api.delete(`/cart/${itemId}`);
    return data;
  },

  async clear() {
    const { data } = await api.delete('/cart');
    return data;
  },
};
