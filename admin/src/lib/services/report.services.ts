import apiClient, { ApiResponse } from '../apiClient';

export const reportService = {
  exportGSTR1: async (filters?: { month: string; year: string }): Promise<ApiResponse<any>> => {
    // Allows downloading or getting report data for GSTR1
    const response = await apiClient.get('/reports/gstr1', { params: filters });
    return response.data;
  },
};
