import apiClient, { ApiResponse } from '../apiClient';

export interface SupplierData {
  _id?: string;
  name: string;
  mobile: string;
  email?: string;
  contactPerson?: string;
  paymentTerms?: string;
  notes?: string;
  address?: string;
  gstNumber?: string;
  balance?: number;
  shopId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const supplierService = {
  createSupplier: async (data: SupplierData): Promise<ApiResponse<SupplierData>> => {
    const response = await apiClient.post('/suppliers/create', data);
    return response.data;
  },
  getSuppliers: async (): Promise<ApiResponse<SupplierData[]>> => {
    const response = await apiClient.get('/suppliers/all');
    return response.data;
  },
  updateSupplier: async (id: string, data: Partial<SupplierData>): Promise<ApiResponse<SupplierData>> => {
    const response = await apiClient.put(`/suppliers/update/${id}`, data);
    return response.data;
  },
  deleteSupplier: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/suppliers/delete/${id}`);
    return response.data;
  },
};
