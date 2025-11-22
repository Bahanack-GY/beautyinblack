import apiClient from '../lib/axios';

/**
 * Categories API endpoints
 */
export const categoriesApi = {
  /**
   * Get all categories with images
   * @returns {Promise} Response with categories array
   */
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
};

