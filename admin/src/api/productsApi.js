import apiClient from '../lib/axios';

/**
 * Products API endpoints
 * All product management operations for admin
 */

export const productsApi = {
  /**
   * Get all products with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.category - Filter by category
   * @param {string} params.search - Search query
   * @returns {Promise} Response with products array and pagination info
   */
  getProducts: async (params = {}) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  /**
   * Get single product by ID
   * @param {number|string} id - Product ID
   * @returns {Promise} Response with product details
   */
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @returns {Promise} Response with created product
   */
  createProduct: async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  /**
   * Update existing product
   * @param {number|string} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise} Response with updated product
   */
  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Delete product
   * @param {number|string} id - Product ID
   * @returns {Promise} Response with success message
   */
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Get best selling products
   * @param {number} limit - Number of products to fetch
   * @returns {Promise} Response with best sellers
   */
  getBestSellers: async (limit = 4) => {
    const response = await apiClient.get('/products/best-sellers', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Search products
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} Response with search results
   */
  searchProducts: async (query, filters = {}) => {
    const response = await apiClient.get('/products/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  /**
   * Get products by category
   * @param {string} categoryName - Category name
   * @param {Object} filters - Additional filters
   * @returns {Promise} Response with products
   */
  getProductsByCategory: async (categoryName, filters = {}) => {
    const response = await apiClient.get(`/products/category/${categoryName}`, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Bulk update products
   * @param {Array} updates - Array of product updates
   * @returns {Promise} Response with updated products
   */
  bulkUpdateProducts: async (updates) => {
    const response = await apiClient.put('/products/bulk', { updates });
    return response.data;
  },

  /**
   * Bulk delete products
   * @param {Array} ids - Array of product IDs to delete
   * @returns {Promise} Response with success message
   */
  bulkDeleteProducts: async (ids) => {
    const response = await apiClient.delete('/products/bulk', { data: { ids } });
    return response.data;
  },

  /**
   * Get product analytics
   * @param {string} id - Product ID
   * @returns {Promise} Response with product analytics data
   */
  getProductAnalytics: async (id) => {
    const response = await apiClient.get(`/products/${id}/analytics`);
    return response.data;
  },
};

