import apiClient, { ApiResponse } from '../apiClient';

export interface CustomerData {
  _id?: string;
  name: string;
  mobile: string;
  email?: string;
  company?: string;
  notes?: string;
  address?: string;
  creditLimit?: number;
  dueAmount?: number;
  shopId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 👥 Customer Service
 * Manages customers mapped to Customer.js model.
 */
export const customerService = {
  /**
   * Create a new customer
   * POST /customers/create
   */
  createCustomer: async (data: CustomerData): Promise<ApiResponse<CustomerData>> => {
    const response = await apiClient.post('/customers/create', data);
    return response.data;
  },

  /**
   * Get all customers for the active shop
   * GET /customers/all
   */
  getCustomers: async (): Promise<ApiResponse<CustomerData[]>> => {
    const response = await apiClient.get('/customers/all');
    return response.data;
  },

  /**
   * Get customer by ID
   * GET /customers/get/:id
   */
  getCustomerById: async (id: string): Promise<ApiResponse<CustomerData>> => {
    const response = await apiClient.get(`/customers/get/${id}`);
    return response.data;
  },

  /**
   * Update a customer's details
   * PUT /customers/update/:id
   */
  updateCustomer: async (id: string, data: Partial<CustomerData>): Promise<ApiResponse<CustomerData>> => {
    const response = await apiClient.put(`/customers/update/${id}`, data);
    return response.data;
  },

  /**
   * Delete a customer
   * DELETE /customers/delete/:id
   */
  deleteCustomer: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/customers/delete/${id}`);
    return response.data;
  },
};
