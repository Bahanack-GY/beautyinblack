import apiClient from '../lib/axios';

/**
 * Auth API endpoints
 * All authentication-related API calls
 */

export const authApi = {
  /**
   * Admin login
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - Admin email
   * @param {string} credentials.password - Admin password
   * @returns {Promise} Response with token and user data
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Admin signup/register
   * @param {Object} data - Registration data
   * @returns {Promise} Response with token and user data
   */
  signup: async (data) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  /**
   * Request password reset
   * @param {Object} data - Email data
   * @param {string} data.email - Email address
   * @returns {Promise} Response with message
   */
  forgotPassword: async (data) => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   * @param {Object} data - Reset password data
   * @param {string} data.token - Reset token
   * @param {string} data.password - New password
   * @param {string} data.confirmPassword - Confirm new password
   * @returns {Promise} Response with message
   */
  resetPassword: async (data) => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Get current admin profile
   * @returns {Promise} Response with user data
   */
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  /**
   * Logout (client-side token removal)
   */
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },
};

