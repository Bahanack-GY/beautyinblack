import apiClient from '../lib/axios';

/**
 * User profile and addresses API endpoints
 */
export const userApi = {
  /**
   * Get user profile information
   * @returns {Promise} User profile data
   */
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @param {string} profileData.name - User name
   * @param {string} profileData.phone - User phone
   * @param {string} profileData.profileImage - Profile image URL
   * @returns {Promise} Updated user data
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data;
  },

  /**
   * Get user's addresses
   * @returns {Promise} Response with addresses array
   */
  getAddresses: async () => {
    const response = await apiClient.get('/user/addresses');
    return response.data;
  },

  /**
   * Add new address
   * @param {Object} addressData - Address data
   * @param {string} addressData.street - Street address
   * @param {string} addressData.city - City
   * @param {string} addressData.country - Country
   * @param {string} addressData.postalCode - Postal code
   * @param {boolean} addressData.isDefault - Is default address
   * @returns {Promise} Response with created address
   */
  addAddress: async (addressData) => {
    const response = await apiClient.post('/user/addresses', addressData);
    return response.data;
  },

  /**
   * Update address
   * @param {number|string} addressId - Address ID
   * @param {Object} addressData - Address update data
   * @returns {Promise} Updated address data
   */
  updateAddress: async (addressId, addressData) => {
    const response = await apiClient.put(`/user/addresses/${addressId}`, addressData);
    return response.data;
  },

  /**
   * Delete address
   * @param {number|string} addressId - Address ID
   * @returns {Promise} Response message
   */
  deleteAddress: async (addressId) => {
    const response = await apiClient.delete(`/user/addresses/${addressId}`);
    return response.data;
  },
};

