import apiClient from '../lib/axios';

/**
 * Cart API endpoints
 */
export const cartApi = {
  /**
   * Get user's cart items
   * @returns {Promise} Cart data with items, subtotal, shipping, and total
   */
  getCart: async () => {
    const response = await apiClient.get('/cart');
    return response.data;
  },

  /**
   * Add item to cart
   * @param {Object} item - Cart item data
   * @param {number} item.productId - Product ID
   * @param {string} item.size - Product size
   * @param {number} item.quantity - Quantity
   * @returns {Promise} Response with updated cart
   */
  addItem: async (item) => {
    const response = await apiClient.post('/cart', item);
    return response.data;
  },

  /**
   * Update cart item quantity
   * @param {number|string} itemId - Cart item ID
   * @param {Object} data - Update data
   * @param {number} data.quantity - New quantity
   * @returns {Promise} Updated cart item
   */
  updateItem: async (itemId, data) => {
    const response = await apiClient.put(`/cart/${itemId}`, data);
    return response.data;
  },

  /**
   * Remove item from cart
   * @param {number|string} itemId - Cart item ID
   * @returns {Promise} Response message
   */
  removeItem: async (itemId) => {
    const response = await apiClient.delete(`/cart/${itemId}`);
    return response.data;
  },

  /**
   * Checkout cart and create order
   * @param {Object} checkoutData - Checkout data
   * @param {string} checkoutData.addressId - Address ID
   * @param {string} checkoutData.paymentMethod - Payment method (OM or MOMO)
   * @param {string} checkoutData.paymentScreenshot - Payment screenshot in base64
   * @returns {Promise} Response with order ID
   */
  checkout: async (checkoutData) => {
    const response = await apiClient.post('/cart/checkout', checkoutData);
    return response.data;
  },
};

