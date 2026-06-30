import apiClient, { ApiResponse } from '../apiClient';

export interface CategoryData {
  _id?: string;
  name: string;
  slug?: string;
  shopId?: string;
  image?: string | null;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 🗂️ Category Service
 * Manages product categories mapping to Category.js model.
 */
export const categoryService = {
  /**
   * Create a new category
   * POST /categories/create
   */
  createCategory: async (data: FormData | CategoryData): Promise<ApiResponse<CategoryData>> => {
    const response = await apiClient.post('/categories/create', data);
    return response.data;
  },

  /**
   * Get all categories for the active shop
   * GET /categories/all
   */
  getCategories: async (): Promise<ApiResponse<CategoryData[]>> => {
    const response = await apiClient.get('/categories/all');
    return response.data;
  },

  /**
   * Update an existing category
   * PUT /categories/update/:id
   */
  updateCategory: async (id: string, data: FormData | Partial<CategoryData>): Promise<ApiResponse<CategoryData>> => {
    const response = await apiClient.put(`/categories/update/${id}`, data);
    return response.data;
  },

  /**
   * Delete a category
   * DELETE /categories/delete/:id
   */
  deleteCategory: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/categories/delete/${id}`);
    return response.data;
  },
};
