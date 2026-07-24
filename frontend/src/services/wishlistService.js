import { api } from './api.js';

export const wishlistService = {
  async getWishlist() {
    const { data } = await api.get('/wishlist');
    return data;
  },

  async add(productId) {
    const { data } = await api.post('/wishlist', { productId });
    return data;
  },

  async remove(productId) {
    const { data } = await api.delete(`/wishlist/${productId}`);
    return data;
  },
};
