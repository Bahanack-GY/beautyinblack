import apiClient from '../lib/axios';

/**
 * Notifications API endpoints
 */
export const notificationsApi = {
  /**
   * Get user notifications
   * @param {Object} params - Query parameters
   * @param {boolean} params.unread - Filter unread only
   * @returns {Promise} Response with notifications array and unread count
   */
  getNotifications: async (params = {}) => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  /**
   * Mark notification as read
   * @param {number|string} notificationId - Notification ID
   * @returns {Promise} Response message
   */
  markAsRead: async (notificationId) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Response message
   */
  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },
};

