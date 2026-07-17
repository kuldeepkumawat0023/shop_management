import apiClient, { ApiResponse } from '../apiClient';

export interface AdvancePayload {
  employeeId: string;
  amount: number;
  date: string;
  repaymentTerm: 'Next Salary' | 'EMI';
  emiAmount?: number;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Settled';
  reason?: string;
}

export interface SalaryPayload {
  staffId: string;
  month: string;
  year: string;
  baseSalary: number;
  bonus?: number;
  deductions?: number;
  paymentMethod: string;
  paymentDate: string;
  notes?: string;
}

export const payrollService = {
  /**
   * Record a salary advance
   */
  grantAdvance: async (data: AdvancePayload): Promise<ApiResponse<any>> => {
    const payload = {
      staffId: data.employeeId,
      amount: data.amount,
      advanceDate: data.date,
      repaymentTerm: data.repaymentTerm,
      emiAmount: data.emiAmount,
      status: data.status,
      reason: data.reason
    };
    const response = await apiClient.post('/team/advance', payload);
    return response.data;
  },

  /**
   * Get all advances
   */
  getAdvances: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/team/advance');
    return response.data;
  },

  /**
   * Delete an advance
   */
  deleteAdvance: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/team/advance/delete/${id}`);
    return response.data;
  },

  /**
   * Process a salary payment
   */
  processSalary: async (data: SalaryPayload): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/team/salary', data);
    return response.data;
  },

  /**
   * Get all salary payments
   */
  getSalaries: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/team/salary');
    return response.data;
  }
};
