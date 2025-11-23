import apiClient from '../lib/axios';

/**
 * Dashboard API endpoints
 * All dashboard statistics and analytics operations
 */

export const dashboardApi = {
  /**
   * Get dashboard statistics
   * Includes: sales stats, orders, products, users, charts data, recent orders, low stock
   * @returns {Promise} Response with dashboard data
   */
  getDashboardStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  /**
   * Get comprehensive analytics data
   * Includes: metrics, sales trends, category performance, top products
   * @returns {Promise} Response with analytics data
   */
  getAnalytics: async () => {
    const response = await apiClient.get('/analytics');
    return response.data;
  },
};


