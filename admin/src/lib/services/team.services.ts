import apiClient, { ApiResponse } from '../apiClient';

export const teamService = {
  addStaff: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/team/create', data);
    return response.data;
  },
  getStaff: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/team/all');
    return response.data;
  },
  recordAdvance: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/team/advance', data);
    return response.data;
  },
  recordExpense: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/team/expense', data);
    return response.data;
  },
};
