import apiClient, { ApiResponse } from '../apiClient';

export const recipeService = {
  createRecipe: async (data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post('/recipes/create', data);
    return response.data;
  },
  getRecipes: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get('/recipes/all');
    return response.data;
  },
  getRecipeById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get(`/recipes/${id}`);
    return response.data;
  },
  updateRecipe: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.put(`/recipes/${id}`, data);
    return response.data;
  },
  deleteRecipe: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/recipes/${id}`);
    return response.data;
  },
};
