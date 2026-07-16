import apiClient, { ApiResponse } from '../apiClient';

export interface CustomRoleData {
  _id: string;
  roleName: string;
  description: string;
  permissions: string[];
  shopId?: string | null;
  isActive: boolean;
  isDefault?: boolean;
}

export interface PermissionModule {
  module: string;
  label: string;
  permissions: { key: string; label: string }[];
}

export const roleService = {
  getRoles: async (): Promise<ApiResponse<CustomRoleData[]>> => {
    const response = await apiClient.get('/roles/all');
    return response.data;
  },

  getPermissions: async (): Promise<ApiResponse<PermissionModule[]>> => {
    const response = await apiClient.get('/roles/permissions');
    return response.data;
  },

  createRole: async (data: Partial<CustomRoleData>): Promise<ApiResponse<CustomRoleData>> => {
    const response = await apiClient.post('/roles/create', data);
    return response.data;
  },

  updateRole: async (id: string, data: Partial<CustomRoleData>): Promise<ApiResponse<CustomRoleData>> => {
    const response = await apiClient.put(`/roles/update/${id}`, data);
    return response.data;
  },

  deleteRole: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/roles/delete/${id}`);
    return response.data;
  }
};
