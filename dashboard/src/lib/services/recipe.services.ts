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
};
