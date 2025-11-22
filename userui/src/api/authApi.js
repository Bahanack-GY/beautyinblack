import apiClient from '../lib/axios';

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * User login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise} Response with token and user data
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * User registration
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User name
   * @param {string} userData.email - User email
   * @param {string} userData.phone - User phone
   * @param {string} userData.password - User password
   * @param {string} userData.confirmPassword - Password confirmation
   * @returns {Promise} Response with token and user data
   */
  signup: async (userData) => {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  },

  /**
   * Request password reset
   * @param {Object} data - Password reset request data
   * @param {string} data.email - User email
   * @returns {Promise} Response message
   */
  forgotPassword: async (data) => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   * @param {Object} data - Password reset data
   * @param {string} data.token - Reset token
   * @param {string} data.password - New password
   * @param {string} data.confirmPassword - Password confirmation
   * @returns {Promise} Response message
   */
  resetPassword: async (data) => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },
};

