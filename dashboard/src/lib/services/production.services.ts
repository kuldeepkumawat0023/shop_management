import apiClient, { ApiResponse } from '../apiClient';

export const productionService = {
  logProduction: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/production/create', data);
    return response.data;
  }
};
