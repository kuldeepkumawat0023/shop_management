import apiClient, { ApiResponse } from '../apiClient';

export const manufacturingService = {
  createManufacturingJob: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/manufacturing/create', data);
    return response.data;
  },
  getManufacturingJobs: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/manufacturing/all');
    return response.data;
  },
  updateManufacturingJob: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/manufacturing/update/${id}`, data);
    return response.data;
  },
  deleteManufacturingJob: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/manufacturing/delete/${id}`);
    return response.data;
  },
};
