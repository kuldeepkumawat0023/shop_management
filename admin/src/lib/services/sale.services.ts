import apiClient, { ApiResponse } from '../apiClient';

export const saleService = {
  createSale: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/sales/create', data);
    return response.data;
  },
  getSales: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/sales/all');
    return response.data;
  },
  getSaleById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/sales/get/${id}`);
    return response.data;
  },
  syncOfflineSales: async (bills: any[]): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/sales/sync', { bills });
    return response.data;
  }
};
