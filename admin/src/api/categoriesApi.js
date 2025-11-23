import apiClient from '../lib/axios';

/**
 * Categories API endpoints
 * All category management operations for admin
 */

export const categoriesApi = {
  /**
   * Get all categories
   * @returns {Promise} Response with categories array
   */
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  /**
   * Get single category by ID
   * @param {string|number} id - Category ID
   * @returns {Promise} Response with category details
   */
  getCategoryById: async (id) => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  /**
   * Create new category
   * @param {Object} categoryData - Category data
   * @returns {Promise} Response with created category
   */
  createCategory: async (categoryData) => {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
  },

  /**
   * Update existing category
   * @param {string|number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise} Response with updated category
   */
  updateCategory: async (id, categoryData) => {
    const response = await apiClient.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  /**
   * Delete category
   * @param {string|number} id - Category ID
   * @returns {Promise} Response with success message
   */
  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};

