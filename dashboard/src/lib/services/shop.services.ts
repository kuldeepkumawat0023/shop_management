import apiClient, { ApiResponse } from '../apiClient';

export const shopService = {
  createShop: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/shops/create', data);
    return response.data;
  },
  getShops: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/shops/all');
    return response.data;
  },
  getMyShop: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/shops/my-shop');
    return response.data;
  },
  updateShop: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/shops/update/${id}`, data);
    return response.data;
  },
  switchShop: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/shops/switch/${id}`);
    return response.data;
  },
  deleteShop: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/shops/delete/${id}`);
    return response.data;
  },
};
