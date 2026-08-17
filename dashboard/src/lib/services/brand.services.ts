import apiClient, { ApiResponse } from '../apiClient';

export interface BrandData {
  _id?: string;
  name: string;
  shopId?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 🏷️ Brand Service
 * Manages product brands mapping to Brand.js model.
 */
export const brandService = {
  /**
   * Create a new brand
   * POST /brands/create
   */
  createBrand: async (data: FormData | BrandData): Promise<ApiResponse<BrandData>> => {
    const response = await apiClient.post('/brands/create', data);
    return response.data;
  },

  /**
   * Get all brands for the active shop
   * GET /brands/all
   */
  getBrands: async (): Promise<ApiResponse<BrandData[]>> => {
    const response = await apiClient.get('/brands/all');
    return response.data;
  },

  /**
   * Update an existing brand
   * PUT /brands/update/:id
   */
  updateBrand: async (id: string, data: FormData | Partial<BrandData>): Promise<ApiResponse<BrandData>> => {
    const response = await apiClient.put(`/brands/update/${id}`, data);
    return response.data;
  },

  /**
   * Delete a brand
   * DELETE /brands/delete/:id
   */
  deleteBrand: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/brands/delete/${id}`);
    return response.data;
  },
};
