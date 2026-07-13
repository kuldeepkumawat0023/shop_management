import apiClient, { ApiResponse } from '../apiClient';

export interface ExpenseData {
  _id: string;
  shopId?: string;
  userId: any; // Could be expanded to a User interface if needed
  expenseName: string;
  amount: number;
  category: string;
  expenseDate: string;
  paymentMethod: string;
  notes?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 💸 Expense Service
 * Manages expense records mapping to Expense.js model.
 */
export const expenseService = {
  /**
   * Create a new expense
   * POST /expenses/create
   */
  createExpense: async (data: any): Promise<ApiResponse<ExpenseData>> => {
    const response = await apiClient.post('/expenses/create', data);
    return response.data;
  },

  /**
   * Get all active expenses for the shop
   * GET /expenses/all
   */
  getExpenses: async (): Promise<ApiResponse<ExpenseData[]>> => {
    const response = await apiClient.get('/expenses/all');
    return response.data;
  },

  /**
   * Get expense by ID
   * GET /expenses/get/:id
   */
  getExpenseById: async (id: string): Promise<ApiResponse<ExpenseData>> => {
    const response = await apiClient.get(`/expenses/get/${id}`);
    return response.data;
  },

  /**
   * Update an existing expense
   * PUT /expenses/update/:id
   */
  updateExpense: async (id: string, data: any): Promise<ApiResponse<ExpenseData>> => {
    const response = await apiClient.put(`/expenses/update/${id}`, data);
    return response.data;
  },

  /**
   * Delete an expense (soft delete)
   * DELETE /expenses/delete/:id
   */
  deleteExpense: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/expenses/delete/${id}`);
    return response.data;
  },
};
