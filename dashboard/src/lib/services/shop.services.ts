import apiClient, { ApiResponse } from '../apiClient';

export interface ShopData {
  _id?: string;
  name: string;
  ownerId?: string;
  gstNumber?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  logo?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const shopService = {
  initCreateShop: async (data: Partial<ShopData>): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/shops/init-create', data);
    return response.data;
  },
  createShop: async (data: Partial<ShopData> & { otp?: string }): Promise<ApiResponse<ShopData>> => {
    const response = await apiClient.post('/shops/create', data);
    return response.data;
  },
  getShops: async (): Promise<ApiResponse<ShopData[]>> => {
    const response = await apiClient.get('/shops/all');
    return response.data;
  },
  getMyShops: async (): Promise<ApiResponse<ShopData[]>> => {
    const response = await apiClient.get('/shops/my-shops');
    return response.data;
  },
  getMyShop: async (): Promise<ApiResponse<ShopData>> => {
    const response = await apiClient.get('/shops/my-shop');
    return response.data;
  },
  updateShop: async (id: string, data: FormData | Partial<ShopData>): Promise<ApiResponse<ShopData>> => {
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
