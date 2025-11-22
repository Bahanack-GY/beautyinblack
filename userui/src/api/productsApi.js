import apiClient from '../lib/axios';

/**
 * Products API endpoints
 */
export const productsApi = {
  /**
   * Get all products with optional filters
   * @param {Object} params - Query parameters
   * @param {string} params.category - Filter by category (Homme, Femmes, Enfants, Mixte)
   * @param {string} params.search - Search query
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} Response with products array and pagination info
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  /**
   * Get product by ID
   * @param {number|string} id - Product ID
   * @returns {Promise} Product details
   */
  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Get best selling products (top 4)
   * @returns {Promise} Array of best selling products
   */
  getBestSellers: async () => {
    const response = await apiClient.get('/products/best-sellers');
    return response.data;
  },

  /**
   * Get products by category
   * @param {string} categoryName - Category name (homme, femmes, enfants, mixte)
   * @param {Object} params - Additional query parameters
   * @param {string} params.skinType - Filter by skin type (sèche, grasse, mixte, sensible, normale)
   * @param {string} params.search - Search query
   * @returns {Promise} Array of products in category
   */
  getByCategory: async (categoryName, params = {}) => {
    const response = await apiClient.get(`/products/category/${categoryName}`, { params });
    return response.data;
  },

  /**
   * Search products
   * @param {Object} params - Search parameters
   * @param {string} params.q - Search query string
   * @param {string} params.category - Filter by category
   * @returns {Promise} Array of matching products
   */
  search: async (params) => {
    const response = await apiClient.get('/products/search', { params });
    return response.data;
  },
};

