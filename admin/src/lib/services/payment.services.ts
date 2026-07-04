import apiClient, { ApiResponse } from '../apiClient';

export const paymentService = {
  recordPayment: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/payments/create', data);
    return response.data;
  },
  getPayments: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/payments/all');
    return response.data;
  },
};
