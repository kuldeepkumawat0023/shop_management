import apiClient, { ApiResponse } from '../apiClient';

export const productionService = {
  logProduction: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/production/create', data);
    return response.data;
  },
  getProductions: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/production/all');
    return response.data;
  },
  getProductionById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/production/${id}`);
    return response.data;
  },
  deleteProduction: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/production/${id}`);
    return response.data;
  }
};
