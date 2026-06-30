import apiClient, { ApiResponse } from '../apiClient';

/**
 * 📈 Dashboard Service
 * Synced exactly with backend/src/routes/dashboardRoutes.js
 */
export const dashboardService = {
  /**
   * Get main dashboard analytics
   * GET /api/dashboard/stats
   */
  getStats: async (filters?: { startDate?: string; endDate?: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/dashboard/stats', { params: filters });
    return response.data;
  }
};
