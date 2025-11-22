import apiClient from '../lib/axios';

/**
 * Orders API endpoints
 */
export const ordersApi = {
  /**
   * Get user's orders
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (en_cours, livraison, livre)
   * @returns {Promise} Response with orders array
   */
  getOrders: async (params = {}) => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  /**
   * Get order details and tracking by ID
   * @param {number|string} orderId - Order ID
   * @returns {Promise} Order details with tracking information
   */
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @param {Array} orderData.items - Order items
   * @param {number} orderData.addressId - Address ID
   * @param {string} orderData.paymentMethod - Payment method
   * @returns {Promise} Response with order ID and order data
   */
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },
};

