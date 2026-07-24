import { api } from './api.js';

export const reviewService = {
  async getReviews(productId) {
    const { data } = await api.get(`/reviews/${productId}`);
    return data;
  },

  async saveReview(payload) {
    const { data } = await api.post('/reviews', payload);
    return data;
  },
};
