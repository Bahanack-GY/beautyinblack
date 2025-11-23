import apiClient from '../lib/axios';

/**
 * Notifications API endpoints
 * All notification management operations for admin
 */

export const notificationsApi = {
  /**
   * Get all notifications
   * @param {Object} params - Query parameters
   * @param {boolean} params.unread - Filter unread only
   * @returns {Promise} Response with notifications array
   */
  getNotifications: async (params = {}) => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  /**
   * Get single notification by ID
   * @param {string|number} notificationId - Notification ID
   * @returns {Promise} Response with notification details
   */
  getNotificationById: async (notificationId) => {
    const response = await apiClient.get(`/notifications/${notificationId}`);
    return response.data;
  },

  /**
   * Mark notification as read
   * @param {string|number} notificationId - Notification ID
   * @returns {Promise} Response with updated notification
   */
  markAsRead: async (notificationId) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Response with success message
   */
  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },

  /**
   * Delete notification
   * @param {string|number} notificationId - Notification ID
   * @returns {Promise} Response with success message
   */
  deleteNotification: async (notificationId) => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  /**
   * Delete all notifications
   * @returns {Promise} Response with success message
   */
  deleteAllNotifications: async () => {
    const response = await apiClient.delete('/notifications/all');
    return response.data;
  },

  /**
   * Get unread count
   * @returns {Promise} Response with unread count
   */
  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },
};

