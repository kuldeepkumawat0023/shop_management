import apiClient, { ApiResponse } from '../apiClient';

export const settingsService = {
  getSettings: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/settings/get');
    return response.data;
  },
  updateSettings: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put('/settings/update', data);
    return response.data;
  }
};
