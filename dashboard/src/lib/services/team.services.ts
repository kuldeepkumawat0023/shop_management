import apiClient, { ApiResponse } from '../apiClient';

export interface StaffData {
  _id?: string;
  name: string;
  email?: string;
  mobile: string;
  dob?: string;
  role: string;
  department?: string;
  baseSalary?: number;
  joiningDate?: string;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  isActive?: boolean;
  shopId?: string;
  userId?: any;
}

export const teamService = {
  addStaff: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/team/create', data);
    return response.data;
  },
  getStaff: async (): Promise<ApiResponse<StaffData[]>> => {
    const response = await apiClient.get('/team/all');
    return response.data;
  },
  getStaffById: async (id: string): Promise<ApiResponse<StaffData>> => {
    const response = await apiClient.get(`/team/${id}`);
    return response.data;
  },
  updateStaff: async (id: string, data: any): Promise<ApiResponse<StaffData>> => {
    const response = await apiClient.put(`/team/update/${id}`, data);
    return response.data;
  },
  deleteStaff: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/team/delete/${id}`);
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
