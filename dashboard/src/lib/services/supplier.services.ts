import apiClient, { ApiResponse } from '../apiClient';

export const supplierService = {
  createSupplier: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/suppliers/create', data);
    return response.data;
  },
  getSuppliers: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/suppliers/all');
    return response.data;
  },
  updateSupplier: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/suppliers/update/${id}`, data);
    return response.data;
  },
  deleteSupplier: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/suppliers/delete/${id}`);
    return response.data;
  },
};
