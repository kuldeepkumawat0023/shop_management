import apiClient, { ApiResponse } from '../apiClient';

export const roleService = {
  createRole: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/roles/create', data);
    return response.data;
  },
  getRoles: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/roles/all');
    return response.data;
  },
  updateRole: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/roles/update/${id}`, data);
    return response.data;
  },
  deleteRole: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/roles/delete/${id}`);
    return response.data;
  },
};
