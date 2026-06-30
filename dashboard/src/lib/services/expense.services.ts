import apiClient, { ApiResponse } from '../apiClient';

export const expenseService = {
  createExpense: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/expenses/create', data);
    return response.data;
  },
  getExpenses: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/expenses/all');
    return response.data;
  },
  updateExpense: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/expenses/update/${id}`, data);
    return response.data;
  },
  deleteExpense: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/expenses/delete/${id}`);
    return response.data;
  },
};
