import apiClient, { ApiResponse, AuthUser } from '../apiClient';

export const userService = {
  getProfile: async (id: string): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.get(`/users/profile/${id}`);
    return response.data;
  },
  updateProfile: async (id: string, data: any): Promise<ApiResponse<AuthUser>> => {
    const response = await apiClient.put(`/users/profile/update/${id}`, data);
    return response.data;
  },
  getAllUsers: async (): Promise<ApiResponse<AuthUser[]>> => {
    const response = await apiClient.get('/users/all');
    return response.data;
  },
  createStaff: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/users/staff', data);
    return response.data;
  },
  deleteProfile: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/users/profile/delete/${id}`);
    return response.data;
  }
};
