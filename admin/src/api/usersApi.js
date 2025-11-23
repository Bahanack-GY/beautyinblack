import apiClient from '../lib/axios';

/**
 * Users API endpoints
 * All user management operations for admin
 */

export const usersApi = {
  /**
   * Get all users with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search query
   * @param {string} params.role - Filter by role
   * @returns {Promise} Response with users array
   */
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/user', { params });
    return response.data;
  },

  /**
   * Get single user by ID
   * @param {string|number} userId - User ID
   * @returns {Promise} Response with user details
   */
  getUserById: async (userId) => {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  },

  /**
   * Get user profile (current admin)
   * @returns {Promise} Response with user profile
   */
  getUserProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Response with updated profile
   */
  updateUserProfile: async (profileData) => {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data;
  },

  /**
   * Update user by ID (admin action)
   * @param {string|number} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise} Response with updated user
   */
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/user/${userId}`, userData);
    return response.data;
  },

  /**
   * Delete user
   * @param {string|number} userId - User ID
   * @returns {Promise} Response with success message
   */
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/user/${userId}`);
    return response.data;
  },

  /**
   * Get user addresses
   * @param {string|number} userId - User ID (optional, defaults to current user)
   * @returns {Promise} Response with addresses
   */
  getUserAddresses: async (userId = null) => {
    const url = userId ? `/user/${userId}/addresses` : '/user/addresses';
    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * Add user address
   * @param {Object} addressData - Address data
   * @returns {Promise} Response with created address
   */
  addUserAddress: async (addressData) => {
    const response = await apiClient.post('/user/addresses', addressData);
    return response.data;
  },

  /**
   * Update user address
   * @param {string|number} addressId - Address ID
   * @param {Object} addressData - Updated address data
   * @returns {Promise} Response with updated address
   */
  updateUserAddress: async (addressId, addressData) => {
    const response = await apiClient.put(`/user/addresses/${addressId}`, addressData);
    return response.data;
  },

  /**
   * Delete user address
   * @param {string|number} addressId - Address ID
   * @returns {Promise} Response with success message
   */
  deleteUserAddress: async (addressId) => {
    const response = await apiClient.delete(`/user/addresses/${addressId}`);
    return response.data;
  },

  /**
   * Get user statistics
   * @returns {Promise} Response with user stats
   */
  getUserStats: async () => {
    const response = await apiClient.get('/user/stats');
    return response.data;
  },
};

