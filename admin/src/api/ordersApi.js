import apiClient from '../lib/axios';

/**
 * Orders API endpoints
 * All order management operations for admin
 */

export const ordersApi = {
  /**
   * Get all orders with filters
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (en_cours, livraison, livre)
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} Response with orders array
   */
  getOrders: async (params = {}) => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  /**
   * Get single order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise} Response with order details and tracking
   */
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @returns {Promise} Response with created order
   */
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {Object} data - Update data
   * @param {string} data.status - New status
   * @returns {Promise} Response with updated order
   */
  updateOrderStatus: async (orderId, data) => {
    const response = await apiClient.put(`/orders/${orderId}/status`, data);
    return response.data;
  },

  /**
   * Update order
   * @param {string} orderId - Order ID
   * @param {Object} orderData - Updated order data
   * @returns {Promise} Response with updated order
   */
  updateOrder: async (orderId, orderData) => {
    const response = await apiClient.put(`/orders/${orderId}`, orderData);
    return response.data;
  },

  /**
   * Cancel order
   * @param {string} orderId - Order ID
   * @returns {Promise} Response with success message
   */
  cancelOrder: async (orderId) => {
    const response = await apiClient.delete(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Get order statistics
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with statistics
   */
  getOrderStats: async (params = {}) => {
    const response = await apiClient.get('/orders/stats', { params });
    return response.data;
  },

  /**
   * Export orders to CSV
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with file data
   */
  exportOrders: async (params = {}) => {
    const response = await apiClient.get('/orders/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

