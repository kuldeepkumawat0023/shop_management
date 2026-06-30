import apiClient, { ApiResponse } from '../apiClient';

export const purchaseService = {
  createPurchase: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/purchases/create', data);
    return response.data;
  },
  getPurchases: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/purchases/all');
    return response.data;
  },
  getPurchaseById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/purchases/get/${id}`);
    return response.data;
  },
};
