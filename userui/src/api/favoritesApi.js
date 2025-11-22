import apiClient from '../lib/axios';

/**
 * Favorites/Wishlist API endpoints
 */
export const favoritesApi = {
  /**
   * Get user's favorite products
   * @returns {Promise} Response with favorites array and count
   */
  getFavorites: async () => {
    const response = await apiClient.get('/favorites');
    return response.data;
  },

  /**
   * Add product to favorites
   * @param {Object} data - Favorite data
   * @param {number} data.productId - Product ID
   * @returns {Promise} Response with favorite data
   */
  addFavorite: async (data) => {
    const response = await apiClient.post('/favorites', data);
    return response.data;
  },

  /**
   * Remove product from favorites
   * @param {number|string} productId - Product ID
   * @returns {Promise} Response message
   */
  removeFavorite: async (productId) => {
    const response = await apiClient.delete(`/favorites/${productId}`);
    return response.data;
  },

  /**
   * Move favorite item to cart
   * @param {number|string} productId - Product ID
   * @param {Object} data - Cart item data
   * @param {string} data.size - Product size
   * @param {number} data.quantity - Quantity
   * @returns {Promise} Response message
   */
  moveToCart: async (productId, data) => {
    const response = await apiClient.post(`/favorites/${productId}/move-to-cart`, data);
    return response.data;
  },
};

